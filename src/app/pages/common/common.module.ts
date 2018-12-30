import { CommonModule as AngularCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { CountdownComponent } from './countdown/countdown.component';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  imports: [AngularCommonModule, ThemeModule, CountdownModule],
  declarations: [CountdownComponent],
  exports: [AngularCommonModule, CountdownComponent],
})
export class CommonModule {}
