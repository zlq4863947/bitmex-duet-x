import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { BacktestModule } from './backtest/backtest.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LogModule } from './log/log.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SettingsModule } from './settings/settings.module';

const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
  imports: [PagesRoutingModule, ThemeModule, DashboardModule, LogModule, BacktestModule, SettingsModule, MiscellaneousModule],
  declarations: [...PAGES_COMPONENTS],
})
export class PagesModule {}
