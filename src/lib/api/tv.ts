import { Bar, Configuration, HttpMothed, LibrarySymbolInfo, UdfResponse } from '@duet-robot/type';

import { ExchangeSettings } from '../../app/@core/types';
import { environment } from '../../environments/environment';
import { Rest, RestResponse } from './rest';

const crypto = require('crypto');
const qs = require('qs');

enum Endpoint {
  Config = 'config',
  Symbol = 'symbols',
  Bar = 'history',
}

export class TvApi {
  private readonly rest: Rest;

  constructor(config: ExchangeSettings) {
    this.rest = new Rest(config, environment.production ? '' : 'http://127.0.0.1:7070');
  }

  async getConfig(): Promise<Configuration> {
    const res = await this.request(Endpoint.Config);

    return <Configuration>res;
  }

  async getSymbolInfo(symbol: string): Promise<LibrarySymbolInfo> {
    const res = <any>await this.request(Endpoint.Symbol, { symbol });

    return <LibrarySymbolInfo>res;
  }

  async getBars(symbol: string, resolution: string, from?: number, to?: number): Promise<Bar[]> {
    const end = to ? to : Math.floor(Date.now() / 1000);
    const resolutionTime = resolution.includes('D') ? +resolution.split('D')[0] * 1440 : +resolution;
    const start = from ? from : end - resolutionTime * 60 * 60;
    const res: UdfResponse = <any>await this.request(Endpoint.Bar, {
      symbol,
      resolution,
      from: start,
      to: end,
    });

    if (res.s === 'no_data') {
      return [];
    }

    const bars: Bar[] = [];
    res.o.map((open, index) => {
      bars.push({
        time: res.t[index] * 1000,
        open,
        close: res.c[index],
        high: res.h[index],
        low: res.l[index],
        volume: res.v[index],
      });
    });

    return bars;
  }

  private async request(endpoint: string, data?: { [attr: string]: any }): Promise<RestResponse> {
    const query = data && Object.keys(data).length !== 0 ? '?' + qs.stringify(data) : '';
    // 3分钟过期时间
    const expires = Math.round(Date.now() / 1000) + 60 * 3;
    const method = HttpMothed.GET;
    const basePath = '/api/udf/';
    // 签名内容（verb + path + nonce + input）
    const signContent = method + basePath + endpoint + query + expires;
    const credential = this.rest.getCredential();
    // 请求的签名
    const signature = this.rest.getSignature(credential.secret, signContent);

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        'api-expires': String(expires),
        'api-key': credential.apiKey,
        'api-signature': signature,
      },
    };

    const url = this.rest.baseUrl + basePath + endpoint + query;
    const reponse = await fetch(url, options);
    const json = await reponse.json();
    return json;
  }
}
