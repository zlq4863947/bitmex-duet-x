import { moduleMetadata, storiesOf } from '@storybook/angular';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { OrderTableService } from '../../../@core/data';
import { ThemeModule } from '../../../@theme/theme.module';
import { mockOrderTableData } from '../../../testing';
import { OrderTableComponent } from './order-table.component';
import { getStatusHtml } from '../../../@core/functions';
import { Component } from '@angular/core';

@Component({
  styles: [`
    :host /deep/ .cell_success {
      color: darkgreen;
    }
    :host /deep/ .cell_fail {
      color: deeppink;
    }
  `],
  template: `
  <nb-card>
    <nb-card-header>
      订单列表
    </nb-card-header>
    <nb-card-body>
      <ng2-smart-table [settings]="settings" [source]="source">
      </ng2-smart-table>
    </nb-card-body>
  </nb-card>
  `,
})
class WithOrderTableComponent extends OrderTableComponent{}

storiesOf('日志', module)
  .addDecorator(
    moduleMetadata({
      imports: [ThemeModule, Ng2SmartTableModule],
      declarations: [OrderTableComponent],
      providers: [
        {
          provide: OrderTableService,
          useValue: {
            getData: () => Promise.resolve(mockOrderTableData),
            getSettings: () => {
              return {
                hideSubHeader: true,
                actions: {
                  add: false,
                  edit: false,
                  delete: false,
                },
                columns: {
                  time: { title: '时间', type: 'string' },
                  symbol: { title: '商品', type: 'string' },
                  price: { title: '价格', type: 'number' },
                  amount: { title: '数量', type: 'number' },
                  side: { title: '方向', type: 'string' },
                  status: { title: '状态', type: 'html', valuePrepareFunction: getStatusHtml },
                  roe: { title: '收益率', type: 'string' },
                },
              };
            },
          },
        },
      ],
    }),
  )
  .add('订单日志列表', () => ({
    component: WithOrderTableComponent
  }));