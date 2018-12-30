import { Component, OnInit } from '@angular/core';
import { CountdownComponent as BaseCountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'ngx-countdown',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `
      :host {
        font-size: 1.75rem;
        font-weight: 500;
        font-family: Exo;
        color: aliceblue;
        margin: 1.7rem 0 0 1.25rem;
      }
    `,
  ],
})
export class CountdownComponent extends BaseCountdownComponent {

  private isBegin = false

  /** 重新开始 */
  restart(): void {
    if (!this.isBegin) {
      this.begin();
      this.isBegin = true;
      return;
    }
    super.restart();
  }
}
