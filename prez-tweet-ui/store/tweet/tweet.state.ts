import { ActionReducer, Action } from '@ngrx/store';
import { Record } from 'immutable';
import {
  SetObamaTweetIDAction,
  SetTrumpTweetIDAction,
} from './tweet.actions';


export interface TweetState {
  obamaTweetID: string,
  trumpTweetID: string,
}

export const DEFAULT_TWEET_STATE = {
  obamaTweetID: '',
  trumpTweetID: '',
}


export class TweetState extends Record(DEFAULT_TWEET_STATE) {}

export var tweetReducer: ActionReducer<TweetState> = (state: TweetState=new TweetState(), action: Action) => {
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
  }
  return state;
}
