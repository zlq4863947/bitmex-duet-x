import { Component, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subscription } from 'rxjs';

import { LogTableService } from '../../../@core/data';
import { LogEntity } from '../../../@core/services';

@Component({
  selector: 'ngx-action-log-table',
  styleUrls: ['./action-log-table.component.scss'],
  templateUrl: './action-log-table.component.html',
})
export class ActionLogTableComponent implements OnDestroy {
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  timer: Observable<number> = Observable.create((observer) => {
    const timer = setInterval(() => observer.next(), 2000);
    return () => clearInterval(timer);
  });
  sub: Subscription;
  private logData: LogEntity[];

  constructor(private service: LogTableService) {
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
    if (!this.logData || JSON.stringify(this.logData) !== JSON.stringify(data)) {
      this.logData = data;
      this.source.load(data);
    }
  }
}
