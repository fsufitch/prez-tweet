import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { CompareTweetsService, TweetService } from '../shared';
import {
  RootState,
  UpdateLatestTweetIDsAction,
  TweetPairShortID,
  SetObamaTweetIDAction,
  SetTrumpTweetIDAction,
} from '../../store';

@Injectable()
export class TweetPairShortIDResolver implements Resolve<TweetPairShortID>{
  constructor(
    private router: Router,
    private store: Store<RootState>,
    private compareTweetsService: CompareTweetsService,
    private tweetService: TweetService,
  ) {}


  resolve(route: ActivatedRouteSnapshot) {
    let foundShortID = route.paramMap.get('pairShortId');
    if (!!foundShortID) {
      this.triggerUpdateTweetIDsForShortID(foundShortID);
      return Observable.of(foundShortID);
    }


    let obamaTweetID$ = this.tweetService.getObamaTweetID();
    let trumpTweetID$ = this.tweetService.getTrumpTweetID();
    let mergedTweetIDs$ = Observable.zip(obamaTweetID$, trumpTweetID$);

    mergedTweetIDs$.take(1).subscribe(([obamaTweetID, trumpTweetID]) => {
      if (!obamaTweetID || !trumpTweetID) {
        this.store.dispatch(new UpdateLatestTweetIDsAction())
      }
    });


    return mergedTweetIDs$.first(ids => ids.every(id => !!id))
        .flatMap(([obamaTweetID, trumpTweetID]) =>
          this.compareTweetsService.getShortIDByTweetPair(obamaTweetID, trumpTweetID)
        )
        .first(id => !!id)
        .do(id => this.router.navigate(['p', id]));
  }

  private triggerUpdateTweetIDsForShortID(shortID: TweetPairShortID) {
    this.compareTweetsService.getTweetPairByShortId(shortID)
      .filter(pair => !!pair)
      .first(({obamaTweetID, trumpTweetID}) => !!obamaTweetID && !!trumpTweetID)
      .subscribe(({obamaTweetID, trumpTweetID}) => {
        this.store.dispatch(new SetObamaTweetIDAction({tweetID: obamaTweetID}));
        this.store.dispatch(new SetTrumpTweetIDAction({tweetID: trumpTweetID}));
      });
  }
}
