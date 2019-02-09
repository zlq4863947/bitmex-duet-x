import { TestBed } from '@angular/core/testing';

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

  it('订阅回测按钮动态', async (done) => {
    backtestService.launchBacktest$.subscribe((input) => {
      console.log('launchBacktest: ', JSON.stringify(input));
    });

    let count = 0;
    const interval = setInterval(() => {
      count++;
      backtestService.launch({
        pair: 'BTCUSD',
        resolution: count + '',
      });
      if (count > 3) {
        clearInterval(interval);
        done();
      }
    }, 1000);
  });
});
