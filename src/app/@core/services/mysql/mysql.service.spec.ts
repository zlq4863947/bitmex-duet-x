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
    console.log(12);
    /*pubConn = await createConnection(bronxPublicDbName);
    coreConn = await createConnection(bronxCoreDbName);
    const masterSymbolRepository = coreConn.getCustomRepository(MasterSymbolRepository);
    await masterSymbolRepository.importDefaultSymbols();*/
  });

  afterAll(async () => {
    // await pubConn.close();
  });

  it('计算收益率', async () => {
    const orders = await mysqlService.getOrders();
    console.log(orders);
    await mysqlService.disconnect();
  });
});
