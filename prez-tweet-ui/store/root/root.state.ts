import { ActionReducer, Action } from '@ngrx/store';
import { Record } from 'immutable';

import { tweetReducer, TweetState } from '../tweet';
import { statusReducer, StatusState } from '../status';
import { controlsReducer, ControlsState } from '../controls';

export interface RootState {
  tweets: TweetState;
  status: StatusState;
  controls: ControlsState;
}

export const rootReducers = {
  tweets: tweetReducer,
  status: statusReducer,
  controls: controlsReducer,
}

export const DEFAULT_ROOT_STATE: RootState = {
  tweets: new TweetState(),
  status: new StatusState(),
  controls: new ControlsState(),
};
