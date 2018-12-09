import 'style-loader!angular2-toaster/toaster.css';

/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { ToasterConfig, ToasterService } from 'angular2-toaster';

import { AnalyticsService } from './@core/utils/analytics.service';
import { ElectronService } from './@core/utils/electron.service';

@Component({
  selector: 'ngx-app',
  template: '<toaster-container [toasterconfig]="config"></toaster-container><router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(private toasterService: ToasterService, public electronService: ElectronService, private analytics: AnalyticsService) {
    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-right',
    showCloseButton: true,
    tapToDismiss: true,
    timeout: 5000,
  });

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
