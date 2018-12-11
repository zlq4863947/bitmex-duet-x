import 'reflect-metadata';

import { Injectable } from '@angular/core';

import { ElectronService } from '../../utils/electron.service';

import { ApplicationSettings } from '../../types';

@Injectable()
export class RobotService {

  constructor(private electronService: ElectronService) {}

  start() {
    const res = <ApplicationSettings>(<any>this.electronService.settings.getAll());
    console.log('robot: ', res.actions);
  }
}
