import { Component, OnInit } from '@angular/core';

import { Trader } from '@duet-robot/trader';

import { ActionsSettings, ResolutionOption } from '../../../@core/types';
import { SymbolsService } from '../../../@core/data';
import { SettingsService } from '../../../@core/utils';
import { BacktestService } from '../../../@core/services';

@Component({
  selector: 'ngx-backtest-actions',
  styleUrls: ['./actions.component.scss'],
  templateUrl: './actions.component.html',
})
export class ActionsComponent implements OnInit {
  actions: ActionsSettings;
  symbols: string[];
  resolutions: ResolutionOption[];
  trader: Trader;

  constructor(
    private settingsService: SettingsService,
    private symbolsService: SymbolsService,
    private backtestService: BacktestService,
  ) {
    this.actions = this.settingsService.getActions();
    this.trader = new Trader(settingsService.getExchange());
  }

  ngOnInit() {
    this.symbols = this.symbolsService.getSymbols();
    this.resolutions = this.symbolsService.getResolutions();
  }

  async launch() {
    this.backtestService.launch({
      pair: this.actions.symbol,
      resolution: this.actions.resolution.resolution
    });
  }
}
