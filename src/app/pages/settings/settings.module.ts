import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { SettingTradingComponent } from './app/setting-trading/setting-trading.component';
import { SettingsRoutingModule, routedComponents } from './settings-routing.module';
import { SettingExchangeComponent } from './system/setting-exchange/setting-exchange.component';
import { SettingMysqlComponent } from './system/setting-mysql/setting-mysql.component';

@NgModule({
  imports: [ThemeModule, SettingsRoutingModule],
  declarations: [routedComponents, SettingExchangeComponent, SettingMysqlComponent, SettingTradingComponent],
})
export class SettingsModule {}
