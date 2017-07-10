import { Response } from '@angular/http';
import { Observable } from 'rxjs';

interface ResponseErrorPair {
  response: Response,
  error: any,
}

export function parseHttpResponse(response: Response, allowStatus=[200]): ResponseErrorPair {
  if (!(response instanceof Response)) {
    return {response, error: "Invalid response"};
  }

  if (allowStatus.indexOf(response.status) > -1) {
    return {response, error: null};
  } else {
    return {response, error: response.statusText};
  }
}

export function scrubHttp(obs$: Observable<Response>, allowStatus=[200]): Observable<ResponseErrorPair> {
  return obs$.map(r => parseHttpResponse(r, allowStatus))
    .catch(error => Observable.of({response: null, error}));
}
