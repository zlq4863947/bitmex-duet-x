import { Injectable } from '@angular/core';

@Injectable()
export class SymbolsService {
  private symbols = ['XBTUSD', 'ADAZ18', 'BCHZ18', 'EOSZ18', 'ETHUSD', 'LTCZ18', 'TRXZ18', 'XRPZ18'];
  private resolutions = ['1分钟', '10分钟', '30分钟', '1小时'];

  getSymbols() {
    return this.symbols;
  }

  getResolutions() {
    return this.resolutions;
  }
}
