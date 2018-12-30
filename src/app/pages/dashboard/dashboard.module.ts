import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '../common/common.module';
import { ActionsComponent } from './actions/actions.component';
import { DashboardComponent } from './dashboard.component';
import { OrderTableComponent } from './order/order-table.component';

const components = [DashboardComponent, ActionsComponent, OrderTableComponent];
@NgModule({
  imports: [ThemeModule, Ng2SmartTableModule, CommonModule],
  declarations: [...components],
})
export class DashboardModule {}
