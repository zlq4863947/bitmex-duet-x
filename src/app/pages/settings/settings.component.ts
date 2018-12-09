import { Component, OnInit, ViewChild } from '@angular/core';

import { SettingMysqlComponent } from './setting-mysql/setting-mysql.component';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  @ViewChild(SettingMysqlComponent) mysqlSettings: SettingMysqlComponent;

  ngOnInit() {}

  save() {
    this.mysqlSettings.save();
  }
}
