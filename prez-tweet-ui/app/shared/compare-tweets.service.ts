import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

import {
  RootState,
  RootSelectors,
  TweetID,
  TweetSelectors,
  TweetPairShortID,
  UpdateTweetPairFromShortIDAction,
  UpdateTweetPairFromPairAction,
 } from '../../store';

@Injectable()
export class CompareTweetsService {
  constructor(private store: Store<RootState>) {}

  getTweetPairByShortId(shortId: TweetPairShortID, autoSeed=true) {
    let result$ = this.store.let(compose(
      TweetSelectors.selectTweetPairFromShortID(shortId),
      RootSelectors.selectTweetState(),
    ));

    if (autoSeed) {
      result$.take(1).filter(r => !r).subscribe(() => {
        this.store.dispatch(new UpdateTweetPairFromShortIDAction({shortTweetID: shortId}));
      })
    }
    return result$;
  }

  getShortIDByTweetPair(obamaTweetID: TweetID, trumpTweetID: TweetID, autoSeed=true) {
    let result$ = this.store.let(compose(
      TweetSelectors.selectShortIDFromTweetPair(obamaTweetID, trumpTweetID),
      RootSelectors.selectTweetState(),
    ));

    if (autoSeed) {
      result$.take(1).filter(r => !r).subscribe(() => {
        this.store.dispatch(new UpdateTweetPairFromPairAction({obamaTweetID, trumpTweetID}));
      })
    }
    return result$;

  }
}
