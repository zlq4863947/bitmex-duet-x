import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { OrderTableService } from '../../../@core/data';
import { BacktestService } from '../../../@core/services';

@Component({
  selector: 'ngx-backtest-table',
  styleUrls: ['./order-table.component.scss'],
  templateUrl: './order-table.component.html',
})
export class OrderTableComponent implements OnInit, OnDestroy {
  source: LocalDataSource = new LocalDataSource();
  settings: any;

  constructor(private orderTableService: OrderTableService, private backtestService: BacktestService) {}

  ngOnInit() {
    this.settings = this.orderTableService.getSettings();
    this.backtestService.orders$.subscribe((orders) => {
      this.source.load(orders);
    });
  }

  ngOnDestroy() {}
}
