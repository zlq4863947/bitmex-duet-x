import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IchimokuCloudOutput } from 'tech-indicator';

import { TvApi } from '@duet-robot/api/tv';
import { Helper } from '@duet-robot/common';
import { ichimoku, sma } from '@duet-robot/indicator';
import { Bar, LibrarySymbolInfo, Mark, MarkConstColors, OrderSide, OrderStatus } from '@duet-robot/type';

import { Order } from '../data';
import { SettingsService } from '../utils';

export interface BacktestInput {
  pair: string;
  resolution: string;
  side: OrderSide;
}

export interface BacktestOutput {
  pair: string;
  resolution: string;
  symbolInfo: LibrarySymbolInfo;
  bars: Bar[];
  marks: Mark[];
}

@Injectable({ providedIn: 'root' })
export class BacktestService {
  private tvApi: TvApi;
  private _status$ = new Subject<BacktestOutput>();
  private _orders$ = new Subject<Order[]>();

  constructor(private settingsService: SettingsService) {
    this.tvApi = new TvApi(settingsService.getExchange());
  }

  get launchBacktest$(): Observable<BacktestOutput> {
    return this._status$.asObservable();
  }

  get orders$(): Observable<Order[]> {
    return this._orders$.asObservable();
  }

  async launch(input: BacktestInput) {
    const res = await this.getResult(input);
    this._status$.next(res);
  }

  publishOrders(orders: Order[]) {
    const fmtOrders: Order[] = [];
    orders.map((o) => {
      const order: Order = {
        ...o,
        time: Helper.formatTime(+o.time),
        status: '已成交',
        side: o.side === OrderSide.Buy ? '买入' : '卖出',
      };
      fmtOrders.push(order);
    });
    this._orders$.next(fmtOrders);
  }

  private async getResult(input: BacktestInput): Promise<BacktestOutput> {
    const udfRes = await this.tvApi.getMaxBars(input.pair, input.resolution);
    const bars: Bar[] = [];
    let orders: Order[] = [];
    let marks: Mark[] = [];

    udfRes.t.map((time, index) => {
      bars.push({
        time: udfRes.t[index] * 1000,
        open: udfRes.o[index],
        close: udfRes.c[index],
        high: udfRes.h[index],
        low: udfRes.l[index],
        volume: udfRes.v[index],
      });

      const low = udfRes.l.slice(0, index + 1);
      const high = udfRes.h.slice(0, index + 1);
      const close = udfRes.c.slice(0, index + 1);

      const ichRes = ichimoku({ high, low });
      const smaRes = sma({ values: close });
      if (ichRes.length > 0) {
        const action = this.getRuleResult(close[close.length - 1], ichRes[ichRes.length - 1], smaRes[smaRes.length - 1]);
        if (action) {
          orders = this.getOrders({
            orders,
            side: input.side,
            action,
            pair: input.pair,
            time,
            close: close[close.length - 1],
          });
          marks = this.getMarks(orders);
        }
      }
    });

    this.publishOrders(orders);

    const symbolInfo = await this.tvApi.getSymbolInfo(input.pair);

    return {
      pair: input.pair,
      resolution: input.resolution,
      symbolInfo,
      bars,
      marks,
    };
  }

  private getOrders(param: { orders: Order[]; side: OrderSide; action: OrderSide; pair: string; time: number; close: number }) {
    const orders = param.orders;
    // 已有之前订单
    if (orders.length > 0) {
      const lastOrder = orders[orders.length - 1];
      // 与最近操作为相反方向
      if (lastOrder.side !== String(param.action)) {
        const order: Order = {
          id: +lastOrder.id + 1 + '',
          time: param.time * 1000 + '',
          symbol: param.pair,
          price: param.close,
          amount: 1,
          side: param.action,
          status: OrderStatus.Filled,
          step: 'auto',
          roe: '',
        };
        // 平仓时计算利润
        if (param.side !== String(param.action)) {
          order.roe = this.calcROE(lastOrder, order);
        }
        orders.push(order);
      }
    } else if (param.side === String(param.action)) {
      // 未有之前订单 且方向符合时
      const order: Order = {
        id: '1',
        time: param.time * 1000 + '',
        symbol: param.pair,
        price: param.close,
        amount: 1,
        side: param.action,
        status: OrderStatus.Filled,
        step: 'auto',
        roe: '',
      };
      orders.push(order);
    }

    return orders;
  }

  private getMarks(orders: Order[]): Mark[] {
    const marks: Mark[] = [];
    for (const order of orders) {
      const mark = {
        id: order.id,
        time: +order.time / 1000,
        color: order.side === String(OrderSide.Buy) ? <MarkConstColors>'red' : 'green',
        labelFontColor: order.side === String(OrderSide.Buy) ? 'white' : 'white',
        text: order.side === String(OrderSide.Buy) ? '买' : '卖',
        label: order.side === String(OrderSide.Buy) ? '买' : '卖',
        minSize: 25,
      };
      marks.push(mark);
    }

    return marks;
  }

  private calcROE(lastOrder: Order, curOrder: Order): string {
    const diff = curOrder.side === OrderSide.Sell ? curOrder.price - lastOrder.price : lastOrder.price - curOrder.price;
    const roeRate = (diff / curOrder.price) * 100;
    return roeRate.toFixed(2) + '%';
  }

  private getRuleResult(close: number, ichimokuRes: IchimokuCloudOutput, smaRes: number) {
    if (!close || !ichimokuRes || !smaRes) {
      return;
    }

    if (close > ichimokuRes.base && close > smaRes) {
      return OrderSide.Buy;
    } else if (close < ichimokuRes.base && close < smaRes) {
      return OrderSide.Sell;
    }
  }
}
