import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UpdateLatestTweetIDsAction,
  SetObamaTweetIDAction,
  SetTrumpTweetIDAction,
  UpdateTweetPairFromPairAction,
  UpdateTweetPairFromShortIDAction,
  SetTweetPairAction,
} from '../store';

import '../common';

interface UpdateLatestTweetsResponseData {
  obama_tweet_id_str: string,
  trump_tweet_id_str: string,
}

@Injectable()
export class TweetAPIEffects {
  private apiHost = PREZ_TWEET_API_HOST;

  constructor(
    private http: Http,
    private actions: Actions,
  ) {}

  private updateLatestTweets$ = this.actions
    .ofType(UpdateLatestTweetIDsAction.type)
    .switchMap(() => this.http.get(`//${this.apiHost}/api/latest`)
      .do(r => {
        if (r.status != 200) {
          throw r.text();
        }
      })
      .map(response => ({response: response, error: null}))
      .catch(error => Observable.of({response: <Response>null, error}))
    )
    .share();

  @Effect() updateLatestTweetsError$ = this.updateLatestTweets$
    .filter(({error}) => (!!error))
    .do(({error}) => {
      console.error('Error updating latest tweets', error);
    })
    .flatMap(() => Observable.of());

  @Effect() updateLatestTweetsSuccess$ = this.updateLatestTweets$
    .filter(({error}) => (!error))
    .map(({response}) => <UpdateLatestTweetsResponseData>response.json())
    .flatMap(data => Observable.of(
      new SetObamaTweetIDAction({tweetID: data.obama_tweet_id_str}),
      new SetTrumpTweetIDAction({tweetID: data.trump_tweet_id_str})
    ));
}
