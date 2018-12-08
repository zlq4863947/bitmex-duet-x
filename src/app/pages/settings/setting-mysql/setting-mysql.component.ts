import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../@core/utils/electron.service';
import { MysqlService } from '../../../@core/services/mysql/mysql.service';
import { MysqlSettings } from '../../../@core/types';

@Component({
  selector: 'ngx-setting-mysql',
  styleUrls: ['./setting-mysql.component.scss'],
  templateUrl: './setting-mysql.component.html',
})
export class SettingMysqlComponent implements OnInit {
  storeKey = 'mysql';
  mysql: MysqlSettings;

  constructor(public electronService: ElectronService, public mysqlService: MysqlService) {}

  ngOnInit() {
    // this.electronService.settings.set('mysql', {... this.mysql});
    // Example of electron settings
    const test = this.electronService.settings.getAll();
    console.log('test: ', test);
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
        database: 'duet'
      };
      // 配置初期化
      this.electronService.settings.set(this.storeKey, mysqlSettings);
    }
    this.mysql = <any>mysqlSettings;
  }

  async connectMysql() {
    const con = await this.mysqlService.connection(this.mysql);
    console.log(con)
    //const t = this.getSettings()
  }

  save() {
    this.electronService.settings.set(this.storeKey, {...this.mysql});
  }
}
