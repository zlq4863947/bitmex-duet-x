import { Component, ElementRef } from '@angular/core';

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
  mysql: MysqlSettings = {
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'root',
    db: 'test'
  };

  constructor(public element: ElementRef) {
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
    //const t = this.getSettings()
    console.log(this.mysql);

    console.log('test connect to mysql!!')
  }
}
