import { OrderEntity } from '@duet-core/services';

export const mockOrderTableData: OrderEntity[] = [
  {
    orderId: '1',
    time: '2019-01-22 19:51:16',
    symbol: 'XBTUSD',
    price: 3516.5,
    amount: 1,
    side: '买入',
    status: '已成交',
    roe: '-'
  },
  {
    orderId: '2',
    time: '2019-01-22 19:12:03',
    symbol: 'XBTUSD',
    price: 3519.5,
    amount: 1,
    side: '卖出',
    status: '已成交',
    roe: '-1.1%'
  },
  {
    orderId: '3',
    time: '2019-01-22 19:07:03',
    symbol: 'XBTUSD',
    price: 3522.5,
    amount: 1,
    side: '买入',
    status: '已成交',
    roe: '-'
  },
  {
    orderId: '4',
    time: '2019-01-22 18:39:02',
    symbol: 'XBTUSD',
    price: 3519,
    amount: 1,
    side: '卖出',
    status: '已成交',
    roe: '0.12%'
  }
];
