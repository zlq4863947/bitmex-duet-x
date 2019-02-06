import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { Order, OrderTableService } from '../../../@core/data/order-table.service';
import { widget } from './charting_library/charting_library.min';
import { Datafeed } from './datafeed';

@Component({
  selector: 'ngx-backtest-tradingview',
  styleUrls: ['./tradingview.component.scss'],
  templateUrl: './tradingview.component.html',
})
export class TradingviewComponent implements OnInit, OnDestroy {
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  private orderData: Order[];

  constructor(private service: OrderTableService) {
    this.settings = this.service.getSettings();
  }

  ngOnInit() {
    this.initChart();
  }

  ngOnDestroy() {}

  initChart(): void {
    const tvWidget = ((window as any).tvWidget = new widget({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: false,
      autosize: true,
      symbol: 'XBTUSD',
      interval: '30',
      container_id: 'tv-chart-container',
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new Datafeed(),
      library_path: '/assets/charting_library/',
      locale: 'zh',
      theme: 'Light', // 'Dark',
      disabled_features: ['use_localstorage_for_settings'],
    }));
  }
}
