import { Component, OnDestroy, OnInit } from '@angular/core';

import { BacktestOutput, BacktestService } from '../../../@core/services';
import { IChartingLibraryWidget, widget } from './charting_library/charting_library.min';
import { Datafeed } from './datafeed';

@Component({
  selector: 'ngx-backtest-tradingview',
  styleUrls: ['./tradingview.component.scss'],
  templateUrl: './tradingview.component.html',
})
export class TradingviewComponent implements OnInit, OnDestroy {
  tvWidget: IChartingLibraryWidget;

  constructor(private backtestService: BacktestService) {}

  ngOnInit() {
    this.backtestService.launchBacktest$.subscribe((res) => {
      console.log('launchBacktest: ');
      this.removeChart();
      this.initChart(res);
    });
  }

  ngOnDestroy() {
    this.removeChart();
  }

  initChart(backtest: BacktestOutput): void {
    this.tvWidget = (window as any).tvWidget = new widget({
      debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: false,
      autosize: true,
      symbol: backtest.pair,
      interval: backtest.resolution,
      container_id: 'tv-chart-container',
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new Datafeed(backtest),
      library_path: 'assets/charting_library/',
      locale: 'zh',
      timezone: 'Asia/Shanghai',
      theme: 'Light', // 'Dark',
      disabled_features: [
        'widget_logo',
        'use_localstorage_for_settings',
        'header_symbol_search',
        'symbol_search_hot_key',
        'header_resolutions',
        'header_compare',
      ],
    });
  }

  removeChart() {
    if (this.tvWidget) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }
}
