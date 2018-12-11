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
  mode: string;
}

export interface ApiKeySettings {
  apiKey: string;
  secret: string;
}

export interface ActionsSettings {
  symbol: string;
  resolution: string;
}

export interface ApplicationSettings {
  actions: ActionsSettings;
  exchange: ExchangeSettings;
  mysql: MysqlSettings;
  trading: TradingSettings;
}

export interface NotificationContent {
  title?: string;
  body?: string;
}
