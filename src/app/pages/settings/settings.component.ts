import { Component, OnInit, ViewChild } from '@angular/core';

import { SettingMysqlComponent } from './setting-mysql/setting-mysql.component';
import { NotificationsService } from '../../@core/utils/notifications.service';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  constructor(
    public notificationsService: NotificationsService,
  ) {}

  @ViewChild(SettingMysqlComponent) mysqlSettings: SettingMysqlComponent;

  ngOnInit() {}

  save() {
    try {
      this.mysqlSettings.save();
      this.notificationsService.success({
        title: '保存成功'
      });
    } catch(error) {
      this.notificationsService.error({
        title: '保存失败',
        body: error.message,
      });
    }
  }
}
