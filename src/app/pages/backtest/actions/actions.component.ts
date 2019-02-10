import { Component, OnInit } from '@angular/core';

import { Trader } from '@duet-robot/trader';
import { OrderSide } from '@duet-robot/type';

import { SymbolsService } from '../../../@core/data';
import { BacktestService } from '../../../@core/services';
import { ActionsSettings, ResolutionOption } from '../../../@core/types';
import { SettingsService } from '../../../@core/utils';

@Component({
  selector: 'ngx-backtest-actions',
  styleUrls: ['./actions.component.scss'],
  templateUrl: './actions.component.html',
})
export class ActionsComponent implements OnInit {
  actions: ActionsSettings;
  symbols: string[];
  resolutions: ResolutionOption[];
  radioSide = 'Sell';
  trader: Trader;

  constructor(private settingsService: SettingsService, private symbolsService: SymbolsService, private backtestService: BacktestService) {
    this.actions = this.settingsService.getActions();
    this.trader = new Trader(settingsService.getExchange());
  }

  ngOnInit() {
    this.symbols = this.symbolsService.getSymbols();
    this.resolutions = [
      { resolution: '1', name: '1分钟' },
      { resolution: '5', name: '5分钟' },
      { resolution: '60', name: '1小时' },
      { resolution: '1D', name: '1天' },
    ];
  }

  async launch() {
    await this.backtestService.launch({
      pair: this.actions.symbol,
      resolution: this.actions.resolution.resolution,
      side: <OrderSide>this.radioSide,
    });
  }
}
