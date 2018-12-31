import { setInterval } from 'timers';

import { Component, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subscription } from 'rxjs';

import { Order, OrderTableService } from '../../../@core/data/order-table.service';

@Component({
  selector: 'ngx-order-table',
  styleUrls: ['./order-table.component.scss'],
  templateUrl: './order-table.component.html',
})
export class OrderTableComponent implements OnDestroy {
  private orderData: Order[];
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  timer: Observable<number> = Observable.create((observer) => {
    let timer = setInterval(() => observer.next(), 1000);
    return () => clearInterval(timer);
  });
  sub: Subscription;

  constructor(private service: OrderTableService) {
    this.settings = this.service.getSettings();
    this.loadData();
    this.sub = this.timer.subscribe(async () => {
      await this.loadData();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async loadData() {
    const data = await this.service.getData();
    if (!this.orderData || JSON.stringify(this.orderData) !== JSON.stringify(data)) {
      this.orderData = data;
      this.source.load(data);
    }
  }
}
