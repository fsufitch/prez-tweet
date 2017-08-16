import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UpdateSynchronizedOffsetAction,
  UpdateTweetPairFromPairAction,
  SetCurrentTweetPairAction,
  createTweetPairLongID,
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

  private updateSynchronizedOffset$ = this.actions
    .ofType(UpdateSynchronizedOffsetAction.type)
    .map(action => (<UpdateSynchronizedOffsetAction>action).payload)
    .map(payload => $.param({
      tweet1_offset_years: payload.offsetYears,
      tweet1: payload.obamaTweetStringID,
      tweet2: payload.trumpTweetStringID,
    }))
    .map(query => `//${this.apiHost}/api/syncApplyOffset?${query}`)
    .switchMap(url => common.scrubHttp(this.http.get(url)))
    .share();

  private synchronizedSuccess$ = this.updateSynchronizedOffset$
    .filter(({error}) => !error)
    .map(({response}) => <SyncTweetsResponseData>response.json())
    .map(data => ({obama: data.obama_tweet_id_str, trump: data.trump_tweet_id_str}));


  @Effect() populateAndSetNextTweetPair$ = this.synchronizedSuccess$
    .flatMap(({obama, trump}) => Observable.from([
      new UpdateTweetPairFromPairAction({obamaTweetID: obama, trumpTweetID: trump}),
      new SetCurrentTweetPairAction({id: createTweetPairLongID(obama, trump)}),
    ]));

  @Effect() synchronizedFailure$ = this.updateSynchronizedOffset$
    .filter(({error}) => !!error)
    .do(({error}) => console.error(error))
    .flatMap(() => Observable.empty());


}
