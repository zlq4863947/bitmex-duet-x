import { IStatus } from '@duet-robot/robot';

export interface MysqlSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
export interface TradingSettings {
  symbol: string;
  amount: number;
  leverage: number;
  side: string;
}
export interface ExchangeSettings {
  real: ApiKeySettings;
  test: ApiKeySettings;
  mode: 'real' | 'test';
}

export interface ApiKeySettings {
  apiKey: string;
  secret: string;
}

export interface ActionsSettings {
  symbol: string;
  resolution: ResolutionOption;
}
export interface RobotProcess {
  // 是否为活动状态
  isActived: boolean;
  status: IStatus;
}

export interface ApplicationSettings {
  actions: ActionsSettings;
  exchange: ExchangeSettings;
  mysql: MysqlSettings;
  trading: TradingSettings;
  process: RobotProcess;
}

export interface NotificationContent {
  title?: string;
  body?: string;
}

export interface ResolutionOption {
  resolution: string;
  name: string;
}

export enum StoreKey {
  Actions = 'actions',
  Exchange = 'exchange',
  Mysql = 'mysql',
  Trading = 'trading',
  Process = 'process',
}
