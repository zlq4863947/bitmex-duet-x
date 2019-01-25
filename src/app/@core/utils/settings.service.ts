import { Injectable } from '@angular/core';
import * as settings from 'electron-settings';

import { isElectron } from '@duet-core/functions';

import { ActionsSettings, ApplicationSettings, ExchangeSettings, MysqlSettings, RobotProcess, StoreKey, TradingSettings } from '../types';

@Injectable()
export class SettingsService {
  settings: typeof settings;

  constructor() {
    // Conditional imports
    if (isElectron()) {
      this.settings = window.require('electron').remote.require('electron-settings');
    }
  }

  getApplicationSettings(): ApplicationSettings {
    return <any>this.settings.getAll();
  }

  setActions(actions: ActionsSettings) {
    this.settings.set(StoreKey.Actions, <any>actions);
  }

  getActions(): ActionsSettings {
    let actionsSettings = this.settings.get(StoreKey.Actions);
    // 没有值的时候
    if (!actionsSettings) {
      actionsSettings = {
        symbol: 'XBTUSD',
        resolution: { resolution: '1', name: '1分钟' },
      };
      // 配置初期化
      this.setActions(<any>actionsSettings);
    }
    return <any>actionsSettings;
  }

  setExchange(exchange: ExchangeSettings) {
    this.settings.set(StoreKey.Exchange, <any>exchange);
  }

  getExchange(): ExchangeSettings {
    let exSettings = this.settings.get(StoreKey.Exchange);
    // 没有值的时候
    if (!exSettings) {
      exSettings = {
        real: { apiKey: '', secret: '' },
        test: { apiKey: '', secret: '' },
        mode: 'real',
      };
      // 配置初期化
      this.setExchange(<any>exSettings);
    }
    return <any>exSettings;
  }

  setMysql(mysql: MysqlSettings) {
    this.settings.set(StoreKey.Mysql, <any>mysql);
  }

  getMysql(): MysqlSettings {
    let mysqlSettings = this.settings.get(StoreKey.Mysql);
    // 没有值的时候
    if (!mysqlSettings) {
      mysqlSettings = {
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'duet',
      };
      // 配置初期化
      this.setMysql(<any>mysqlSettings);
    }
    return <any>mysqlSettings;
  }

  setTrading(trading: TradingSettings) {
    this.settings.set(StoreKey.Trading, <any>trading);
  }

  getTrading(): TradingSettings {
    let tradingSettings = this.settings.get(StoreKey.Trading);
    // 没有值的时候
    if (!tradingSettings) {
      tradingSettings = {
        symbol: 'XBTUSD',
        side: 'Buy',
        amount: '',
        leverage: '',
      };
      // 配置初期化
      this.setTrading(<any>tradingSettings);
    }
    return <any>tradingSettings;
  }

  setProcess(process: RobotProcess) {
    this.settings.set(StoreKey.Process, <any>process);
  }

  getProcess(): RobotProcess {
    let processSettings = this.settings.get(StoreKey.Process);
    // 没有值的时候
    if (!processSettings) {
      processSettings = {
        isActived: false,
        status: {},
      };
      // 配置初期化
      this.setProcess(<any>processSettings);
    }
    return <any>processSettings;
  }
}
