import 'reflect-metadata';

import { Injectable } from '@angular/core';

import { ApplicationSettings } from '@duet-core/types';
import { ElectronService, NotificationsService } from '@duet-core/utils';

import { Robot } from './lib/robot';

@Injectable()
export class RobotService {
  private robot: Robot;
  constructor(private electronService: ElectronService, private notificationsService: NotificationsService) {
    this.robot = new Robot();
    /*const injector = Injector.create({providers: [{provide: Robot, deps: []}]});
      this.robot = injector.get(Robot)// .create(config)
      this.robot.create(config);*/
  }

  async start() {
    const config = <ApplicationSettings>(<any>this.electronService.settings.getAll());
    await this.robot.start(config);
  }
}
