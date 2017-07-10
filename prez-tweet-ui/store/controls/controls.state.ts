import { ActionReducer, Action } from '@ngrx/store';
import { Record } from 'immutable';

import { ControlMode, DefaultOffsetKey, DefaultOffsets } from '../../common';
import { SetSynchronizedOffsetAction } from './controls.actions';

export interface ControlsState {
  mode: ControlMode;
  syncOffset: DefaultOffsetKey;
}

const DEFAULT_CONTROLS_STATE = {
  mode: ControlMode.SYNCHRONIZED,
  syncOffset: DefaultOffsetKey.NONE,
}

export class ControlsState extends Record(DEFAULT_CONTROLS_STATE) {}

export const controlsReducer: ActionReducer<ControlsState> = (state=new ControlsState(), action: Action) => {
  switch (action.type) {
    case (SetSynchronizedOffsetAction.type): {
      let offsetKey = (<SetSynchronizedOffsetAction>action).payload.offsetKey;
      state = <ControlsState>state.set('syncOffset', offsetKey);
      break;
    }
  }
  return state;
}
