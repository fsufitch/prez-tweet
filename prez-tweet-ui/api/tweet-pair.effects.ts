import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UpdateTweetPairFromPairAction,
  UpdateTweetPairFromShortIDAction,
  SetTweetPairAction,
  TweetPairShortID,
  TweetID,
} from '../store';

import '../common';

interface PairAPIResponse {
  short_id: TweetPairShortID;
  obama_tweet_id_str: TweetID;
  trump_tweet_id_str: TweetID;
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
    .switchMap(({obamaTweetID, trumpTweetID}) => this.http.post(
      `//${this.apiHost}/api/pair`,
      {tweet1_id_str: obamaTweetID, tweet2_id_str: trumpTweetID})
      .do(r => {
        if (r.status != 200) {
          throw r.text();
        }
      })
      .map(response => ({response, error: null}))
      .catch(error => Observable.of({response: <Response>null, error}))
    )
    .share();

  private updateTweetPairFromShortID$ = this.actions
    .ofType(UpdateTweetPairFromShortIDAction.type)
    .map(action => (<UpdateTweetPairFromShortIDAction>action).payload)
    .switchMap(({shortTweetID}) => this.http.get(`//${this.apiHost}/api/pair/${shortTweetID}`)
      .do(r => {
        if (r.status != 200) {
          throw r.text();
        }
      })
      .map(response => ({response, error: null}))
      .catch(error => Observable.of({response: <Response>null, error}))
    )
    .share();

  private updateTweetPairResponseError$ = Observable.merge(
    this.updateTweetPairFromPair$,
    this.updateTweetPairFromShortID$,
  )

  @Effect() updateTweetPairSuccess$ = this.updateTweetPairResponseError$
    .filter(({error}) => (!error))
    .map(({response}) => <PairAPIResponse>response.json())
    .map(data => ({
      obamaTweetID: <TweetID>data.obama_tweet_id_str,
      trumpTweetID: <TweetID>data.trump_tweet_id_str,
      shortTweetID: <TweetPairShortID>data.short_id,
    }))
    .map(({obamaTweetID, trumpTweetID, shortTweetID}) =>
      new SetTweetPairAction({obamaTweetID, trumpTweetID, shortTweetID})
    );

  @Effect() updateTweetPairError$ = this.updateTweetPairResponseError$
    .filter(({error}) => (!!error))
    .do(({error}) => {
      console.error('Error updating latest tweets', error);
    })
    .flatMap(() => Observable.of());


}
