import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Effect, Actions } from '@ngrx/effects';
import { SetCurrentTweetPairAction } from '../../store';
import { TweetService } from '../shared';

@Injectable()
export class CompareTweetsEffects {
  constructor(
    private router: Router,
    private actions: Actions,
    private tweetService: TweetService,
  ) {}


  @Effect() navigateToCurrentShortId$ = this.actions
    .ofType(SetCurrentTweetPairAction.type)
    .map(action => (<SetCurrentTweetPairAction>action).payload.id)
    .flatMap(pairId => this.tweetService.getTweetPair(pairId))
    .filter(pair => !!pair)
    .distinctUntilChanged((x, y) => x.id == y.id)
    .flatMap(pair => Observable.fromPromise(this.router.navigate(['p', pair.shortID]))
      .do(success => {
        if (!success) {
          console.warn('Navigation canceled');
        }
      })
      .map(() => '')
      .catch(err => Observable.of(`Error navigating: ${err}`))
    )
    .do(err => !!err ? console.error(err) : void(0))
    .map(() => Observable.of());
}
