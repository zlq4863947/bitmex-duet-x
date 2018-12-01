import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { ActionsComponent } from './actions/actions.component'
import { OrderTableComponent } from './orders/order-table.component'

const components = [
  DashboardComponent,
  ActionsComponent,
  OrderTableComponent,
]
@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule
  ],
  declarations: [
    ...components
  ],
})
export class DashboardModule { }
