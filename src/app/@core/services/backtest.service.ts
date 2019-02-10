import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IchimokuCloudOutput } from 'tech-indicator';

import { TvApi } from '@duet-robot/api/tv';
import { ichimoku, sma } from '@duet-robot/indicator';
import { Bar, LibrarySymbolInfo, UdfResponse } from '@duet-robot/type';

import { SettingsService } from '../utils';

export interface BacktestInput {
  pair: string;
  resolution: string;
}

export interface BacktestOutput {
  pair: string;
  resolution: string;
  symbolInfo: LibrarySymbolInfo;
  bars: Bar[];
  ichimoku: IchimokuCloudOutput[];
  sma: number[];
}

@Injectable({ providedIn: 'root' })
export class BacktestService {
  private tvApi: TvApi;
  private status$ = new Subject<BacktestOutput>();

  constructor(private settingsService: SettingsService) {
    this.tvApi = new TvApi(settingsService.getExchange());
  }

  get launchBacktest$(): Observable<BacktestOutput> {
    return this.status$.asObservable();
  }

  async launch(input: BacktestInput) {
    const res = await this.getResult(input);
    this.status$.next(res);
  }

  private async getResult(input: BacktestInput): Promise<BacktestOutput> {
    const udfRes = await this.tvApi.getMaxBars(input.pair, input.resolution);
    const bars: Bar[] = [];
    const ichimokuList: IchimokuCloudOutput[] = [];
    const smaList: number[] = [];

    udfRes.o.map((val, index) => {
      bars.push({
        time: udfRes.t[index] * 1000,
        open: udfRes.o[index],
        close: udfRes.c[index],
        high: udfRes.h[index],
        low: udfRes.l[index],
        volume: udfRes.v[index],
      });

      const low = udfRes.l.slice(0, index + 1);
      const high = udfRes.h.slice(0, index + 1);
      const close = udfRes.c.slice(0, index + 1);

      const ichRes = ichimoku({ high, low });
      ichimokuList.push(ichRes.length > 0 ? ichRes[ichRes.length - 1] : undefined);
      const smaRes = sma({ values: close });
      smaList.push(smaRes.length > 0 ? smaRes[smaRes.length - 1] : undefined);
    });

    const symbolInfo = await this.tvApi.getSymbolInfo(input.pair);

    return {
      pair: input.pair,
      resolution: input.resolution,
      symbolInfo,
      bars,
      ichimoku: ichimokuList,
      sma: smaList,
    };
  }
}
