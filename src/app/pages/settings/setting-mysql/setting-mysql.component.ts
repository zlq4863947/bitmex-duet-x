import { Component, OnInit } from '@angular/core';

import { MysqlService } from '../../../@core/services/mysql/mysql.service';
import { MysqlSettings } from '../../../@core/types';
import { ElectronService } from '../../../@core/utils/electron.service';
import { NotificationsService } from '../../../@core/utils/notifications.service';

@Component({
  selector: 'ngx-setting-mysql',
  styleUrls: ['./setting-mysql.component.scss'],
  templateUrl: './setting-mysql.component.html',
})
export class SettingMysqlComponent implements OnInit {
  constructor(
    public electronService: ElectronService,
    public mysqlService: MysqlService,
    public notificationsService: NotificationsService,
  ) {}

  storeKey = 'mysql';
  mysql: MysqlSettings;

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
    this.notificationsService.showSuccess({
      title: '测试标题',
      body: '测试内容',
    });
    /*
    const res = this.mysqlService.testConnection();
    console.log('res: ', res);
    const con = await this.mysqlService.connection(this.mysql);
    console.log(con);
    const res2 = this.mysqlService.testConnection();
    console.log('res2: ', res2);*/
  }

  save() {
    this.electronService.settings.set(this.storeKey, { ...this.mysql });
  }
}
