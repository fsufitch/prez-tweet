import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { TweetService } from '../shared';
import {
  TweetPair,
  RootState,
  UpdateLatestTweetIDsAction,

} from '../../store';

@Injectable()
export class TweetPairResolver implements Resolve<TweetPair>{
  constructor(
    private router: Router,
    private store: Store<RootState>,
    private tweetService: TweetService,
  ) {}


  resolve(route: ActivatedRouteSnapshot) {
    let foundShortID = route.paramMap.get('pairShortId');
    if (!!foundShortID) {
      return this.getExistingTweetPair(foundShortID);
    }

    return this.getCurrentOrLatestTweetIDs()
      .flatMap(({obama, trump}) => this.getNewTweetPair(obama, trump));
  }

  private getExistingTweetPair(shortID: string) {
    this.tweetService.populateTweetPairFromShortID(shortID);
    this.tweetService.setCurrentTweetPairID(shortID);
    return this.tweetService.getTweetPair(shortID)
      .first(pair => !!pair);
  }

  private getCurrentOrLatestTweetIDs() {
    let ids$ = Observable.combineLatest(
      this.tweetService.getObamaTweetID(),
      this.tweetService.getTrumpTweetID(),
    ).map(([obama, trump]) => ({obama, trump}));

    ids$.take(1).filter(({obama, trump}) => !obama || !trump)
      .subscribe(() => this.store.dispatch(new UpdateLatestTweetIDsAction()));

    return ids$.first(({obama, trump}) => !!obama && !!trump);
  }

  private getNewTweetPair(obamaTweetID: string, trumpTweetID: string) {
    this.tweetService.populateTweetPairFromTweets(obamaTweetID, trumpTweetID);
    return this.tweetService.getTweetPairFromTweets(obamaTweetID, trumpTweetID).first(pair => !!pair);
  }
}
