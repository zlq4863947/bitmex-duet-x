import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { ActionsComponent } from './actions/actions.component';
import { DashboardComponent } from './dashboard.component';
import { OrderTableComponent } from './order/order-table.component';
import { LogTableComponent } from './log/log-table.component';

const components = [DashboardComponent, ActionsComponent, OrderTableComponent, LogTableComponent];
@NgModule({
  imports: [ThemeModule, Ng2SmartTableModule],
  declarations: [...components],
})
export class DashboardModule {}
