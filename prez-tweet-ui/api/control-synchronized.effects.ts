import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UpdateSynchronizedOlderAction,
  UpdateSynchronizedNewerAction,
  UpdateSynchronizedOffsetAction,
  SetObamaTweetIDAction,
  SetTrumpTweetIDAction,
} from '../store';

import * as common from  '../common';


interface SyncTweetsResponseData {
  obama_tweet_id_str: string,
  trump_tweet_id_str: string,
}

@Injectable()
export class ControlSynchronizedEffects {
  private apiHost = PREZ_TWEET_API_HOST;
  constructor(
    private http: Http,
    private actions: Actions,
  ) {}

  private UpdateSynchronizedOlder$ = this.actions
    .ofType(UpdateSynchronizedOlderAction.type)
    .map(action => (<UpdateSynchronizedOlderAction>action).payload)
    .map(payload => $.param({
      tweet1_offset_years: payload.offsetYears,
      tweet1: payload.obamaTweetStringID,
      tweet2: payload.trumpTweetStringID,
    }))
    .map(query => `//${this.apiHost}/api/syncOlder?${query}`)
    .switchMap(url => common.scrubHttp(this.http.get(url)))
    .share();

  private UpdateSynchronizedNewer$ = this.actions
    .ofType(UpdateSynchronizedNewerAction.type)
    .map(action => (<UpdateSynchronizedNewerAction>action).payload)
    .map(payload => $.param({
      tweet1_offset_years: payload.offsetYears,
      tweet1: payload.obamaTweetStringID,
      tweet2: payload.trumpTweetStringID,
    }))
    .map(query => `//${this.apiHost}/api/syncNewer?${query}`)
    .switchMap(url => common.scrubHttp(this.http.get(url)))
    .share();

  private UpdateSynchronizedOffset$ = this.actions
    .ofType(UpdateSynchronizedOffsetAction.type)
    .map(action => (<UpdateSynchronizedNewerAction>action).payload)
    .map(payload => $.param({
      tweet1_offset_years: payload.offsetYears,
      tweet1: payload.obamaTweetStringID,
      tweet2: payload.trumpTweetStringID,
    }))
    .map(query => `//${this.apiHost}/api/syncApplyOffset?${query}`)
    .switchMap(url => common.scrubHttp(this.http.get(url)))
    .share();

  @Effect() synchronizedSuccess$ = Observable
    .merge(...[
      this.UpdateSynchronizedNewer$,
      this.UpdateSynchronizedOlder$,
      this.UpdateSynchronizedOffset$,
    ])
    .filter(({error}) => !error)
    .map(({response}) => <SyncTweetsResponseData>response.json())
    .flatMap(data => Observable.of(
      new SetObamaTweetIDAction({tweetID: data.obama_tweet_id_str}),
      new SetTrumpTweetIDAction({tweetID: data.trump_tweet_id_str})
    ));

  @Effect() synchronizedFailure$ = Observable
    .merge(this.UpdateSynchronizedNewer$, this.UpdateSynchronizedOlder$)
    .filter(({error}) => !!error)
    .do(({error}) => console.error(error));


}
