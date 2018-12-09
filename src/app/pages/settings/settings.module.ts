import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '../common/common.module';
import { SettingExchangeComponent } from './setting-exchange/setting-exchange.component';
import { SettingMysqlComponent } from './setting-mysql/setting-mysql.component';
import { SettingTradingComponent } from './setting-trading/setting-trading.component';
import { SettingsComponent } from './settings.component';

const components = [SettingsComponent, SettingTradingComponent, SettingExchangeComponent, SettingMysqlComponent];
@NgModule({
  imports: [ThemeModule, CommonModule],
  declarations: [...components],
})
export class SettingsModule {}
