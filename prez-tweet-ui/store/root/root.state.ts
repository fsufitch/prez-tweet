import { ActionReducer, Action } from '@ngrx/store';
import { Record } from 'immutable';

import { tweetReducer, TweetState } from '../tweet';

export interface RootState {
  tweets: TweetState;
}

export const rootReducers = {
  tweets: tweetReducer,
}

export const DEFAULT_ROOT_STATE: RootState = {
  tweets: new TweetState(),
};
