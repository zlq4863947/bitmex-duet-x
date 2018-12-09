import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { NotificationContent } from '../types';

@Injectable()
export class NotificationsService {
  constructor(private toasterService: ToasterService) {}

  private showMsg(type: string, content: NotificationContent) {
    this.toasterService.pop(type, content.title, content.body);
  }
  success(content: NotificationContent) {
    this.showMsg('success', content);
  }

  error(content: NotificationContent) {
    this.showMsg('error', content);
  }

  warn(content: NotificationContent) {
    this.showMsg('warning', content);
  }

  info(content: NotificationContent) {
    this.showMsg('info', content);
  }

  primary(content: NotificationContent) {
    this.showMsg('primary', content);
  }
}
