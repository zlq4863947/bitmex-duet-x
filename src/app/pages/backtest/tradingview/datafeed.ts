import { TvApi } from '@duet-robot/api/tv';
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
  tvApi: TvApi;
  constructor(private settingsService: SettingsService) {
    this.trader = new Trader(settingsService.getExchange());
    this.tvApi = new TvApi(settingsService.getExchange());
  }
  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void {
    throw new Error('Method not implemented.');
  }

  async resolveSymbol(symbol: string, onResolve: ResolveCallback, onError: ErrorCallback) {
    const symbolInfo = await this.tvApi.getSymbolInfo(symbol);
    onResolve(symbolInfo);
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
    // return data only for first time
    if (isFirstCall) {
      const bars = await this.tvApi.getBars(symbolInfo.name, resolution, rangeStartDate, rangeEndDate);
      onResult(bars, { noData: false });
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

  async onReady(callback: OnReadyCallback) {
    const config = await this.tvApi.getConfig();
    callback(config);
  }
}
