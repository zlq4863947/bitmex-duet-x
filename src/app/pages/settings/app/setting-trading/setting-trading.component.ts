import { Component, OnInit } from '@angular/core';

import { SymbolsService } from '../../../../@core/data/symbols.service';
import { TradingSettings } from '../../../../@core/types';
import { NotificationsService } from '../../../../@core/utils/notifications.service';
import { SettingsService } from '../../../../@core/utils/settings.service';

@Component({
  selector: 'ngx-setting-trading',
  styleUrls: ['./setting-trading.component.scss'],
  templateUrl: './setting-trading.component.html',
})
export class SettingTradingComponent implements OnInit {
  trading: TradingSettings;
  storeKey = 'trading';
  symbols: string[];

  constructor(
    public settingsService: SettingsService,
    public notificationsService: NotificationsService,
    private symbolsService: SymbolsService,
  ) {}

  ngOnInit() {
    this.trading = this.settingsService.getTrading();
    this.symbols = this.symbolsService.getSymbols();
  }

  save() {
    this.settingsService.setTrading(this.trading);
  }
}
