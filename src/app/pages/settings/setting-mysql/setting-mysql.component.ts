import { Component, OnInit } from '@angular/core';
import { ToasterConfig, ToasterModule, ToasterService } from 'angular2-toaster/angular2-toaster';

import { MysqlService } from '../../../@core/services/mysql/mysql.service';
import { MysqlSettings } from '../../../@core/types';
import { ElectronService } from '../../../@core/utils/electron.service';

@Component({
  selector: 'ngx-setting-mysql',
  styleUrls: ['./setting-mysql.component.scss'],
  templateUrl: './setting-mysql.component.html',
})
export class SettingMysqlComponent implements OnInit {
  storeKey = 'mysql';
  mysql: MysqlSettings;

  constructor(public electronService: ElectronService, public mysqlService: MysqlService, public toasterService: ToasterService) {}

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
    const res = this.mysqlService.testConnection();
    console.log('res: ', res);
    const con = await this.mysqlService.connection(this.mysql);
    console.log(con);
    const res2 = this.mysqlService.testConnection();
    console.log('res2: ', res2);
  }

  save() {
    this.electronService.settings.set(this.storeKey, { ...this.mysql });
  }
}
