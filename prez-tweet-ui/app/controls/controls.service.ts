import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { Observable } from 'rxjs'

import { DefaultOffsetKey, DefaultOffsets } from '../../common';
import {
  RootState,
  RootSelectors,
  ControlsSelectors,
  SetSynchronizedOffsetAction,
  UpdateSynchronizedOlderAction,
  UpdateSynchronizedNewerAction,
 } from '../../store';

 import { TweetService } from '../shared';

@Injectable()
export class ControlsService {
  constructor(
    private store: Store<RootState>,
    private tweetService: TweetService
  ) {}


  getControlsMode() {
    return this.store.let(compose(
      ControlsSelectors.selectMode(),
      RootSelectors.selectControlsState()
    ));
  }

  getSynchronizedOffsetKey() {
    return this.store.let(compose(
      ControlsSelectors.selectSynchronizedOffsetKey(),
      RootSelectors.selectControlsState()
    ));
  }

  setSynchronizedOffset(offsetKey: DefaultOffsetKey) {
    this.store.dispatch(new SetSynchronizedOffsetAction({offsetKey}))
  }

  triggerSynchronizedOlder() {
    let trumpTweetID$ = this.tweetService.getTrumpTweetID();
    let obamaTweetID$ = this.tweetService.getObamaTweetID();
    let syncOffsetYears$ = this.getSynchronizedOffsetKey()
      .map(k => DefaultOffsets[k])
      .map(offset => offset.years);

    Observable.combineLatest(trumpTweetID$, obamaTweetID$, syncOffsetYears$)
      .take(1)
      .subscribe(([trumpTweetID, obamaTweetID, syncOffsetYears]) => {
        this.store.dispatch(new UpdateSynchronizedOlderAction({
          offsetYears: syncOffsetYears,
          obamaTweetStringID: trumpTweetID,
          trumpTweetStringID: obamaTweetID,
        }));
      });
  }

  triggerSynchronizedNewer() {
    let trumpTweetID$ = this.tweetService.getTrumpTweetID();
    let obamaTweetID$ = this.tweetService.getObamaTweetID();
    let syncOffsetYears$ = this.getSynchronizedOffsetKey()
      .map(k => DefaultOffsets[k])
      .map(offset => offset.years);

    Observable.combineLatest(trumpTweetID$, obamaTweetID$, syncOffsetYears$)
      .take(1)
      .subscribe(([trumpTweetID, obamaTweetID, syncOffsetYears]) => {
        this.store.dispatch(new UpdateSynchronizedNewerAction({
          offsetYears: syncOffsetYears,
          obamaTweetStringID: trumpTweetID,
          trumpTweetStringID: obamaTweetID,
        }));
      });
  }
}
