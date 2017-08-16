import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  UpdateAPIStatusAction,
  SetStatusAction,
} from '../store';

import {scrubHttp} from '../common';

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

  @Effect() autoStatusUpdate$ = Observable.timer(0)
    .map(() => new UpdateAPIStatusAction())

  private updateStatus$ = this.actions
    .ofType(UpdateAPIStatusAction.type)
    .switchMap(() => scrubHttp(this.http.get(`//${this.apiHost}/api/status`)))
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
