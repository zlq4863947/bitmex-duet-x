import 'reflect-metadata';

import { Injectable } from '@angular/core';

import { NotificationsService, SettingsService } from '@duet-core/utils';
import { Robot } from '@duet-robot/robot';

import { MysqlService } from '../mysql/mysql.service';

@Injectable({
  providedIn: 'root',
})
export class RobotService {
  constructor(
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
    private mysqlService: MysqlService,
    private robot: Robot,
  ) {}

  async start(): Promise<boolean> {
    const config = this.settingsService.getApplicationSettings();
    const res = await this.mysqlService.init(config.mysql);
    if (res && res.errorMsg) {
      this.notificationsService.error({
        title: '数据库连接出错',
        body: res.errorMsg,
      });
      return false;
    }
    await this.robot.start();
    return true;
  }

  stop() {
    return this.robot.stop();
  }
}
