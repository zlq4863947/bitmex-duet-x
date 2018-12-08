import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import * as entities from './entity';
import { Injectable } from '@angular/core';
import { MysqlSettings } from '../../../@core/types';

@Injectable()
export class MysqlService {

  async connection(settings: MysqlSettings) {
    return await createConnection(
      Object.assign(
        {
          type: 'mysql',
          entities: [
            entities.Order,
            entities.Log
          ],
          synchronize: true,
        },
        <any>settings,
      ),
    );
  }

  async saveOrder() {

  }
}
