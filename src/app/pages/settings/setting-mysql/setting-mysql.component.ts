import { Component, ElementRef } from '@angular/core';

const Store = require('electron-store');
const store = new Store();

interface MysqlSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  db: string; 
}

@Component({
  selector: 'ngx-setting-mysql',
  styleUrls: ['./setting-mysql.component.scss'],
  templateUrl: './setting-mysql.component.html',
})
export class SettingMysqlComponent {

  constructor(public element: ElementRef) {
    console.log(store.get('unicorn'));
  }

  getSettings(): MysqlSettings {
    const inputHost = this.element.nativeElement.querySelector('#inputHost');
    const inputPort = this.element.nativeElement.querySelector('#inputPort');
    const inputUserName = this.element.nativeElement.querySelector('#inputUserName');
    const inputPassword = this.element.nativeElement.querySelector('#inputPassword');
    const inputDB = this.element.nativeElement.querySelector('#inputDB');
    const settings: MysqlSettings = {
      host: inputHost.value,
      port: inputPort.value,
      username: inputUserName.value,
      password: inputPassword.value,
      db: inputDB.value, 
    }
    return settings;
  }

  connectMysql() {
    const t = this.getSettings()
    // console.log(t);

    store.set('unicorn', t);
    console.log(store.get('unicorn'));
    console.log('test connect to mysql!!')
  }
}
