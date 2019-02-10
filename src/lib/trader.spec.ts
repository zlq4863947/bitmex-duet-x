import { Trader } from './trader';

describe('backtest service', async () => {
  const trader = new Trader({
    real: undefined,
    test: {
      apiKey: 'xcWx4ts3A5sluYBupjvvNAnO',
      secret: 'rpeJNuMp-8uAJTae6UUed2kyt-bGfGIGQ_Rh033TFuhheK4l',
    },
    mode: 'test',
  });

  it.only('测试获取k线', async () => {
    const bars = await trader.getBars('XBTUSD', '60');
    console.log(bars);
  });
});
