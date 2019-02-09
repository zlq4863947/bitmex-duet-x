import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";

export interface BacktestInput {
  pair: string;
  resolution: string;
}

@Injectable({ providedIn: 'root' })
export class BacktestService {
  private status$ = new Subject<BacktestInput>();

  get launchBacktest$(): Observable<BacktestInput> {

    return this.status$.asObservable();
  }

  launch(input: BacktestInput) {
    this.status$.next(input);
  }
}