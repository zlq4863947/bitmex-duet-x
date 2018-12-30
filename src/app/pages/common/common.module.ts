import { CommonModule as AngularCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CountdownModule } from 'ngx-countdown';

import { ThemeModule } from '../../@theme/theme.module';
import { CountdownComponent } from './countdown/countdown.component';

@NgModule({
  imports: [AngularCommonModule, ThemeModule, CountdownModule],
  declarations: [CountdownComponent],
  exports: [AngularCommonModule, CountdownComponent],
})
export class CommonModule {}
