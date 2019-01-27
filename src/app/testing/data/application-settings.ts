import { ApplicationSettings } from '../../@core/types';

export const mockApplicationSettings: ApplicationSettings = {
  actions: {
    symbol: 'XBTUSD',
    resolution: {
      resolution: '1',
      name: '1分钟',
    },
  },
  trading: {
    symbol: 'XBTUSD',
    side: 'Buy',
    amount: 10,
    leverage: 2,
  },
  exchange: {
    real: {
      apiKey: '',
      secret: '',
    },
    test: {
      apiKey: '',
      secret: '',
    },
    mode: 'test',
  },
  mysql: {
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'qwer1234',
    database: 'duet2',
  },
  process: {
    isActived: false,
    status: <any>{},
  },
};
