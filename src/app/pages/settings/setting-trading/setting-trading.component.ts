import { Component, OnInit } from '@angular/core';

import { SymbolsService } from '../../../@core/data/symbols.service';
import { TradingSettings } from '../../../@core/types';
import { ElectronService } from '../../../@core/utils/electron.service';
import { NotificationsService } from '../../../@core/utils/notifications.service';

@Component({
  selector: 'ngx-setting-trading',
  styleUrls: ['./setting-trading.component.scss'],
  templateUrl: './setting-trading.component.html',
})
export class SettingTradingComponent implements OnInit {
  constructor(
    public electronService: ElectronService,
    public notificationsService: NotificationsService,
    private symbolsService: SymbolsService,
  ) {}

  trading: TradingSettings;
  storeKey = 'trading';
  symbols: string[];

  ngOnInit() {
    this.initSetting();
    this.symbols = this.symbolsService.getSymbols();
  }

  initSetting() {
    let settings = this.electronService.settings.get(this.storeKey);
    // 没有值的时候
    if (!settings) {
      settings = {
        symbol: 'XBTUSD',
        side: 'Buy',
        amount: '',
        leverage: '',
      };
      // 配置初期化
      this.electronService.settings.set(this.storeKey, settings);
    }
    this.trading = <any>settings;
  }

  save() {
    this.electronService.settings.set(this.storeKey, { ...this.trading });
  }
}
