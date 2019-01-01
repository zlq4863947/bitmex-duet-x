import { Injectable } from '@angular/core';
import * as settings from 'electron-settings';

import { ActionsSettings, ApplicationSettings, ExchangeSettings, MysqlSettings, RobotProcess, StoreKey, TradingSettings } from '../types';

@Injectable()
export class SettingsService {
  settings: typeof settings;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.settings = window.require('electron').remote.require('electron-settings');
    }
  }

  isElectron = () => window && window.process && window.process.type;

  getApplicationSettings(): ApplicationSettings {
    return <any>this.settings.getAll();
  }

  setActions(actions: ActionsSettings) {
    this.settings.set(StoreKey.Actions, <any>actions);
  }

  getActions(): ActionsSettings {
    let settings = this.settings.get(StoreKey.Actions);
    // 没有值的时候
    if (!settings) {
      settings = {
        symbol: 'XBTUSD',
        resolution: { resolution: '1', name: '1分钟' },
      };
      // 配置初期化
      this.setActions(<any>settings);
    }
    return <any>settings;
  }

  setExchange(exchange: ExchangeSettings) {
    this.settings.set(StoreKey.Exchange, <any>exchange);
  }

  getExchange(): ExchangeSettings {
    let settings = this.settings.get(StoreKey.Exchange);
    // 没有值的时候
    if (!settings) {
      settings = {
        real: { apiKey: '', secret: '' },
        test: { apiKey: '', secret: '' },
        mode: 'real',
      };
      // 配置初期化
      this.setExchange(<any>settings);
    }
    return <any>settings;
  }

  setMysql(mysql: MysqlSettings) {
    this.settings.set(StoreKey.Mysql, <any>mysql);
  }

  getMysql(): MysqlSettings {
    let settings = this.settings.get(StoreKey.Mysql);
    // 没有值的时候
    if (!settings) {
      settings = {
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'duet',
      };
      // 配置初期化
      this.setMysql(<any>settings);
    }
    return <any>settings;
  }

  setTrading(trading: TradingSettings) {
    this.settings.set(StoreKey.Trading, <any>trading);
  }

  getTrading(): TradingSettings {
    let settings = this.settings.get(StoreKey.Trading);
    // 没有值的时候
    if (!settings) {
      settings = {
        symbol: 'XBTUSD',
        side: 'Buy',
        amount: '',
        leverage: '',
      };
      // 配置初期化
      this.setTrading(<any>settings);
    }
    return <any>settings;
  }

  setProcess(process: RobotProcess) {
    this.settings.set(StoreKey.Process, <any>process);
  }

  getProcess(): RobotProcess {
    let settings = this.settings.get(StoreKey.Process);
    // 没有值的时候
    if (!settings) {
      settings = {
        isActived: false,
        status: {}
      };
      // 配置初期化
      this.setProcess(<any>settings);
    }
    return <any>settings;
  }
}
