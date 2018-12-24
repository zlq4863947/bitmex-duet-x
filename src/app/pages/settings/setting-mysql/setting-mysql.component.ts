import { Component, OnInit } from '@angular/core';

import { MysqlService } from '@duet-core/services';
import { MysqlSettings } from '@duet-core/types';
import { ElectronService, NotificationsService } from '@duet-core/utils';

@Component({
  selector: 'ngx-setting-mysql',
  styleUrls: ['./setting-mysql.component.scss'],
  templateUrl: './setting-mysql.component.html',
})
export class SettingMysqlComponent implements OnInit {
  storeKey = 'mysql';
  mysql: MysqlSettings;

  constructor(
    public electronService: ElectronService,
    public mysqlService: MysqlService,
    public notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    this.initSetting();
  }

  initSetting() {
    let mysqlSettings = this.electronService.settings.get(this.storeKey);
    // 没有值的时候
    if (!mysqlSettings) {
      mysqlSettings = {
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'duet',
      };
      // 配置初期化
      this.electronService.settings.set(this.storeKey, mysqlSettings);
    }
    this.mysql = <any>mysqlSettings;
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
    this.electronService.settings.set(this.storeKey, { ...this.mysql });
  }
}
