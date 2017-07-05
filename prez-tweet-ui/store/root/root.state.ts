import { ActionReducer, Action } from '@ngrx/store';
import { Record } from 'immutable';

import { tweetReducer, TweetState } from '../tweet';
import { statusReducer, StatusState } from '../status';

export interface RootState {
  tweets: TweetState;
  status: StatusState;
}

export const rootReducers = {
  tweets: tweetReducer,
  status: statusReducer,
}

export const DEFAULT_ROOT_STATE: RootState = {
  tweets: new TweetState(),
  status: new StatusState(),
};
