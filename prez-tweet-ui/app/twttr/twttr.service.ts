import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import * as twttr from './twttr';

type TwttrCallback = (t: Twttr) => void

@Injectable()
export class TwttrService {
  private twttrLoaded$ = new BehaviorSubject(false);
  private callbacks$ = new Subject<TwttrCallback>();

  private callbackLoaded$ = this.callbacks$.asObservable()
    .withLatestFrom(this.twttrLoaded$)
    .map(([cb, loaded]) => ({cb, loaded}));

  private enqueueSub = this.callbackLoaded$.filter(({loaded}) => !loaded)
    .subscribe(({cb}) => twttr.ready(() => cb(twttr)));

  private immediateSub = this.callbackLoaded$.filter(({loaded}) => loaded)
    .subscribe(({cb}) => cb(twttr));

  constructor() {
    twttr.ready(() => this.twttrLoaded$.next(true));
  }

  runWithTwttr(cb: TwttrCallback) {
    this.callbacks$.next(cb);
  }
}
