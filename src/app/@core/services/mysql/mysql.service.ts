import 'reflect-metadata';

import { Injectable } from '@angular/core';
import { Connection, createConnection, getConnection, getConnectionManager } from 'typeorm';

import { ApplicationSettings } from '@duet-core/types';
import { SettingsService } from '@duet-core/utils';
import { Helper } from '@duet-robot/common';
import { Order } from '@duet-robot/type';

import { MysqlSettings } from '../../../@core/types';
import { OrderEntity, LogEntity} from './entity';

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
      orderInfo.orderId = order.orderID;
      orderInfo.symbol = order.symbol;
      orderInfo.amount = order.orderQty;
      orderInfo.price = order.price;
      orderInfo.side = order.side;
      orderInfo.status = order.ordStatus;
      orderInfo.time = Helper.formatTime(Date.now());
      return await repo.save(orderInfo);
    }
  }

  async syncOrder(order: Order) {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(OrderEntity);
      const dbOrder = await repo.findOne(order.orderID);
      if (dbOrder && dbOrder.status !== order.ordStatus) {
        dbOrder.status = order.ordStatus;
        await repo.save(dbOrder);
      } else if (order && order.price) {
        const orderInfo = new OrderEntity();
        orderInfo.orderId = order.orderID;
        orderInfo.symbol = order.symbol;
        orderInfo.amount = order.orderQty;
        orderInfo.price = order.price;
        orderInfo.side = order.side;
        orderInfo.status = order.ordStatus;
        orderInfo.time = Helper.formatTime(Date.now());
        await repo.save(orderInfo);
      }
    }
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
