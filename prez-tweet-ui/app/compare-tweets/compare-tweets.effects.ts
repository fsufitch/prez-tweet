import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Effect, Actions } from '@ngrx/effects';
import { SetObamaTweetIDAction, SetTrumpTweetIDAction } from '../../store';
import { TweetService, CompareTweetsService } from '../shared';

@Injectable()
export class CompareTweetsEffects {
  constructor(
    private router: Router,
    private actions: Actions,
    private tweetService: TweetService,
    private compareTweetsService: CompareTweetsService,
  ) {}


  @Effect() navigateToCurrentShortId$ = this.actions
    .ofType(SetObamaTweetIDAction.type, SetTrumpTweetIDAction.type)
    .switchMap(() => Observable.combineLatest(
      this.tweetService.getObamaTweetID(),
      this.tweetService.getTrumpTweetID(),
    ))
    .filter(ids => ids.every(id => !!id))
    .distinctUntilChanged(([o1, t1], [o2, t2]) => o1 == o2 && t1 == t2)
    .flatMap(([obamaTweetID, trumpTweetID]) => this.compareTweetsService.getShortIDByTweetPair(obamaTweetID, trumpTweetID))
    .filter(shortId => !!shortId)
    .flatMap(shortId => Observable.fromPromise(this.router.navigate(['p', shortId]))
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
