import { Component, OnInit } from '@angular/core';

import { SymbolsService } from '../../../@core/data/symbols.service';
import { RobotService } from '../../../@core/services/robot/robot.service';
import { ActionsSettings, ResolutionOption } from '../../../@core/types';
import { NotificationsService } from '../../../@core/utils/notifications.service';
import { SettingsService } from '../../../@core/utils/settings.service';

@Component({
  selector: 'ngx-dashboard-actions',
  styleUrls: ['./actions.component.scss'],
  templateUrl: './actions.component.html',
})
export class ActionsComponent implements OnInit {
  actions: ActionsSettings;
  symbols: string[];
  resolutions: ResolutionOption[];
  statusName = '启动';
  isStarted = false;

  constructor(
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
    private symbolsService: SymbolsService,
    private robotService: RobotService,
  ) {}

  ngOnInit() {
    this.actions = this.settingsService.getActions();
    this.symbols = this.symbolsService.getSymbols();
    this.resolutions = this.symbolsService.getResolutions();
  }

  save() {
    this.settingsService.setActions(this.actions);
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
