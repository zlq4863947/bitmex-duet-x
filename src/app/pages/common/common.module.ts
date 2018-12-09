import { CommonModule as AngularCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  imports: [AngularCommonModule, ThemeModule],
  declarations: [],
  exports: [AngularCommonModule],
})
export class CommonModule {}
