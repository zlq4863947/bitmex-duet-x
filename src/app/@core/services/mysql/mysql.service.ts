import 'reflect-metadata';

import { Injectable } from '@angular/core';
import { Connection, createConnection, getConnectionManager } from 'typeorm';

import { MysqlSettings } from '../../../@core/types';
import * as entities from './entity';

@Injectable()
export class MysqlService {
  async connection(settings: MysqlSettings): Promise<{ conn?: Connection; errorMsg?: string }> {
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

  async testConnection() {
    return getConnectionManager();
  }

  async saveOrder() {}
}
