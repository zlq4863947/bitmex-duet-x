import { Injectable } from '@angular/core';
import { BitmexWS } from 'bitmex-ws';
import { Order as WsOrder } from 'bitmex-ws/lib/types';
import { Job } from 'node-schedule';

import { Order } from '../app/@core/data';
import { LogEntity, MysqlService } from '../app/@core/services/mysql';
import { ApplicationSettings } from '../app/@core/types';
import { NotificationsService, SettingsService } from '../app/@core/utils';
import { Helper, Log, Scheduler, getExchangeOptions } from './common';
import { ichimoku, sma } from './indicator';
import { Trader } from './trader';
import { Order as BitmexOrder, OrderSide, OrderStatus, Step, UdfResponse } from './type';

// 机器人运行状态
export enum RobotState {
  // 待机中
  Waiting = 'Waiting',
  // 策略执行中
  Ruling = 'Ruling',
  // 订单中
  Ordering = 'Ordering',
}

export interface IStatus {
  symbol: string;
  resolution: string;
  resolutionName: string;
  amount: number;
  leverage: number;
  side: OrderSide;
  inverseSide: OrderSide;
  isInitSell: boolean;
  // 是否真实下单
  isOrder: boolean;
  robotState: RobotState;
  orderInfo?: BitmexOrder;
  // 当前步骤
  step: Step;
}

export interface RuleOutput {
  action?: OrderSide;
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
  private readonly logger: Log;

  constructor(
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
    private mysqlService: MysqlService,
  ) {
    this.logger = new Log();
  }

  reload() {
    const config = this.settingsService.getApplication();
    const side = <OrderSide>config.trading.side;
    this.status = {
      symbol: config.actions.symbol,
      amount: config.trading.amount,
      side,
      leverage: config.trading.leverage,
      resolution: config.actions.resolution.resolution,
      resolutionName: config.actions.resolution.name,
      inverseSide: side === OrderSide.Sell ? OrderSide.Buy : OrderSide.Sell,
      isInitSell: side === OrderSide.Sell,
      isOrder: true,
      orderInfo: undefined,
      robotState: RobotState.Waiting,
      step: Step.Order1,
    };
    this.syncProcess();
    this.trader = new Trader(config.exchange);
    const exOptions = getExchangeOptions(config.exchange);
    this.ws = new BitmexWS(exOptions);
    this.ws.order$(this.status.symbol).subscribe(async (order) => {
      this.logger.info(`subscribe order: ${JSON.stringify(order)}`);
      if (order && order.ordStatus && order.ordStatus !== OrderStatus.New) {
        await this.syncOrder(order);
      }
    });
  }

  async syncOrder(wsOrder: WsOrder) {
    const order: Order = {
      id: wsOrder.orderID,
      time: Helper.formatTime(Date.now()),
      symbol: wsOrder.symbol,
      price: wsOrder.price,
      amount: wsOrder.orderQty,
      side: wsOrder.side,
      status: wsOrder.ordStatus,
      step: this.status.step + '',
      roe: '-',
    };
    await this.mysqlService.syncOrder(order);
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
    const resolutionTime = this.status.resolution.includes('D') ? +this.status.resolution.split('D')[0] * 1440 : +this.status.resolution;
    this.job = Scheduler.min(resolutionTime, async () => {
      try {
        const result = await this.checkStatus();
        // 继续执行
        if (!result) {
          return;
        }
        this.notificationsService.success({
          title: `执行${this.status.resolution}分钟定时任务...`,
        });
        this.logger.info(`系统状态: ${JSON.stringify(this.status)}`);
        const res = await this.rule();
        if (res.action) {
          await this.doOrder(res.action, res.close);
          this.status.robotState = RobotState.Waiting;
        }
      } catch (err) {
        this.logger.error(`定时任务[异常终了] ${err.message}`);
      }
    });
    this.logger.info(`启动机器人`);
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
      this.status.robotState = RobotState.Waiting;
      this.logger.info(`停止机器人`);
      return true;
    }
    return false;
  }

  /**
   * 检查同步状态,返回是否可以继续执行的结果
   */
  private async checkStatus(): Promise<Boolean> {
    try {
      if (this.status.robotState === RobotState.Ordering || this.status.robotState === RobotState.Ruling) {
        console.log(`机器人状态为：${this.status.robotState}, 取消继续执行`);
        return;
      }
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
          this.logger.error(logText);
          return;
        }
        if (onlineOrder.ordStatus === OrderStatus.New) {
          return false;
        }
        const dbOrder = await this.mysqlService.getOrderById(orderId);
        if (!dbOrder || onlineOrder.ordStatus !== dbOrder.status) {
          // 同步订单状态
          await this.syncOrder(<any>onlineOrder);

          switch (onlineOrder.ordStatus) {
            case OrderStatus.Canceled:
            case OrderStatus.Rejected: {
              this.status.orderInfo = undefined;
              this.status.robotState = RobotState.Waiting;
              return true;
            }
            case OrderStatus.PartiallyFilled: {
              return false;
            }
            case OrderStatus.Filled: {
              this.status.orderInfo = undefined;
              this.status.robotState = RobotState.Waiting;
              return true;
            }
          }
        }
      }
      return true;
    } catch (err) {
      this.logger.error(`状态检查[异常终了] ${err.message}`);
    }
  }

  private async doOrder(ruleAction: OrderSide, price: number) {
    if (this.status.robotState !== RobotState.Waiting) {
      return;
    }
    this.status.robotState = RobotState.Ordering;
    this.logger.info(`执行订单${this.status.step}[启动]`);

    try {
      const timer = Helper.getTimer();
      const action = this.getOrderSide(this.status.step);
      // 买入/卖出动作 == 本次动作
      if (action === ruleAction) {
        const input = {
          symbol: this.status.symbol,
          side: ruleAction,
          price,
          amount: this.status.amount,
        };
        this.logger.info(`订单信息: ${JSON.stringify(input)}`);
        if (this.status.isOrder) {
          this.status.robotState = RobotState.Ordering;
          const orderInfo = await this.trader.order(input);
          this.status.orderInfo = orderInfo;
          const saveRes = await this.syncOrder(<any>orderInfo);
          this.logger.info(`saveRes: ${JSON.stringify(saveRes)}`);
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
          if (orderInfo.ordStatus === OrderStatus.Canceled || orderInfo.ordStatus === OrderStatus.Rejected) {
            throw Error(`订单${this.status.step}被${orderInfo.ordStatus === OrderStatus.Canceled ? '取消' : '拒绝'}`);
          }
        }
        this.logger.info(`执行订单${this.status.step}[终了] ${Helper.endTimer(timer)}`);
        this.status.step = this.status.step === Step.Order1 ? Step.Order2 : Step.Order1;
        this.syncProcess();
      } else {
        this.logger.info(
          `执行订单${this.status.step}不满足${action === OrderSide.Buy ? '买入' : '卖出'}条件[终了] ${Helper.endTimer(timer)}`,
        );
      }
    } catch (err) {
      this.status.robotState = RobotState.Ruling;
      this.notificationsService.error({
        title: '执行订单异常',
        body: err.message,
      });
      this.logger.error(`执行订单[异常终了] ${err.message}`);
    }
  }

  private async rule(): Promise<RuleOutput> {
    try {
      if (this.status.robotState !== RobotState.Waiting) {
        return;
      }
      this.status.robotState = RobotState.Ruling;
      const bars = await this.trader.getBars(this.status.symbol, this.status.resolution);
      const ichimokuRes = ichimoku({
        high: bars.h,
        low: bars.l,
      });
      const smaRes = sma({
        values: bars.c,
      });
      if (bars.c.length === 0 || ichimokuRes.length === 0 || smaRes.length === 0) {
        this.logger.error(`获取指标数据出错：bars.c: ${bars.c}, ichimokuRes: ${ichimokuRes}, smaRes: ${smaRes}`);
      }
      const lastClose = bars.c[bars.c.length - 1];
      if (!lastClose) {
        this.logger.info(`最近k线为空，取消检测。`);
        this.status.robotState = RobotState.Waiting;
        return { action: undefined, close: 0 };
      }
      const baseline = ichimokuRes[ichimokuRes.length - 1].base;
      const ma = smaRes[smaRes.length - 1];
      let action;
      // 买入
      if (lastClose > baseline && lastClose > ma) {
        this.logger.info(`收盘价(${lastClose}) > 基准线数值(${baseline}),并且 收盘价(${lastClose}) > 均线数值(${ma})，买入操作`);
        this.notificationsService.info({
          title: '交易规则',
          body: `收盘价(${lastClose}) > 基准线数值(${baseline}),并且 收盘价(${lastClose}) > 均线数值(${ma})，买入操作`,
        });
        action = OrderSide.Buy;
      } else if (lastClose < baseline && lastClose < ma) {
        // 卖出
        this.logger.info(`收盘价(${lastClose}) < 基准线数值(${baseline}),并且 收盘价(${lastClose}) < 均线数值(${ma})，卖出操作`);
        this.notificationsService.info({
          title: '交易规则',
          body: `收盘价(${lastClose}) < 基准线数值(${baseline}),并且 收盘价(${lastClose}) < 均线数值(${ma})，卖出操作`,
        });
        action = OrderSide.Sell;
      } else {
        const logText = `交易规则计算未满足${this.getOrderSide(this.status.step) === OrderSide.Buy ? '买入' : '卖出'}条件，待机`;
        this.logger.info(logText);
        this.notificationsService.info({
          title: '交易规则',
          body: logText,
        });
      }
      await this.saveDBLog(bars, action);
      this.status.robotState = RobotState.Waiting;
      return {
        action,
        close: lastClose,
      };
    } catch (err) {
      this.status.robotState = RobotState.Waiting;
      this.logger.error(`检查策略[异常终了] ${err.message}`);
    }
  }

  private async saveDBLog(udfBar: UdfResponse, action?: OrderSide) {
    const logEntity = new LogEntity();
    if (!action) {
      logEntity.operation = '待机';
    } else {
      logEntity.operation = action === OrderSide.Buy ? '买入' : '卖出';
    }
    logEntity.symbol = this.status.symbol;
    logEntity.resolution = this.status.resolutionName;
    logEntity.time = Helper.formatTime(Date.now());
    // 存储最后50条k线数据
    const bars = {
      t: udfBar.t.slice(Math.max(udfBar.t.length - 50, 1)),
      c: udfBar.c.slice(Math.max(udfBar.c.length - 50, 1)),
      o: udfBar.o.slice(Math.max(udfBar.o.length - 50, 1)),
      h: udfBar.h.slice(Math.max(udfBar.h.length - 50, 1)),
      l: udfBar.l.slice(Math.max(udfBar.l.length - 50, 1)),
      v: udfBar.v.slice(Math.max(udfBar.v.length - 50, 1)),
    };
    logEntity.memo = JSON.stringify(bars);
    await this.mysqlService.saveLog(logEntity);
  }

  // 获取相应步骤的买入/卖出操作
  private getOrderSide(step: Step): OrderSide {
    return step === Step.Order1 ? this.status.side : this.status.inverseSide;
  }
}
