import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { NotificationContent } from '../types';

@Injectable()
export class NotificationsService {
  constructor(private toasterService: ToasterService) {}

  private showMsg(type: string, content: NotificationContent) {
    this.toasterService.pop(type, content.title, content.body);
  }
  showSuccess(content: NotificationContent) {
    this.showMsg('success', content);
  }

  showError(content: NotificationContent) {
    this.showMsg('error', content);
  }

  showWarning(content: NotificationContent) {
    this.showMsg('warning', content);
  }

  showInfo(content: NotificationContent) {
    this.showMsg('info', content);
  }

  showPrimary(content: NotificationContent) {
    this.showMsg('primary', content);
  }
}
