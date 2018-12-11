import { Component, OnInit } from '@angular/core';

import { SymbolsService } from '../../../@core/data/symbols.service';
import { ActionsSettings } from '../../../@core/types';
import { ElectronService } from '../../../@core/utils/electron.service';
import { NotificationsService } from '../../../@core/utils/notifications.service';
import { RobotService } from '../../../@core/services/robot/robot.service';

@Component({
  selector: 'ngx-dashboard-actions',
  styleUrls: ['./actions.component.scss'],
  templateUrl: './actions.component.html',
})
export class ActionsComponent implements OnInit {
  constructor(
    private electronService: ElectronService,
    private notificationsService: NotificationsService,
    private symbolsService: SymbolsService,
    private robotService: RobotService,
  ) {}

  actions: ActionsSettings;
  storeKey = 'actions';
  symbols: string[];
  resolutions: string[];
  statusName = '启动';
  isStarted = false;

  ngOnInit() {
    this.initSetting();
    this.symbols = this.symbolsService.getSymbols();
    this.resolutions = this.symbolsService.getResolutions();
  }

  initSetting() {
    let settings = this.electronService.settings.get(this.storeKey);
    // 没有值的时候
    if (!settings) {
      settings = {
        symbol: 'XBTUSD',
        resolution: '1分钟',
      };
      // 配置初期化
      this.electronService.settings.set(this.storeKey, settings);
    }
    this.actions = <any>settings;
  }

  save() {
    this.electronService.settings.set(this.storeKey, { ...this.actions });
  }

  launch() {
    this.robotService.start()
    if (!this.isStarted) {
      this.start();
    } else {
      this.stop();
    }
  }
  
  start() {
    this.save();
    this.isStarted = true;
    this.statusName = '启动中';
  }

  stop() {
    this.isStarted = false;
    this.statusName = '启动';
  }
}
