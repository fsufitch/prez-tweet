import { ActionReducer, Action } from '@ngrx/store';
import { Record } from 'immutable';

import { SetStatusAction } from './status.actions';

export interface StatusState {
  ok: boolean,
  uptimeSec: number,
  error: string,
}

const DEFAULT_STATUS_STATE = {
  ok: false,
  uptimeSec: 0,
  error: 'Status state not initialized',
}

export class StatusState extends Record(DEFAULT_STATUS_STATE) {}

export const statusReducer: ActionReducer<StatusState> = (state=new StatusState(), action: Action) => {
  switch (action.type) {
    case SetStatusAction.type: {
      let data = (<SetStatusAction>action).payload;
      state = <StatusState>state.merge({
        ok: data.ok,
        uptimeSec: data.uptimeSec,
        error: data.error,
      });
      break;
    }
  }
  return state;
}
