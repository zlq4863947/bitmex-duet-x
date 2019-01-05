import { Injectable } from '@angular/core';
import { BitmexWS } from 'bitmex-ws';
import { ExchangeOptions } from 'bitmex-ws/lib/types';
import { Job } from 'node-schedule';

import { ApplicationSettings, ExchangeSettings } from '@duet-core/types';
import { NotificationsService, SettingsService } from '@duet-core/utils';

import { MysqlService } from '../app/@core/services/mysql/mysql.service';
import { Log } from '../app/@core/services/mysql/entity';
import { Helper, Scheduler, logger } from './common';
import { ichimoku, sma } from './indicator';
import { Trader } from './trader';
import * as types from './type';
import { OrderSide, OrderStatus } from './type';

// 机器人运行状态
export enum RobotState {
  // 策略执行中
  Ruling = 'Ruling',
  // 订单中
  Ordering = 'Ordering'
}

export interface IStatus {
  symbol: string;
  resolution: number;
  resolutionName: string;
  amount: number;
  leverage: number;
  side: types.OrderSide;
  inverseSide: types.OrderSide;
  isInitSell: boolean;
  // 是否真实下单
  isOrder: boolean;
  robotState: RobotState;
  orderInfo?: types.Order; 
  // 当前步骤
  step: types.Step;
}

export interface RuleOutput {
  action?: types.OrderSide;
  close: number;
}

@Injectable({
  providedIn: 'root',
})
export class Robot {
  settings: ApplicationSettings;
  status: IStatus;
  event: Event;
  // 交易者
  trader: Trader;
  ws: BitmexWS;
  job?: Job;
  isFrist = true;

  constructor(
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
    private mysqlService: MysqlService,
  ) {}

  reload() {
    const config = this.settingsService.getApplicationSettings();
    const side = <types.OrderSide>config.trading.side;
    this.status = {
      symbol: config.actions.symbol,
      amount: config.trading.amount,
      side,
      leverage: config.trading.leverage,
      resolution: +config.actions.resolution.resolution,
      resolutionName: config.actions.resolution.name,
      inverseSide: side === types.OrderSide.Sell ? types.OrderSide.Buy : types.OrderSide.Sell,
      isInitSell: side === types.OrderSide.Sell,
      isOrder: true,
      robotState: RobotState.Ruling,
      step: types.Step.Order1,
    };
    this.syncProcess();
    this.trader = new Trader(config.exchange);
    const exOptions = this.getExchangeOptions(config.exchange);
    this.ws = new BitmexWS(exOptions);
    this.ws.order$(this.status.symbol).subscribe(async (order) => {
      logger.info(`subscribe order: ${JSON.stringify(order)}`);
      if (order && order.ordStatus && order.ordStatus !== OrderStatus.New) {
        const fmtOrder: types.Order = {
          orderID: order.orderID,
          symbol: order.symbol,
          orderQty: order.orderQty,
          price: order.price,
          ordStatus: order.ordStatus,
        }
        await this.mysqlService.syncOrder(fmtOrder);
      }
    });
  }

  private getExchangeOptions(config: ExchangeSettings) {
    let exOptions: ExchangeOptions;
    if (config.mode === 'test') {
      const test = config.test;
      exOptions = {
        apiKey: test.apiKey,
        apiSecret: test.secret,
        testnet: true,
      };
    } else {
      const real = config.real;
      exOptions = {
        apiKey: real.apiKey,
        apiSecret: real.secret,
        testnet: false,
      };
    }
    return exOptions;
  }

  syncProcess() {
    const process = this.settingsService.getProcess();
    process.status = this.status;
    this.settingsService.setProcess(process);
  }

  async start() {
    if (this.job) {
      this.notificationsService.error({
        title: '禁止重复启动机器人！！',
      });
      return;
    }
    this.reload();
    this.job = Scheduler.min(this.status.resolution, async () => {
      try {
        const result = await this.checkStatus();
        // 继续执行
        if (!result) return;
        this.notificationsService.success({
          title: `执行${this.status.resolution}分钟定时任务...`,
        });
        logger.info(`系统状态: ${JSON.stringify(this.status)}`);
        const res = await this.rule();
        if (res.action) {
          await this.doOrder(res.action, res.close);
        }
      } catch (err) {
        logger.error(`定时任务[异常终了] ${err.message}`);
      }
    });
    logger.info(`启动机器人`);
    if (this.isFrist) {
      await this.trader.updateLeverage(this.status.symbol, this.status.leverage);
      this.notificationsService.success({
        title: `更新${this.status.symbol}杠杆为:${this.status.leverage}`,
      });
    }
    this.isFrist = false;
  }

  stop() {
    if (this.job) {
      this.job.cancel();
      this.job = undefined;
      logger.info(`停止机器人`);
      return true;
    }
    return false;
  }

  /**
   * 检查同步状态,返回是否可以继续执行的结果
   */
  private async checkStatus(): Promise<Boolean> {
    try {

      if (this.status.orderInfo) {
        const orderId = this.status.orderInfo.orderID;
        // 获取交易所订单信息
        const onlineOrder = await this.trader.getOrderById(this.status.symbol, orderId);
        // 没有在线订单
        if (!onlineOrder) {
          const logText = `未查询到委托ID:${orderId}`;
          this.notificationsService.error({
            title: logText,
          });
          logger.error(logText);
          return;
        }
        if (onlineOrder.ordStatus === types.OrderStatus.New) {
          return false;
        }
        const dbOrder = await this.mysqlService.getOrderById(orderId);
        if (!dbOrder || onlineOrder.ordStatus !== dbOrder.status) {
          // 同步订单状态
          await this.mysqlService.syncOrder(onlineOrder)
      
          switch (onlineOrder.ordStatus) {
            case types.OrderStatus.Canceled:
            case types.OrderStatus.Rejected:
              this.status.orderInfo = undefined;
              this.status.robotState = RobotState.Ruling;
              return true;
            case types.OrderStatus.PartiallyFilled:
              return false;
            case types.OrderStatus.Filled:
              this.status.orderInfo = undefined;
              this.status.robotState = RobotState.Ruling;
              this.status.step = this.status.step === types.Step.Order1 ? types.Step.Order2 : types.Step.Order1;
              return true;
          }
        }
      }
      return true;
    } catch (err) {
      logger.error(`状态检查[异常终了] ${err.message}`);
    }
  }

  async doOrder(ruleAction: types.OrderSide, price: number) {
    logger.info(`执行订单${this.status.step}[启动]`);

    try {
      const timer = Helper.getTimer();
      const action = this.getOrderSide(this.status.step);
      // 买入/卖出动作 == 本次动作
      if (action === ruleAction) {
        // this.status.step === types.Step.Order1
        const input = {
          symbol: this.status.symbol,
          side: ruleAction,
          price,
          amount: this.status.amount,
        };
        logger.info(`订单信息: ${JSON.stringify(input)}`);
        if (this.status.isOrder) {
          this.status.robotState = RobotState.Ordering;
          const orderInfo = await this.trader.order(input);
          this.status.orderInfo = orderInfo;
          const saveRes = await this.mysqlService.saveOrder(orderInfo);
          logger.info(`saveRes: ${JSON.stringify(saveRes)}`);
          if (!orderInfo) {
            throw Error(`订单${this.status.step}下单异常 - 执行返回结果为空`);
          }
          if (orderInfo.error) {
            if (orderInfo.error.message.includes('insufficient Available Balance')) {
              throw Error(`订单${this.status.step}下单异常 - 账户余额不足，取消下单。${orderInfo.error.message}`);
            } else if (orderInfo.error.message.includes('overloaded')) {
              throw Error(`订单${this.status.step}下单异常 - 系统过载。${orderInfo.error.message}`);
            } else {
              throw Error(`订单${this.status.step}下单异常 - 未知错误。${orderInfo.error.message}`);
            }
          }
          if (orderInfo.ordStatus === types.OrderStatus.Canceled || orderInfo.ordStatus === types.OrderStatus.Rejected) {
            throw Error(`订单${this.status.step}被${orderInfo.ordStatus === types.OrderStatus.Canceled ? '取消' : '拒绝'}`);
          }
        }
        logger.info(`执行订单${this.status.step}[终了] ${Helper.endTimer(timer)}`);
        this.status.step = this.status.step === types.Step.Order1 ? types.Step.Order2 : types.Step.Order1;
        this.syncProcess();
      } else {
        logger.info(
          `执行订单${this.status.step}不满足${action === OrderSide.Buy ? '买入' : '卖出'}条件[终了] ${Helper.endTimer(timer)}`,
        );
      }
    } catch (err) {
      this.status.robotState = RobotState.Ruling;
      this.notificationsService.error({
        title: '执行订单异常',
        body: err.message,
      });
      logger.error(`执行订单[异常终了] ${err.message}`);
    }
  }

  async rule(): Promise<RuleOutput> {
    const bars = await this.trader.getBars(this.status.symbol, this.status.resolution);
    const ichimokuRes = ichimoku({
      high: bars.h,
      low: bars.l,
    });
    const smaRes = sma({
      values: bars.c,
    });
    if (bars.c.length === 0 || ichimokuRes.length === 0 || smaRes.length === 0) {
      logger.error(`获取指标数据出错：bars.c: ${bars.c}, ichimokuRes: ${ichimokuRes}, smaRes: ${smaRes}`);
    }
    const lastClose = bars.c[bars.c.length - 1];
    if (!lastClose) {
      logger.info(`最近k线为空，取消检测。`);
      return { action: undefined, close: 0 };
    }
    const baseline = ichimokuRes[ichimokuRes.length - 1].base;
    const ma = smaRes[smaRes.length - 1];
    let action;
    // 买入
    if (lastClose > baseline && lastClose > ma) {
      logger.info(`收盘价(${lastClose}) > 基准线数值(${baseline}),并且 收盘价(${lastClose}) > 均线数值(${ma})，买入操作`);
      this.notificationsService.info({
        title: '交易规则',
        body: `收盘价(${lastClose}) > 基准线数值(${baseline}),并且 收盘价(${lastClose}) > 均线数值(${ma})，买入操作`,
      });
      action = types.OrderSide.Buy;
    } else if (lastClose < baseline && lastClose < ma) {
      // 卖出
      logger.info(`收盘价(${lastClose}) < 基准线数值(${baseline}),并且 收盘价(${lastClose}) < 均线数值(${ma})，卖出操作`);
      this.notificationsService.info({
        title: '交易规则',
        body: `收盘价(${lastClose}) < 基准线数值(${baseline}),并且 收盘价(${lastClose}) < 均线数值(${ma})，卖出操作`,
      });
      action = types.OrderSide.Sell;
    } else {
      const logText = `交易规则计算未满足${this.getOrderSide(this.status.step) === OrderSide.Buy ? '买入' : '卖出'}条件，待机`;
      logger.info(logText);
      this.notificationsService.info({
        title: '交易规则',
        body: logText,
      });
    }
    await this.saveDBLog(bars, action);
    return {
      action,
      close: lastClose,
    };
  }

  private async saveDBLog(udfBar: types.UdfResponse, action?: types.OrderSide) {
    const log = new Log();
    if (!action) {
      log.operation = '待机';
    } else {
      log.operation = action === types.OrderSide.Buy ? '买入' : '卖出';
    }
    log.symbol = this.status.symbol;
    log.resolution = this.status.resolutionName;
    log.time = Helper.formatTime(Date.now());
    // 存储最后50条k线数据
    const bars = {
      t: udfBar.t.slice(Math.max(udfBar.t.length - 50, 1)),
      c: udfBar.c.slice(Math.max(udfBar.c.length - 50, 1)),
      o: udfBar.o.slice(Math.max(udfBar.o.length - 50, 1)),
      h: udfBar.h.slice(Math.max(udfBar.h.length - 50, 1)),
      l: udfBar.l.slice(Math.max(udfBar.l.length - 50, 1)),
      v: udfBar.v.slice(Math.max(udfBar.v.length - 50, 1)),
    }
    log.memo = JSON.stringify(bars);
    await this.mysqlService.saveLog(log);
  }

  // 获取相应步骤的买入/卖出操作
  private getOrderSide(step: types.Step): types.OrderSide {
    return step === types.Step.Order1 ? this.status.side : this.status.inverseSide;
  }
}
