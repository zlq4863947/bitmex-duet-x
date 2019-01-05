import { Injectable } from '@angular/core';

import { MysqlService } from '@duet-core/services';
import { Helper } from '@duet-robot/common';
import { OrderSide, OrderStatus } from '@duet-robot/type';

export interface Order {
  time: string;
  symbol: string;
  price: number;
  amount: number;
  side: string;
  status: string;
}

@Injectable()
export class OrderTableService {
  constructor(private mysqlService: MysqlService) {}

  async getData() {
    const dbOrders = await this.mysqlService.getOrders();
    if (!dbOrders) {
      return [];
    }
    const orders: Order[] = [];
    for (const dbOrder of dbOrders) {
      const order: Order = {
        time: Helper.formatTime(dbOrder.time),
        symbol: dbOrder.symbol,
        price: dbOrder.price,
        amount: dbOrder.amount,
        side: dbOrder.side === OrderSide.Buy ? '买入' : '卖出',
        status: this.getStatusName(<OrderStatus>dbOrder.status),
      };
      orders.push(order);
    }
    return orders;
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
        status: { title: '状态', type: 'html', valuePrepareFunction: this.getStatusHtml },
      },
    };
  }

  private getStatusHtml(status: string) {
    let clsName;
    switch (status) {
      case '已成交': {
        clsName = 'cell_success';
        break;
      }
      case '已取消': {
        clsName = 'cell_fail';
        break;
      }
    }
    return `<div class="${clsName}">${status}</div>`;
  }

  private getStatusName(status: OrderStatus) {
    switch (status) {
      case OrderStatus.Filled: {
        return '已成交';
      }
      case OrderStatus.Canceled: {
        return '已取消';
      }
      case OrderStatus.New: {
        return '已委托';
      }
      case OrderStatus.PartiallyFilled: {
        return '部分成交';
      }
      case OrderStatus.Rejected: {
        return '已拒绝';
      }
      default: {
        return '未知状态';
      }
    }
  }
}
