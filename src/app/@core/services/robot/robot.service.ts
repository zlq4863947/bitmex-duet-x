import 'reflect-metadata';

import { Injectable } from '@angular/core';

import { ApplicationSettings } from '@duet-core/types';
import { ElectronService, NotificationsService } from '@duet-core/utils';
import { Robot } from '@duet-robot/robot';

import { MysqlService } from '../mysql/mysql.service';

@Injectable({
  providedIn: 'root',
})
export class RobotService {
  constructor(
    private electronService: ElectronService,
    private notificationsService: NotificationsService,
    private mysqlService: MysqlService,
    private robot: Robot,
  ) {}

  async start() {
    const config = <ApplicationSettings>(<any>this.electronService.settings.getAll());
    const res = await this.mysqlService.init(config.mysql);
    if (res && res.errorMsg) {
      this.notificationsService.error({
        title: '数据库连接出错',
        body: res.errorMsg,
      });
      return;
    }
    await this.robot.start(config);
  }

  stop() {
    this.robot.stop();
  }
}
