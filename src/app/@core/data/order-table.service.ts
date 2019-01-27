import { Injectable } from '@angular/core';

import { Helper } from '@duet-robot/common';
import { OrderSide, OrderStatus } from '@duet-robot/type';

import { getStatusHtml, getStatusName } from '../functions';
import { MysqlService, OrderEntity } from '../services';

export interface Order {
  id: string;
  time: string;
  symbol: string;
  price: number;
  amount: number;
  side: string;
  status: string;
  step: string;
  roe: string;
}

@Injectable()
export class OrderTableService {
  constructor(private mysqlService: MysqlService) {}

  async getData() {
    const dbOrders = await this.mysqlService.getOrders();
    return this.formatData(dbOrders);
  }

  async syncROE(): Promise<Order[]> {
    let orders = await this.mysqlService.getOrders();
    orders = await this.mysqlService.syncROE(orders);
    return this.formatData(orders);
  }

  getSettings() {
    return {
      hideSubHeader: true,
      actions: {
        add: false,
        edit: false,
        delete: false,
      },
      columns: {
        time: { title: '时间', type: 'string' },
        symbol: { title: '商品', type: 'string' },
        price: { title: '价格', type: 'number' },
        amount: { title: '数量', type: 'number' },
        side: { title: '方向', type: 'string' },
        status: { title: '状态', type: 'html', valuePrepareFunction: getStatusHtml },
        roe: { title: '收益率', type: 'string' },
      },
    };
  }

  private formatData(dbOrders: OrderEntity[]) {
    if (!dbOrders) {
      return [];
    }
    const orders: Order[] = [];
    for (const dbOrder of dbOrders) {
      const order: Order = {
        id: dbOrder.orderId,
        time: Helper.formatTime(dbOrder.time),
        symbol: dbOrder.symbol,
        price: dbOrder.price,
        amount: dbOrder.amount,
        side: dbOrder.side === OrderSide.Buy ? '买入' : '卖出',
        status: getStatusName(<OrderStatus>dbOrder.status),
        step: dbOrder.step,
        roe: dbOrder.roe,
      };
      orders.push(order);
    }
    return orders;
  }
}
