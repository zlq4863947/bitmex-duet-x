import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { OrderTableService } from '../../../@core/data/order-table.service';

@Component({
  selector: 'ngx-order-table',
  styleUrls: ['./order-table.component.scss'],
  templateUrl: './order-table.component.html',
})
export class OrderTableComponent {
  settings: any;
  source: LocalDataSource = new LocalDataSource();

  constructor(private service: OrderTableService) {
    this.settings = this.service.getSettings();
    this.service.getData().then((data) => {
      this.source.load(data);
    });
  }
}
