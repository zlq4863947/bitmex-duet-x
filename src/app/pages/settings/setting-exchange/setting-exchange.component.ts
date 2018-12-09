import { Component, OnInit } from '@angular/core';

import { ExchangeSettings } from '../../../@core/types';
import { ElectronService } from '../../../@core/utils/electron.service';
import { NotificationsService } from '../../../@core/utils/notifications.service';

@Component({
  selector: 'ngx-setting-exchange',
  styleUrls: ['./setting-exchange.component.scss'],
  templateUrl: './setting-exchange.component.html',
})
export class SettingExchangeComponent implements OnInit {
  constructor(public electronService: ElectronService, public notificationsService: NotificationsService) {}

  exchange: ExchangeSettings;
  storeKey = 'exchange';

  ngOnInit() {
    this.initSetting();
  }

  initSetting() {
    let settings = this.electronService.settings.get(this.storeKey);
    // 没有值的时候
    if (!settings) {
      settings = {
        real: {
          apiKey: '',
          secret: '',
        },
        test: {
          apiKey: '',
          secret: '',
        },
        mode: 'real',
      };
      // 配置初期化
      this.electronService.settings.set(this.storeKey, settings);
    }
    this.exchange = <any>settings;
  }

  save() {
    console.log(this.exchange);
    this.electronService.settings.set(this.storeKey, <any>this.exchange);
  }
}
