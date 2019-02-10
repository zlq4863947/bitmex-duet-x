import { TestBed } from '@angular/core/testing';

import { OrderSide } from '@duet-robot/type';

import { BacktestService } from './backtest.service';

describe('backtest service', async () => {
  let backtestService: BacktestService;

  beforeAll(async () => {
    TestBed.configureTestingModule({
      providers: [BacktestService],
    });
    backtestService = TestBed.get(BacktestService);
  });

  afterAll(async () => {});

  it.skip('订阅回测按钮动态', async (done) => {
    backtestService.launchBacktest$.subscribe((input) => {
      console.log('launchBacktest: ', JSON.stringify(input));
    });

    let count = 0;
    const interval = setInterval(() => {
      count++;
      backtestService.launch({
        pair: 'XBTUSD',
        resolution: count + '',
        side: OrderSide.Buy,
      });
      if (count > 3) {
        clearInterval(interval);
        done();
      }
    }, 1000);
  });
});
