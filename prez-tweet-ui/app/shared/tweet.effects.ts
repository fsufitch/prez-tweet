import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SetCurrentTweetPairAction } from '../../store';
import { TweetService } from './tweet.service';

@Injectable()
export class TweetEffects {
  constructor(
    private actions: Actions,
    private tweetService: TweetService,
  ) {}

  @Effect() autoPopulateTweet$ = this.actions
    .ofType(SetCurrentTweetPairAction.type)
    .map(action => (<SetCurrentTweetPairAction>action).payload.id)
    .distinctUntilChanged()
    .switchMap(pairID => this.tweetService.getTweetPair(pairID))
    .filter(pair => !!pair)
    .do(pair => {
      this.tweetService.populateTweet(pair.obamaTweetID, false);
      this.tweetService.populateTweet(pair.trumpTweetID, false);
    })
    .flatMap(() => Observable.empty())
}
