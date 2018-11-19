import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { SettingsComponent } from './settings.component';
import { SettingTradingComponent } from './setting-trading/setting-trading.component';
import { SettingExchangeComponent } from './setting-exchange/setting-exchange.component';

const components = [
  SettingsComponent,
  SettingTradingComponent,
  SettingExchangeComponent
]
@NgModule({
  imports: [
    ThemeModule
  ],
  declarations: [
    ...components
  ],
})
export class SettingsModule { }
