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

export interface NotificationContent {
  title?: string;
  body?: string;
}
