import { Action } from '@ngrx/store';

import { Tweet, TweetPair } from './tweet.model';

export class UpdateLatestTweetIDsAction implements Action {
  static type = 'prez-tweet/tweet/updateLatest';
  type = UpdateLatestTweetIDsAction.type;
  constructor(public payload: {offsetYears: number} = {offsetYears: 0}) {}
}

export class SetTweetPairAction implements Action {
  static type = 'prez-tweet/tweet/setTweetPairAction';
  type = SetTweetPairAction.type;
  constructor(public payload: {obamaTweetID: string, trumpTweetID: string, shortTweetID: string}) {}
}

export class SetCurrentTweetPairAction implements Action {
  static type = 'prez-tweet/tweet/setCurrentTweetPairAction';
  type = SetCurrentTweetPairAction.type;
  constructor(public payload: {id: string}) {}
}

export class UpdateTweetPairFromPairAction implements Action {
  static type = 'prez-tweet/tweet/updateTweetPairFromPairAction';
  type = UpdateTweetPairFromPairAction.type;
  constructor(public payload: {obamaTweetID: string, trumpTweetID: string}) {}
}

export class UpdateTweetPairFromShortIDAction implements Action {
  static type = 'prez-tweet/tweet/updateTweetPairFromShortIDAction';
  type = UpdateTweetPairFromShortIDAction.type;
  constructor(public payload: {shortTweetID: string}) {}
}

export class PopulateTweetAction implements Action {
  static type = 'prez-tweet/tweet/populateTweet';
  type = PopulateTweetAction.type;
  constructor(public payload: {idStr: string}) {}
}

export class SetTweetAction implements Action {
  static type = 'prez-tweet/tweet/setTweet';
  type = SetTweetAction.type;
  constructor(public payload: {tweet: Tweet}) {}
}
