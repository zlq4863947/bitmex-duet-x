import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Helper } from '@duet-robot/common';

@Component({
  selector: 'ngx-clock',
  // styleUrls: ['./clock.component.scss'],
  styles: [`
    .clock {
      font-size: 1.75rem;
      font-weight: 500;
      font-family: Exo;
      color: aliceblue;
      margin: 1.7rem 0 0 1.25rem;
    }
  `],
  template: '<div class="clock"> {{ time }}</div>',
})
export class ClockComponent implements OnDestroy {

  private timer: Observable<number> = Observable.create((observer) => {
    let i = 0;
    let timer = setInterval(() => observer.next(i++), 1000);
    return () => clearInterval(timer);
  });
  private sub: Subscription;

  time: string;

  constructor() {
    this.show();
    this.sub = this.timer.subscribe((i) => {
      this.show();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  show() {
    this.time = Helper.formatTimeStartHour(Date.now());
  }
}
