export interface MysqlSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface NotificationContent {
  title?: string;
  body?: string;
}
