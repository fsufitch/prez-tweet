import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { Observable } from 'rxjs'
import * as Moment from 'moment';

import { DefaultOffsetKey, DefaultOffsets } from '../../common';
import {
  Tweet,
  RootState,
  RootSelectors,
  ControlsSelectors,
  SetSynchronizedOffsetAction,
  UpdateSynchronizedOffsetAction,
  TriggerSynchronizedOlderAction,
  TriggerSynchronizedNewerAction,
 } from '../../store';

 import { TweetService } from '../shared';

@Injectable()
export class ControlsService {
  constructor(
    private store: Store<RootState>,
    private tweetService: TweetService,
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
    this.store.dispatch(new SetSynchronizedOffsetAction({offsetKey}));

    let offsetYears = DefaultOffsets[offsetKey].years;
    let trumpTweetID$ = this.tweetService.getTrumpTweetID();
    let obamaTweetID$ = this.tweetService.getObamaTweetID();
    let syncOffsetYears$ = this.getSynchronizedOffsetKey()
      .map(k => DefaultOffsets[k])
      .map(offset => offset.years);

    Observable.combineLatest(trumpTweetID$, obamaTweetID$, syncOffsetYears$)
      .take(1)
      .subscribe(([trumpTweetID, obamaTweetID, syncOffsetYears]) => {
        this.store.dispatch(new UpdateSynchronizedOffsetAction({
          offsetYears: syncOffsetYears,
          obamaTweetStringID: obamaTweetID,
          trumpTweetStringID: trumpTweetID,
        }));
      });
  }

  canSyncOlder() {
    return Observable.combineLatest(
      this.tweetService.getTrumpTweet().filter(tw => !!tw),
      this.tweetService.getObamaTweet().filter(tw => !!tw),
    )
    .map(([trumpTweet, obamaTweet]) => !!trumpTweet.previousIDStr || !!obamaTweet.previousIDStr);
  }

  canSyncNewer() {
    return Observable.combineLatest(
      this.tweetService.getTrumpTweet().filter(tw => !!tw),
      this.tweetService.getObamaTweet().filter(tw => !!tw),
    )
    .map(([trumpTweet, obamaTweet]) => !!trumpTweet.nextIDStr || !!obamaTweet.nextIDStr);
  }

  triggerSynchronizedOlder() {
    this.getSyncTriggerArguments().subscribe(args =>
      this.store.dispatch(new TriggerSynchronizedOlderAction(args))
    );
  }

  triggerSynchronizedNewer() {
    this.getSyncTriggerArguments().subscribe(args =>
      this.store.dispatch(new TriggerSynchronizedNewerAction(args))
    );
  }

  private getSyncTriggerArguments() {
    let trumpTweet$ = this.tweetService.getTrumpTweet().first(tw => !!tw);
    let obamaTweet$ = this.tweetService.getObamaTweet().first(tw => !!tw);
    let syncOffset$ = this.getSynchronizedOffsetKey().take(1)
      .map(k => DefaultOffsets[k])
      .map(offset => offset.years);

    return Observable.zip(obamaTweet$, trumpTweet$, syncOffset$)
      .map(([obamaTweet, trumpTweet, offsetYears]) => ({obamaTweet, trumpTweet, offsetYears}))
  }

  navigateToTweet(tweetURL: string) {
    let matches = tweetURL.match(/https?:\/\/twitter.com\/.*\/status\/(\d+)/);
    if (!matches || matches.length < 2 || !matches[1]) {
      alert('Invalid tweet URL: ' + tweetURL);
      return;
    }
    let tweetID = matches[1];

    let tweetPair$ = this.tweetService.getCurrentTweetPairID()
      .flatMap(id => this.tweetService.getTweetPair(id))
      .filter(pair => !!pair);

    this.tweetService.populateTweet(tweetID, false);
    this.tweetService.getTweet(tweetID)
      .first(tw => !!tw)
      .withLatestFrom(tweetPair$)
      .map(([tw, pair]) => {
        switch (tw.author) {
          case 'obama': return {obama: tw.idStr, trump: pair.trumpTweetID};
          case 'trump': return {obama: pair.obamaTweetID, trump: tw.idStr};
          default: throw 'Unknown tweet author ' + tw.author;
        }
      })
      .flatMap(({obama, trump}) => this.tweetService.getTweetPairFromTweets(obama, trump)
        .map(pair => ({obama, trump, pair}))
      )
      .do(({obama, trump, pair}) => {
        if (!pair) this.tweetService.populateTweetPairFromTweets(obama, trump);
      })
      .first(({pair}) => !!pair)
      .subscribe(({pair}) => this.tweetService.setCurrentTweetPairID(pair.shortID));
  }
}
