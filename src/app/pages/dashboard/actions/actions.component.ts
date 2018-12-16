import { Component, OnInit } from '@angular/core';

import { SymbolsService } from '../../../@core/data/symbols.service';
import { RobotService } from '../../../@core/services/robot/robot.service';
import { ActionsSettings, ResolutionOption } from '../../../@core/types';
import { ElectronService } from '../../../@core/utils/electron.service';
import { NotificationsService } from '../../../@core/utils/notifications.service';

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
  resolutions: ResolutionOption[];
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
        resolution: {
          resolution: '1',
          name: '1分钟',
        },
      };
      // 配置初期化
      this.electronService.settings.set(this.storeKey, settings);
    }
    this.actions = <any>settings;
  }

  save() {
    this.electronService.settings.set(this.storeKey, <any>this.actions);
  }

  async launch() {
    if (!this.isStarted) {
      await this.start();
    } else {
      this.stop();
    }
  }

  async start() {
    this.save();
    this.isStarted = true;
    this.statusName = '启动中';
    await this.robotService.start();
    this.notificationsService.success({
      title: '启动机器人',
    });
  }

  stop() {
    this.isStarted = false;
    this.statusName = '启动';
    this.robotService.stop();
    this.notificationsService.error({
      title: '机器人已停止',
    });
  }
}
