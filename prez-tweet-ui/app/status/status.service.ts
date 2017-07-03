import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';

declare const PREZ_TWEET_API_HOST: string;

interface AppStatus {
  up: boolean;
  uptime: number;
  inProgress: boolean;
  error?: string;
}

interface OKResponse {
    api: string,
    js_bundle: string,
    uptime_sec: number,
}

@Injectable()
export class AppStatusService {
  constructor(private http: Http) {}

  private requestStream$ = Observable.timer(0, 1000)
    .switchMap(() => this.http.get(`//${PREZ_TWEET_API_HOST}/api/status`))
    .share();

  getAppStatus(): Observable<AppStatus> {
    let inProgressStatus$ = Observable.of({
      up: false,
      uptime: 0,
      inProgress: true,
    })

    let okStatus$ = this.requestStream$.filter(r => r.status === 200)
      .map(r => <OKResponse>r.json())
      .map(data => ({
        up: true,
        uptime: data.uptime_sec,
        inProgress: false,
      }));

    let notOkStatus$ = this.requestStream$.filter(r => r.status !== 200)
      .map(r => ({
        up: false,
        uptime: 0,
        inProgress: false,
        error: r.text(),
      }));


    return Observable.merge(inProgressStatus$, okStatus$, notOkStatus$).share();
  }
}
