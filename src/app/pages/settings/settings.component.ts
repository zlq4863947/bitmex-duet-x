import { Component, OnInit, ViewChild } from '@angular/core';

import { NotificationsService } from '../../@core/utils/notifications.service';
import { SettingExchangeComponent } from './setting-exchange/setting-exchange.component';
import { SettingMysqlComponent } from './setting-mysql/setting-mysql.component';
import { SettingTradingComponent } from './setting-trading/setting-trading.component';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  constructor(public notificationsService: NotificationsService) {}

  @ViewChild(SettingMysqlComponent) mysqlSettings: SettingMysqlComponent;
  @ViewChild(SettingTradingComponent) tradingSettings: SettingTradingComponent;
  @ViewChild(SettingExchangeComponent) exchangeSettings: SettingExchangeComponent;

  ngOnInit() {}

  save() {
    try {
      this.mysqlSettings.save();
      this.tradingSettings.save();
      this.exchangeSettings.save();
      this.notificationsService.success({
        title: '保存成功',
      });
    } catch (error) {
      this.notificationsService.error({
        title: '保存失败',
        body: error.message,
      });
    }
  }
}
