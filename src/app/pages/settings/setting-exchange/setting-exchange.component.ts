import { Component, OnInit } from '@angular/core';

import { ExchangeSettings } from '../../../@core/types';
import { SettingsService } from '../../../@core/utils/settings.service';
import { NotificationsService } from '../../../@core/utils/notifications.service';

@Component({
  selector: 'ngx-setting-exchange',
  styleUrls: ['./setting-exchange.component.scss'],
  templateUrl: './setting-exchange.component.html',
})
export class SettingExchangeComponent implements OnInit {
  exchange: ExchangeSettings;

  constructor(public settingsService: SettingsService, public notificationsService: NotificationsService) {}

  ngOnInit() {
    this.exchange = this.settingsService.getExchange();
  }

  save() {
    this.settingsService.setExchange(this.exchange);
  }
}
