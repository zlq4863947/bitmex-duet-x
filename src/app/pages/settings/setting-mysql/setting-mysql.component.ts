import { Component, OnInit } from '@angular/core';

import { MysqlService } from '@duet-core/services';
import { MysqlSettings } from '@duet-core/types';
import { NotificationsService, SettingsService } from '@duet-core/utils';

@Component({
  selector: 'ngx-setting-mysql',
  styleUrls: ['./setting-mysql.component.scss'],
  templateUrl: './setting-mysql.component.html',
})
export class SettingMysqlComponent implements OnInit {
  mysql: MysqlSettings;

  constructor(
    public settingsService: SettingsService,
    public mysqlService: MysqlService,
    public notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    this.mysql = this.settingsService.getMysql();
  }

  async connect() {
    const res = await this.mysqlService.testConnect(this.mysql);
    if (res.errorMsg) {
      this.notificationsService.error({
        title: '连接失败',
        body: res.errorMsg,
      });
    } else {
      this.notificationsService.success({
        title: '连接成功',
      });
    }
  }

  save() {
    this.settingsService.setMysql(this.mysql);
  }
}
