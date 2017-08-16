import { ActionReducer, Action } from '@ngrx/store';
import { Record, Map } from 'immutable';
import {
  SetTweetPairAction,
  SetTweetAction,
  SetCurrentTweetPairAction,
} from './tweet.actions';

import { Tweet, TweetPair, createTweetPairLongID } from './tweet.model'

export interface TweetState {
  currentTweetPair: string;
  tweets: Map<string, Tweet>;
  tweetPairs: Map<string, TweetPair>;
}

export const DEFAULT_TWEET_STATE = {
  currentTweetPair: '',
  tweets: Map.of(),
  tweetPairs: Map.of(),
}

export class TweetState extends Record(DEFAULT_TWEET_STATE) {}

export const tweetReducer: ActionReducer<TweetState> = (state: TweetState=new TweetState(), action: Action) => {
  switch (action.type) {
    case SetTweetPairAction.type: {
      let payload = (<SetTweetPairAction>action).payload;
      let pair: TweetPair = {
        id: createTweetPairLongID(payload.obamaTweetID, payload.trumpTweetID),
        shortID: payload.shortTweetID,
        obamaTweetID: payload.obamaTweetID,
        trumpTweetID: payload.trumpTweetID,
      };
      state = <TweetState>state
        .setIn(['tweetPairs', pair.id], pair)
        .setIn(['tweetPairs', pair.shortID], pair);
      break;
    }

    case SetCurrentTweetPairAction.type: {
      let id = (<SetCurrentTweetPairAction>action).payload.id;
      state = <TweetState>state.set('currentTweetPair', id);
      break;
    }

    case SetTweetAction.type: {
      let tweet = (<SetTweetAction>action).payload.tweet;
      state = <TweetState>state.setIn(['tweets', tweet.idStr], tweet);
      break;
    }
  }
  //console.log("After Action", action);
  //console.log("Tweet state", state.toJS());
  return state;
}
