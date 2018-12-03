import { Injectable } from '@angular/core';

@Injectable()
export class OrderTableService {
  data = [
    {
      time: '2018-11-12 00:39:00',
      symbol: 'BCHZ18',
      price: 0.0507,
      amount: 1,
      side: '买入',
      status: '已取消',
    },
    {
      time: '2018-11-12 00:40:00',
      symbol: 'XBTUSD',
      price: 5529.5,
      amount: 50,
      side: '买入',
      status: '已成交',
    },
  ];

  getData() {
    return this.data;
  }
}
