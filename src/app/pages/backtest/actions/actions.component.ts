import { Component, OnInit } from '@angular/core';

import { SymbolsService } from '../../../@core/data/symbols.service';
import { RobotService } from '../../../@core/services/robot/robot.service';
import { ActionsSettings, ResolutionOption } from '../../../@core/types';
import { NotificationsService } from '../../../@core/utils/notifications.service';
import { SettingsService } from '../../../@core/utils/settings.service';

@Component({
  selector: 'ngx-backtest-actions',
  styleUrls: ['./actions.component.scss'],
  templateUrl: './actions.component.html',
})
export class ActionsComponent implements OnInit {
  actions: ActionsSettings;
  symbols: string[];
  resolutions: ResolutionOption[];
  statusName = '启动';
  isStarted: boolean;

  constructor(
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
    private symbolsService: SymbolsService,
    private robotService: RobotService,
  ) {}

  ngOnInit() {
    this.isStarted = this.settingsService.getProcess().isActived;
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
    const result = await this.robotService.start();
    if (result) {
      this.save();
      this.isStarted = true;
      const process = this.settingsService.getProcess();
      process.isActived = true;
      this.settingsService.setProcess(process);
      this.statusName = '启动中';
      this.notificationsService.success({
        title: '启动机器人',
      });
    }
  }

  stop() {
    this.robotService.stop();
    this.isStarted = false;
    const process = this.settingsService.getProcess();
    process.isActived = false;
    this.settingsService.setProcess(process);
    this.statusName = '启动';
    this.notificationsService.error({
      title: '机器人已停止',
    });
  }
}
