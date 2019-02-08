import { Component, OnInit } from '@angular/core';

import { Trader } from '@duet-robot/trader';

import { SymbolsService } from '../../../@core/data/symbols.service';
import { ActionsSettings, ResolutionOption } from '../../../@core/types';
import { SettingsService } from '../../../@core/utils/settings.service';

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

  constructor(private settingsService: SettingsService, private symbolsService: SymbolsService) {
    this.actions = this.settingsService.getActions();
    this.trader = new Trader(settingsService.getExchange());
  }

  ngOnInit() {
    this.symbols = this.symbolsService.getSymbols();
    this.resolutions = this.symbolsService.getResolutions();
  }

  async launch() {
    const bars = await this.trader.getBars(this.actions.symbol, this.actions.resolution.resolution);
    console.log('bars: ', bars);
  }
}
