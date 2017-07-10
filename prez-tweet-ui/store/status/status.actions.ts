import { Action } from '@ngrx/store';

export class UpdateAPIStatusAction implements Action {
    static type = 'prez-tweet/status/updateStatus';
    type = UpdateAPIStatusAction.type;
}

export class SetStatusAction implements Action {
  static type = 'prez-tweet/status/setStatus';
  type = SetStatusAction.type;
  constructor(public payload: {
    ok: boolean,
    uptimeSec: number,
    error: string,
  }) {}
}