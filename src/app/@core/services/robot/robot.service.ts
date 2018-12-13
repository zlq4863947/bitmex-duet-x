import 'reflect-metadata';

import { Injectable } from '@angular/core';

import { ApplicationSettings } from '../../types';
import { ElectronService } from '../../utils/electron.service';

@Injectable()
export class RobotService {
  constructor(private electronService: ElectronService) {}

  start() {
    const res = <ApplicationSettings>(<any>this.electronService.settings.getAll());
    console.log('robot: ', res.actions);
  }
}
