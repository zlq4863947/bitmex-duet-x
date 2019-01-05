import { Component, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subscription } from 'rxjs';

import { LogTableService } from '../../../@core/data/log-table.service';
import { Log } from '../../../@core/services/mysql/entity';

@Component({
  selector: 'ngx-action-log-table',
  styleUrls: ['./action-log-table.component.scss'],
  templateUrl: './action-log-table.component.html',
})
export class ActionLogTableComponent implements OnDestroy {
  private logData: Log[];
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  timer: Observable<number> = Observable.create((observer) => {
    let timer = setInterval(() => observer.next(), 1000);
    return () => clearInterval(timer);
  });
  sub: Subscription;

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
