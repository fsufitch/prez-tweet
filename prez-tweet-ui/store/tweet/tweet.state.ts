import { ActionReducer, Action } from '@ngrx/store';
import { Record, Map } from 'immutable';
import {
  SetObamaTweetIDAction,
  SetTrumpTweetIDAction,
  SetTweetPairAction,
} from './tweet.actions';

import { TweetPairLongID, TweetPairShortID, TweetID, createTweetPairLongID } from './tweet-pair.model';

export interface TweetState {
  obamaTweetID: string,
  trumpTweetID: string,
  longToShortMap: Map<TweetPairLongID, TweetPairShortID>,
  shortToLongMap: Map<TweetPairShortID, TweetPairLongID>,
}

export const DEFAULT_TWEET_STATE = {
  obamaTweetID: '',
  trumpTweetID: '',
  longToShortMap: Map.of(),
  shortToLongMap: Map.of(),
}

export class TweetState extends Record(DEFAULT_TWEET_STATE) {}

export const tweetReducer: ActionReducer<TweetState> = (state: TweetState=new TweetState(), action: Action) => {
  switch (action.type) {
    case SetObamaTweetIDAction.type: {
      let tweetID = (<SetObamaTweetIDAction>action).payload.tweetID;
      state = <TweetState>state.set('obamaTweetID', tweetID);
      break;
    }
    case SetTrumpTweetIDAction.type: {
      let tweetID = (<SetTrumpTweetIDAction>action).payload.tweetID;
      state = <TweetState>state.set('trumpTweetID', tweetID);
      break;
    }
    case SetTweetPairAction.type: {
      let payload = (<SetTweetPairAction>action).payload;
      let longID = createTweetPairLongID(payload.obamaTweetID, payload.trumpTweetID);
      state = <TweetState>state
        .setIn(['longToShortMap', longID], payload.shortTweetID)
        .setIn(['shortToLongMap', payload.shortTweetID], longID);
      break;
    }
  }
  return state;
}
