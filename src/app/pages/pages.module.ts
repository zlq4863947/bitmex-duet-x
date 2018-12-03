import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SettingsModule } from './settings/settings.module';
import { TestComponent } from './test/test.component';

const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
  imports: [PagesRoutingModule, ThemeModule, DashboardModule, SettingsModule, MiscellaneousModule],
  declarations: [...PAGES_COMPONENTS, TestComponent],
})
export class PagesModule {}
