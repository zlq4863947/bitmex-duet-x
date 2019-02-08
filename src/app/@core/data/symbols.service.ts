import { Injectable } from '@angular/core';

import { ResolutionOption } from '../types';

@Injectable()
export class SymbolsService {
  private symbols = ['XBTUSD', 'ADAZ19', 'BCHZ19', 'EOSZ19', 'ETHUSD', 'LTCZ19', 'TRXZ19', 'XRPZ19'];
  private resolutions: ResolutionOption[] = [
    { resolution: '1', name: '1分钟' },
    { resolution: '5', name: '5分钟' },
    { resolution: '15', name: '15分钟' },
    { resolution: '30', name: '30分钟' },
    { resolution: '60', name: '1小时' },
    { resolution: '120', name: '2小时' },
    { resolution: '180', name: '3小时' },
    { resolution: '240', name: '4小时' },
    { resolution: '360', name: '6小时' },
    { resolution: '720', name: '12小时' },
    { resolution: '1D', name: '1天' },
    { resolution: '3D', name: '3天' },
  ];

  getSymbols() {
    return this.symbols;
  }

  getResolutions(): ResolutionOption[] {
    return this.resolutions;
  }
}
