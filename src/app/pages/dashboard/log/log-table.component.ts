import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { LogTableService } from '../../../@core/data/log-table.service';

@Component({
  selector: 'ngx-log-table',
  styleUrls: ['./log-table.component.scss'],
  templateUrl: './log-table.component.html',
})
export class LogTableComponent {
  settings = {
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      time: {
        title: '时间',
        type: 'string',
      },
      symbol: {
        title: '商品',
        type: 'string',
      },
      resolution: {
        title: 'K线周期',
        type: 'string',
      },
      content: {
        title: '内容',
        type: 'string',
      },
      operation: {
        title: '操作',
        type: 'string',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: LogTableService) {
    const data = this.service.getData();
    this.source.load(data);
  }
}
