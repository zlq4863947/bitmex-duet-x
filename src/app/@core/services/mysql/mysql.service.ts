import 'reflect-metadata';

import { Injectable } from '@angular/core';
import { Connection, createConnection, getConnection, getConnectionManager } from 'typeorm';

import { ApplicationSettings } from '@duet-core/types';
import { ElectronService } from '@duet-core/utils';
import { Helper } from '@duet-robot/common';
import { Order } from '@duet-robot/type';

import { MysqlSettings } from '../../../@core/types';
import * as entities from './entity';

@Injectable()
export class MysqlService {

  private connectionName = 'default';

  constructor(private electronService: ElectronService) {}

  async connect(settings: MysqlSettings): Promise<{ conn?: Connection; errorMsg?: string }> {
    try {
      const conn = await createConnection(
        Object.assign(
          {
            type: 'mysql',
            entities: [entities.Order, entities.Log],
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
    const config = <ApplicationSettings>(<any>this.electronService.settings.getAll());
    return await this.connect(config.mysql);
  }

  async saveOrder(order: Order) {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(entities.Order);
      const orderInfo = new entities.Order();
      orderInfo.oriderId = order.orderID;
      orderInfo.symbol = order.symbol;
      orderInfo.amount = order.orderQty;
      orderInfo.price = order.price;
      orderInfo.side = order.side;
      orderInfo.status = order.ordStatus;
      orderInfo.time = Helper.formatTime(order.timestamp);
      return await repo.save(orderInfo);
    }
  }

  async getOrders(): Promise<entities.Order[] | undefined> {
    const res = await this.autoConnect();
    if (res && res.conn) {
      const repo = res.conn.getRepository(entities.Order);
      return await repo.createQueryBuilder('order').orderBy('order.time', 'DESC').getMany();
    }
  }
}
