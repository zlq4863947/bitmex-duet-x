import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { ActionLogTableComponent } from './action-log/action-log-table.component';
import { LogComponent } from './log.component';

const components = [LogComponent, ActionLogTableComponent];
@NgModule({
  imports: [ThemeModule, Ng2SmartTableModule],
  declarations: [...components],
})
export class LogModule {}
