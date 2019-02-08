import { Trader } from '@duet-robot/trader';

import { SettingsService } from '../../../@core/utils';
import {
  Bar,
  ErrorCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  Timezone,
} from './charting_library/charting_library.min';

export class Datafeed implements IBasicDataFeed {
  pair: string;
  resolution: string;
  trader: Trader;
  constructor(private settingsService: SettingsService) {
    this.trader = new Trader(settingsService.getExchange());
  }
  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void {
    throw new Error('Method not implemented.');
  }

  resolveSymbol(symbol: string, onResolve: ResolveCallback, onError: ErrorCallback): void {
    const symbolData = {
      name: symbol,
      full_name: symbol,
      exchange: 'BitMEX',
      listed_exchange: symbol,
      timezone: <Timezone>'Asia/Shanghai',
      minmov: 1,
      pricescale: 100,
      session: '24x7',
      has_intraday: true,
      has_no_volume: false,
      ticker: symbol,
      description: '',
      type: 'bitcoin',
      supported_resolutions: ['1', '5', '15', '30', '60', '120', 'D'],
    };
    // onResolve invoked async
    setTimeout(() => {
      onResolve(symbolData);
    });
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: HistoryCallback,
    onError: ErrorCallback,
    isFirstCall: boolean,
  ): Promise<void> {
    const bars = await this.trader.getBars(symbolInfo.name, resolution);
    console.log('bars: ', bars);

    // return data only for first time
    if (isFirstCall) {
      /* tslint:disable:no-floating-promises promise-function-async */
      /*fetch(url)
        .then((data) => data.json())
        .then((data: Bar[]) => {
          onResult(data, { noData: false });
        });*/
    } else {
      onResult([], { noData: true });
    }
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void,
  ): void {
    console.log('subscribeBars');
    // throw new Error('Method not implemented.');
  }

  unsubscribeBars(listenerGuid: string): void {
    console.log('unsubscribeBars');
    // throw new Error('Method not implemented.');
  }

  onReady(callback: OnReadyCallback): void {
    // throw new Error('Method not implemented.');
    // callback invoked async
    // default configuration
    setTimeout(callback);
  }
}
