import { ExchangeSettings } from '@duet-core/types';

import { environment } from '../environments/environment';
import { Rest } from './api';
import { Helper, logger } from './common';
import * as types from './type';

export interface IRestOrders {
  symbol: string;
  side?: types.OrderSide;
  isNew?: boolean;
  beforeHour?: number;
  start?: string;
}
export class Trader {
  rest: Rest;

  filter = {
    onlineOrder(orders: types.Order[] | undefined) {
      if (orders && orders.length > 0) {
        const onlineOrder = orders.find((o) => o.ordStatus === types.OrderStatus.New || o.ordStatus === types.OrderStatus.PartiallyFilled);
        if (onlineOrder) {
          return onlineOrder;
        }
      }
      return;
    },
    onlineOrders(orders: types.Order[] | undefined) {
      if (orders && orders.length > 0) {
        const onlineOrders = orders.filter(
          (o) => o.ordStatus === types.OrderStatus.New || o.ordStatus === types.OrderStatus.PartiallyFilled,
        );
        if (onlineOrders.length > 0) {
          return onlineOrders;
        }
      }
      return;
    },

    filledOrders(orders: types.Order[] | undefined) {
      if (orders && orders.length > 0) {
        const filledOrders = orders.filter((o) => o.ordStatus === types.OrderStatus.Filled);
        if (filledOrders.length > 0) {
          return filledOrders;
        }
      }
      return [];
    },
  };

  constructor(config: ExchangeSettings) {
    this.rest = new Rest(config, environment.production ? '' : 'http://127.0.0.1:7070');
  }

  // 下单
  async order(input: types.IOrder) {
    const orderOptions = {
      symbol: input.symbol,
      side: input.side,
      orderQty: input.amount,
      price: input.price,
      ordType: 'Limit', // Market
    };
    const timer = Helper.getTimer();
    logger.info(`发出订单指令[启动] ${JSON.stringify(orderOptions)}`);
    const res = await this.rest.newOrder(orderOptions);
    if (!res) {
      return;
    }
    logger.info(`发出订单指令[终了] ${Helper.endTimer(timer)},  ${JSON.stringify(res)}`);
    return res.order;
  }

  async removeOrder(orderId: string) {
    const timer = Helper.getTimer();
    logger.info(`删除指令[启动] - orderId：${orderId}`);
    const res = await this.rest.delOrder({
      orderID: orderId,
    });
    if (!res) {
      return;
    }
    logger.info(`删除指令[终了] ${Helper.endTimer(timer)},  ${JSON.stringify(res)}`);
    return res.orders;
  }

  // 更新价格
  async updatePrice(orderId: string, price: number) {
    const timer = Helper.getTimer();
    logger.info(`修改价格指令[启动] - orderId：${orderId}, price：${price}`);
    const res = await this.rest.updOrder({
      orderID: orderId,
      price,
    });
    if (!res) {
      return;
    }
    logger.info(`修改价格指令[终了] ${Helper.endTimer(timer)},  ${JSON.stringify(res)}`);
    return res.order;
  }

  async updateLeverage(symbol: string, leverage: number) {
    // const timer = Helper.getTimer();
    const res = await this.rest.updateLeverage({ symbol, leverage });
    if (!res) {
      return;
    }
    // logger.info(`更新杠杆指令[终了] ${Helper.endTimer(timer)},  ${JSON.stringify(res)}`);
    return res;
  }

  async getPosition(symbol: string): Promise<types.Position[] | undefined> {
    const timer = Helper.getTimer();
    const res = await this.rest.getPosition({
      filter: { symbol },
      columns: ['currentQty', 'avgEntryPrice'],
    });
    if (!res) {
      return;
    }
    logger.info(`获取仓位指令[终了] ${Helper.endTimer(timer)},  ${JSON.stringify(res)}`);
    return res.positions;
  }

  getBars(symbol: string, resolution: number, from?: number, to?: number): Promise<types.UdfResponse> {
    return this.rest.getCandlestick(symbol, resolution, from, to);
  }

  async getRestOrders(input: IRestOrders): Promise<types.Order[] | undefined> {
    const orderOptions = {
      symbol: input.symbol,
      count: 500,
      filter: {},
    };

    if (input.isNew) {
      (<any>orderOptions.filter).open = true;
      (<any>orderOptions.filter).ordStatus = types.OrderStatus.New;
    }

    if (input.side) {
      (<any>orderOptions.filter).side = input.side;
    }

    if (input.beforeHour) {
      input.start = Helper.getBeforeDate(input.beforeHour);
    }

    if (input.start) {
      (<any>orderOptions).startTime = input.start;
    }

    const res = await this.rest.getOrder(orderOptions);
    if (!res) {
      return;
    }
    return res.orders;
  }

  async getOrderById(symbol: string, orderID: string) {
    const orderOptions = {
      symbol,
      filter: {
        orderID,
      },
    };
    logger.info(`获取当前订单(orderID)[启动] ${JSON.stringify(orderOptions)}`);
    const res = await this.rest.getOrder(orderOptions);
    if (!res || res.orders.length === 0) {
      return;
    }
    logger.info(`获取当前订单(orderID)[终了] ${JSON.stringify(res)}`);
    return res.orders[res.orders.length - 1];
  }

  async getOnlineOrder(symbol: string) {
    // 取得8小时内订单
    const allOrders = await this.getRestOrders({ symbol, beforeHour: 8 });
    if (!allOrders || allOrders.length === 0) {
      return;
    }
    return this.filter.onlineOrder(allOrders);
  }

  async getOnlineOrders(symbol: string) {
    // 取得8小时内订单
    const allOrders = await this.getRestOrders({ symbol, beforeHour: 8 });
    if (!allOrders || allOrders.length === 0) {
      return;
    }
    return this.filter.onlineOrders(allOrders);
  }
}
