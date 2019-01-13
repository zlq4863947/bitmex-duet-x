import { Component, OnInit } from '@angular/core';

import { ExchangeSettings } from '../../../@core/types';
import { NotificationsService } from '../../../@core/utils/notifications.service';
import { SettingsService } from '../../../@core/utils/settings.service';
import { Trader } from '@duet-robot/trader';

@Component({
  selector: 'ngx-setting-exchange',
  styleUrls: ['./setting-exchange.component.scss'],
  templateUrl: './setting-exchange.component.html',
})
export class SettingExchangeComponent implements OnInit {
  exchange: ExchangeSettings;
  activated: 'real' | 'test';

  constructor(public settingsService: SettingsService, public notificationsService: NotificationsService) {}

  ngOnInit() {
    this.exchange = this.settingsService.getExchange();
  }

  save() {
    this.settingsService.setExchange(this.exchange);
  }

  onChangeTab(event) {
    this.activated = event.tabTitle === '真实交易' ? 'real' : 'test';
  }

  async testApikey() {
    let trader: Trader;
    const prevMode = this.exchange.mode;
    if (this.activated === 'real') {
      this.exchange.mode = 'real';
      trader = new Trader(this.exchange)
    } else {
      this.exchange.mode = 'test';
      trader = new Trader(this.exchange)
    }
    this.exchange.mode = prevMode;
    const res = await trader.updateLeverage('XBTUSD', 2);
    if(res && res.order) {
      if(res.order.error) {
        this.notificationsService.error({
          title: '验证apikey失败!',
          body: `错误信息: ${res.order.error.message}`
        });
      } else {
        this.notificationsService.success({
          title: '验证apikey成功!'
        });
      }
    }
  }
}
