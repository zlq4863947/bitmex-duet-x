import { Component, OnInit, ViewChild } from '@angular/core';

import { NotificationsService } from '../../../@core/utils/notifications.service';
import { SettingExchangeComponent } from './setting-exchange/setting-exchange.component';
import { SettingMysqlComponent } from './setting-mysql/setting-mysql.component';

@Component({
  selector: 'ngx-settings-system',
  templateUrl: './settings-system.component.html',
})
export class SettingsSystemComponent implements OnInit {
  @ViewChild(SettingMysqlComponent) mysqlSettings: SettingMysqlComponent;
  @ViewChild(SettingExchangeComponent) exchangeSettings: SettingExchangeComponent;

  constructor(public notificationsService: NotificationsService) {}

  ngOnInit() {}

  save() {
    try {
      this.mysqlSettings.save();
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
