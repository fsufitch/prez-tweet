import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as Moment from 'moment';

import {
  Tweet,
  UpdateLatestTweetIDsAction,
  UpdateTweetPairFromPairAction,
  UpdateTweetPairFromShortIDAction,
  SetTweetPairAction,
  PopulateTweetAction,
  SetTweetAction,
  SetCurrentTweetPairAction,
  createTweetPairLongID,
} from '../store';

import { scrubHttp } from '../common';

interface UpdateLatestTweetsResponseData {
  obama_tweet_id_str: string;
  trump_tweet_id_str: string;
}

interface PopulateTweetResponseData {
  tweet_id_str: string;
  prev_id_str: string;
  next_id_str: string;
  screen_name: string;
  is_trump: boolean;
  is_obama: boolean;
  timestamp: number;
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
    .switchMap(() => scrubHttp(this.http.get(`//${this.apiHost}/api/latest`)))
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
    .map(data => ({obama: data.obama_tweet_id_str, trump: data.trump_tweet_id_str}))
    .flatMap(({obama, trump}) => Observable.from([
      new UpdateTweetPairFromPairAction({obamaTweetID: obama, trumpTweetID: trump}),
      new SetCurrentTweetPairAction({id: createTweetPairLongID(obama, trump)}),
    ]));

  private populateTweet$ = this.actions
    .ofType(PopulateTweetAction.type)
    .map(action => (<PopulateTweetAction>action).payload.idStr)
    .flatMap(id => scrubHttp(this.http.get(`//${this.apiHost}/api/tweet/${id}`)))
    .share();

  @Effect() populateTweetSuccess$ = this.populateTweet$
    .filter(({error}) => !error)
    .map(({response}) => <PopulateTweetResponseData>response.json())
    .map(data => ({
      idStr: data.tweet_id_str,
      nextIDStr: data.next_id_str,
      previousIDStr: data.prev_id_str,
      screenName: data.screen_name,
      author: data.is_obama ? 'obama' : data.is_trump ? 'trump' : 'unknown',
      timestamp: Moment(data.timestamp * 1000),
    }))
    .map((tweet: Tweet) => new SetTweetAction({tweet}));
}
