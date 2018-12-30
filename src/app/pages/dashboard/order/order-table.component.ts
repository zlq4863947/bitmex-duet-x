import { setInterval } from 'timers';

import { Component, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subscription } from 'rxjs';

import { OrderTableService } from '../../../@core/data/order-table.service';

@Component({
  selector: 'ngx-order-table',
  styleUrls: ['./order-table.component.scss'],
  templateUrl: './order-table.component.html',
})
export class OrderTableComponent implements OnDestroy {
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  timer: Observable<number> = Observable.create((observer) => {
    let i = 0;
    let timer = setInterval(() => observer.next(i++), 1000);
    return () => clearInterval(timer);
  });
  sub: Subscription;

  constructor(private service: OrderTableService) {
    this.settings = this.service.getSettings();
    this.loadData();
    this.sub = this.timer.subscribe((i) => {
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadData() {
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }
}
