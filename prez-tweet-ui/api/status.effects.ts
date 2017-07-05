import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UpdateAPIStatusAction,
  SetStatusAction,
} from '../store';

import './constants';

interface UpdateStatusResponseData {
  api: string,
  ui: string,
  uptime_sec: number,
}

@Injectable()
export class StatusAPIEffects {
  private apiHost = PREZ_TWEET_API_HOST;

  constructor(
    private http: Http,
    private actions: Actions,
  ) {}

  @Effect() autoStatusUpdate$ = Observable.timer(0, 5000)
    .map(() => new UpdateAPIStatusAction())

  @Effect() updateStatus$ = this.actions
    .ofType(UpdateAPIStatusAction.type)
    .switchMap(() => this.http.get(`//${this.apiHost}/api/status`)
      .do(r => {
        if (r.status != 200) {
          throw r.text();
        }
      })
      .map(response => ({response: response, error: null}))
      .catch(error => Observable.of({response: <Response>null, error}))
    )
    .share();

    @Effect() updateStatusError$ = this.updateStatus$
      .filter(({error}) => (!!error))
      .map(({error}) => new SetStatusAction({
        ok: false,
        uptimeSec: 0,
        error: ''+error,
      }));

    @Effect() updateStatusSuccess$ = this.updateStatus$
      .filter(({error}) => (!error))
      .map(({response}) => <UpdateStatusResponseData>response.json())
      .map(data => new SetStatusAction({
        ok: true,
        uptimeSec: data.uptime_sec,
        error: null,
      }));

}
