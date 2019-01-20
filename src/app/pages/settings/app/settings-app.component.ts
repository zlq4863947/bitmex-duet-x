import { Component, OnInit, ViewChild } from '@angular/core';

import { NotificationsService } from '../../../@core/utils/notifications.service';
import { SettingTradingComponent } from './setting-trading/setting-trading.component';

@Component({
  selector: 'ngx-settings-app',
  templateUrl: './settings-app.component.html',
})
export class SettingsAppComponent implements OnInit {
  @ViewChild(SettingTradingComponent) tradingSettings: SettingTradingComponent;

  constructor(public notificationsService: NotificationsService) {}

  ngOnInit() {}

  save() {
    try {
      this.tradingSettings.save();
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
