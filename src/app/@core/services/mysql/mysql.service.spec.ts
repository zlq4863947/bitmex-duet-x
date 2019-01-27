import { TestBed } from '@angular/core/testing';

import { mockApplicationSettings } from '../../../testing';
import { SettingsService } from '../../utils';
import { MysqlService } from './mysql.service';

describe('mysql service', async () => {
  let mysqlService: MysqlService;
  const mysqlSettings = mockApplicationSettings.mysql;

  beforeAll(async () => {
    TestBed.configureTestingModule({
      providers: [
        MysqlService,
        {
          provide: SettingsService,
          useValue: {
            settings: {
              getAll: () => mockApplicationSettings,
            },
          },
        },
      ],
    });
    mysqlService = TestBed.get(MysqlService);
  });

  afterAll(async () => {
    await mysqlService.disconnect();
  });

  it('计算收益率', async () => {
    const orders = await mysqlService.getOrders();
    const orders2 = await mysqlService.syncROE(orders);
    console.log(orders2)
  });
});
