import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { OrderTableService } from '../../../@core/data/order-table.service';

@Component({
  selector: 'ngx-order-table',
  styleUrls: ['./order-table.component.scss'],
  templateUrl: './order-table.component.html',
})
export class OrderTableComponent {

  settings = {
    hideSubHeader: true,
    actions: {
      columnTitle: '操作',
      add: false,
      position: 'right'
    },
    rowClassFunction: (row) => {
      // console.log('-------------------------', row)
      if (row.data.id > 2) {
          return '';
      } else {
          return 'hide-action';
      }
    },
    
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      age: {
        title: 'Age',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: OrderTableService) {
    const data = this.service.getData();
    this.source.load(data);
  }
/*
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }*/
}
