import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UpdateTweetPairFromPairAction,
  UpdateTweetPairFromShortIDAction,
  SetTweetPairAction,
} from '../store';

import { scrubHttp } from '../common';

interface PairAPIResponse {
  short_id: string;
  obama_tweet_id_str: string;
  trump_tweet_id_str: string;
}

@Injectable()
export class TweetPairAPIEffects {
  private apiHost = PREZ_TWEET_API_HOST;

  constructor(
    private http: Http,
    private actions: Actions,
  ) {}


  private updateTweetPairFromPair$ = this.actions
    .ofType(UpdateTweetPairFromPairAction.type)
    .map(action => (<UpdateTweetPairFromPairAction>action).payload)
    .switchMap(({obamaTweetID, trumpTweetID}) => scrubHttp(this.http.post(
        `//${this.apiHost}/api/pair`,
        {tweet1_id_str: obamaTweetID, tweet2_id_str: trumpTweetID},
    )))
    .share();

  private updateTweetPairFromShortID$ = this.actions
    .ofType(UpdateTweetPairFromShortIDAction.type)
    .map(action => (<UpdateTweetPairFromShortIDAction>action).payload)
    .switchMap(({shortTweetID}) => scrubHttp(this.http.get(`//${this.apiHost}/api/pair/${shortTweetID}`)))
    .share();

  private updateTweetPairResponseError$ = Observable.merge(
    this.updateTweetPairFromPair$,
    this.updateTweetPairFromShortID$,
  )

  @Effect() updateTweetPairSuccess$ = this.updateTweetPairResponseError$
    .filter(({error}) => (!error))
    .map(({response}) => <PairAPIResponse>response.json())
    .map(data => ({
      obamaTweetID: data.obama_tweet_id_str,
      trumpTweetID: data.trump_tweet_id_str,
      shortTweetID: data.short_id,
    }))
    .map(({obamaTweetID, trumpTweetID, shortTweetID}) =>
      new SetTweetPairAction({obamaTweetID, trumpTweetID, shortTweetID})
    );

  @Effect() updateTweetPairError$ = this.updateTweetPairResponseError$
    .filter(({error}) => (!!error))
    .do(({error}) => {
      console.error('Error updating tweet pair', error);
    })
    .flatMap(() => Observable.of());


}
