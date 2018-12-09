import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { OrderTableService } from '../../../@core/data/order-table.service';

@Component({
  selector: 'ngx-order-table',
  styleUrls: ['./order-table.component.scss'],
  templateUrl: './order-table.component.html',
})
export class OrderTableComponent {
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
      price: {
        title: '价格',
        type: 'number',
      },
      amount: {
        title: '数量',
        type: 'number',
      },
      side: {
        title: '方向',
        type: 'string',
      },
      status: {
        title: '状态',
        type: 'html',
        valuePrepareFunction: (data) => {
          let clsName;
          switch (data) {
            case '已成交':
              clsName = 'cell_success';
              break;
            case '已取消':
              clsName = 'cell_fail';
              break;
          }
          return `<div class="${clsName}">${data}</div>`;
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: OrderTableService) {
    const data = this.service.getData();
    this.source.load(data);
  }
}
