import { moduleMetadata, storiesOf } from '@storybook/angular';

import { ActionLogTableComponent } from './action-log-table.component';
import { MysqlService } from '../../../@core/services';
import { mockLogTableData } from '../../../testing';
import { LogTableService } from '../../../@core/data';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../../@theme/theme.module';

storiesOf('日志', module)
  .addDecorator(
    moduleMetadata({
      imports: [ThemeModule, Ng2SmartTableModule],
      declarations: [ActionLogTableComponent],
      providers: [
        {
          provide: LogTableService,
          useValue: {
            getData: () => Promise.resolve(mockLogTableData),
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
                  resolution: { title: 'K线周期', type: 'string' },
                  operation: { title: '操作', ype: 'string' },
                  content: { title: '内容', type: 'string' },
                },
              };
            }
          },
        },
        {
          provide: MysqlService,
          useValue: {
            getLogs: () => Promise.resolve(mockLogTableData),
            autoConnects: () => Promise.resolve(true),
            /*getUserDepositHistory: () =>  of(mockJpyDepositHistoryData)*/
          },
        },
      ],
    }),
  )
  .add('操作日志列表', () => ({
    component: ActionLogTableComponent,
    props: {
      settings: {
        hideSubHeader: true,
        actions: {
          add: false,
          edit: false,
          delete: false,
        },
        columns: {
          time: { title: '时间', type: 'string' },
          symbol: { title: '商品', type: 'string' },
          resolution: { title: 'K线周期', type: 'string' },
          operation: { title: '操作', ype: 'string' },
          content: { title: '内容', type: 'string' },
        },
      },
    },
  }));
