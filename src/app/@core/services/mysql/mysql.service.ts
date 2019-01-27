import 'reflect-metadata';

import { Injectable } from '@angular/core';
import { Connection, createConnection, getConnection, getConnectionManager } from 'typeorm';

import { Order } from '../../data';
import { ApplicationSettings, MysqlSettings } from '../../types';
import { SettingsService } from '../../utils';
import { LogEntity, OrderEntity } from './entity';
import { OrderSide } from '@duet-robot/type';

@Injectable()
export class MysqlService {
  private connectionName = 'default';

  constructor(private settingsService: SettingsService) {}

  async connect(settings: MysqlSettings): Promise<{ conn?: Connection; errorMsg?: string }> {
    try {
      const conn = await createConnection(
        Object.assign(
          {
            type: 'mysql',
            entities: [OrderEntity, LogEntity],
            synchronize: true,
          },
          <any>settings,
        ),
      );
      return { conn };
    } catch (error) {
      return { errorMsg: error.message };
    }
  }

  isConnected(): boolean {
    const connectionManager = getConnectionManager();
    if (!connectionManager.has(this.connectionName)) {
      return false;
    }
    const connection = getConnectionManager().get();
    return connection.isConnected;
  }

  getConnection(): Connection | undefined {
    if (this.isConnected()) {
      return getConnection();
    }
  }
  async disconnect() {
    if (this.isConnected()) {
      const connection = getConnection();
      if (connection) {
        await connection.close();
      }
    }
  }

  async testConnect(settings: MysqlSettings) {
    if (this.isConnected()) {
      await this.disconnect();
    }
    return await this.connect(settings);
  }

  async init(settings: MysqlSettings) {
    if (this.isConnected()) {
      return { conn: this.getConnection() };
    }
    return await this.connect(settings);
  }

  async autoConnect() {
    if (this.isConnected()) {
      return { conn: this.getConnection() };
    }
    const config = <ApplicationSettings>(<any>this.settingsService.settings.getAll());
    return await this.connect(config.mysql);
  }

  async saveOrder(order: Order) {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(OrderEntity);
      const orderInfo = new OrderEntity();
      orderInfo.orderId = order.id;
      orderInfo.symbol = order.symbol;
      orderInfo.amount = order.amount;
      orderInfo.price = order.price;
      orderInfo.side = order.side;
      orderInfo.status = order.status;
      orderInfo.time = order.time;
      orderInfo.roe = order.roe + '';
      return await repo.save(orderInfo);
    }
  }

  async syncOrder(order: Order) {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(OrderEntity);
      const dbOrder = await repo.findOne(order.id);
      // 存在数据的时候
      if (dbOrder && dbOrder.status !== order.status) {
        dbOrder.status = order.status;
        await repo.save(dbOrder);
      } else if (order && order.price) {
        const orderInfo = new OrderEntity();
        orderInfo.orderId = order.id;
        orderInfo.symbol = order.symbol;
        orderInfo.amount = order.amount;
        orderInfo.price = order.price;
        orderInfo.side = order.side;
        orderInfo.status = order.status;
        orderInfo.time = order.time;
        orderInfo.roe = order.roe + '';
        await repo.save(orderInfo);
      }
    }
  }

  /**
   * 计算收益率
   */
  async syncROE(orders: OrderEntity[]) {
    const res = await this.autoConnect();
    if (!res || !res.conn) {
      return;
    }
    for (const [i, order] of Array.from(orders.entries())) {
      const prevOrder = orders[i - 1];
      if (order.step !== '2' || !prevOrder) {
        continue;
      }
      const diff = order.side === OrderSide.Sell ? order.price-prevOrder.price : prevOrder.price-order.price;
      const roeRate = diff/order.price*100;
      order.roe = roeRate.toFixed(2) + '%';
    }
    const repo = res.conn.getRepository(OrderEntity);
    await repo.save(orders)
    return orders;
}

  async getOrders(): Promise<OrderEntity[] | undefined> {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(OrderEntity);
      return await repo
        .createQueryBuilder('order')
        .orderBy('order.time', 'DESC')
        .getMany();
    }
  }

  async getOrderById(orderId: string): Promise<OrderEntity | undefined> {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(OrderEntity);
      return await repo.findOne(orderId);
    }
  }

  async saveLog(log: LogEntity) {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(LogEntity);
      return await repo.save(log);
    }
  }

  async getLogs(): Promise<LogEntity[] | undefined> {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(LogEntity);
      return await repo
        .createQueryBuilder('log')
        .orderBy('log.time', 'DESC')
        .getMany();
    }
  }
}
