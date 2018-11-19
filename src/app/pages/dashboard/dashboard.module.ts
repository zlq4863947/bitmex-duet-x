import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { ActionsComponent } from './actions/actions.component'

const components = [
  DashboardComponent,
  ActionsComponent,
]
@NgModule({
  imports: [
    ThemeModule
  ],
  declarations: [
    ...components
  ],
})
export class DashboardModule { }
