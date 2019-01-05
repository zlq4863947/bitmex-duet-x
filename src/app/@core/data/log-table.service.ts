import { Injectable } from '@angular/core';

import { MysqlService } from '@duet-core/services';


@Injectable()
export class LogTableService {
  constructor(private mysqlService: MysqlService) {}

  async getData() {
    const dbLogs = await this.mysqlService.getLogs();
    if (!dbLogs) {
      return [];
    }
    return dbLogs;
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
        resolution: { title: 'K线周期', type: 'string' },
        operation: { title: '操作', ype: 'string' },
        content: { title: '内容', type: 'string' },
      },
    };
  }
}
