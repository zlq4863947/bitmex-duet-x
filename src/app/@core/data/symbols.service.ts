import { Injectable } from '@angular/core';

@Injectable()
export class SymbolsService {
  private symbols = ['XBTUSD', 'ADAZ18', 'BCHZ18', 'EOSZ18', 'ETHUSD', 'LTCZ18', 'TRXZ18', 'XRPZ18'];
  private resolutions = ['1分钟', '3分钟', '5分钟', '15分钟', '30分钟', '1小时', '2小时', '3小时', '4小时', '6小时', '12小时', '1天', '3天', '1周', '2周', '1月'];

  getSymbols() {
    return this.symbols;
  }

  getResolutions() {
    return this.resolutions;
  }
}
