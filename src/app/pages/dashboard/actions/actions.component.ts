import { Component, OnInit } from '@angular/core';

import { SymbolsService } from '../../../@core/data/symbols.service';
import { ActionsSettings } from '../../../@core/types';
import { ElectronService } from '../../../@core/utils/electron.service';
import { NotificationsService } from '../../../@core/utils/notifications.service';

@Component({
  selector: 'ngx-dashboard-actions',
  styleUrls: ['./actions.component.scss'],
  templateUrl: './actions.component.html',
})
export class ActionsComponent implements OnInit {
  constructor(
    public electronService: ElectronService,
    public notificationsService: NotificationsService,
    private symbolsService: SymbolsService,
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

  start() {
    this.save();
    if (!this.isStarted) {
      this.isStarted = true;
      this.statusName = '启动中';
    } else {
      this.isStarted = false;
      this.statusName = '启动';
    }
  }

  stop() {
    if (this.isStarted) {
      this.isStarted = false;
      this.statusName = '启动';
    }
  }
}
