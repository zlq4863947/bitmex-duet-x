import { BacktestOutput } from 'src/app/@core/services';

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
  constructor(private backtest: BacktestOutput) {}

  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void {
    throw new Error('Method not implemented.');
  }

  async resolveSymbol(symbol: string, onResolve: ResolveCallback, onError: ErrorCallback) {
    setTimeout(() => {
      onResolve(this.backtest.symbolInfo);
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
  ) {
    // return data only for first time
    if (isFirstCall) {
      onResult(this.backtest.bars, { noData: false });
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
    setTimeout(() => {
      callback({
        exchanges: [
          {
            value: 'BITMEX',
            name: 'BitMEX',
            desc: 'BitMEX - Bitcoin Mercantile Exchange',
          },
        ],
        symbols_types: [
          {
            name: 'Bitcoin',
            value: 'bitcoin',
          },
        ],
        supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '180', '240', '360', '720', '1D', '3D', '1W', '2W', '1M'],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
      });
    });
  }
}
