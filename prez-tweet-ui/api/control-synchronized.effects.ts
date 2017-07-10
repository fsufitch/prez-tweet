import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UpdateSynchronizedOlderAction,
  UpdateSynchronizedNewerAction,
} from '../store';

import * as common from  '../common';

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
      offset_years: payload.offsetYears,
      tweet1: payload.currentTweet1StringID,
      tweet2: payload.currentTweet2StringID,
    }))
    .map(query => `//${this.apiHost}/api/syncOlder?${query}`)
    .switchMap(url => common.scrubHttp(this.http.get(url)))
    .share();

  private UpdateSynchronizedNewer$ = this.actions
    .ofType(UpdateSynchronizedNewerAction.type)
    .map(action => (<UpdateSynchronizedNewerAction>action).payload)
    .map(payload => $.param({
      offset_years: payload.offsetYears,
      tweet1: payload.currentTweet1StringID,
      tweet2: payload.currentTweet2StringID,
    }))
    .map(query => `//${this.apiHost}/api/syncNewer?${query}`)
    .switchMap(url => common.scrubHttp(this.http.get(url)))
    .share();

  @Effect() synchronizedSuccess$ = Observable
    .merge(this.UpdateSynchronizedNewer$, this.UpdateSynchronizedOlder$)
    .filter(({error}) => !error)
    .do(({response}) => console.log(response));

  @Effect() synchronizedFailure$ = Observable
    .merge(this.UpdateSynchronizedNewer$, this.UpdateSynchronizedOlder$)
    .filter(({error}) => !!error)
    .do(({error}) => console.error(error));


}
