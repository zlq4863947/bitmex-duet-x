import { CommonModule as AngularCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CountdownModule } from 'ngx-countdown';

import { ThemeModule } from '../../@theme/theme.module';
import { ClockComponent } from './clock/clock.component';

const components = [ClockComponent];
@NgModule({
  imports: [AngularCommonModule, ThemeModule, CountdownModule],
  declarations: [...components],
  exports: [AngularCommonModule, ...components],
})
export class CommonModule {}
