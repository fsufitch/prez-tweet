import { Action } from '@ngrx/store';

import { TweetID, TweetPairShortID, TweetPairLongID } from './tweet-pair.model';

export class SetObamaTweetIDAction implements Action {
  static type = 'prez-tweet/tweet/setObama';
  type = SetObamaTweetIDAction.type;
  constructor(public payload: {tweetID: TweetID}) {}
}

export class SetTrumpTweetIDAction implements Action {
  static type = 'prez-tweet/tweet/setTrump';
  type = SetTrumpTweetIDAction.type;
  constructor(public payload: {tweetID: TweetID}) {}
}

export class UpdateLatestTweetIDsAction implements Action {
  static type = 'prez-tweet/tweet/updateLatest';
  type = UpdateLatestTweetIDsAction.type;
  constructor(public payload: {offsetYears: number} = {offsetYears: 0}) {}
}

export class SetTweetPairAction implements Action {
  static type = 'prez-tweet/tweet/setTweetPairAction';
  type = SetTweetPairAction.type;
  constructor(public payload: {obamaTweetID: TweetID, trumpTweetID: TweetID, shortTweetID: TweetPairShortID}) {}
}

export class UpdateTweetPairFromPairAction implements Action {
  static type = 'prez-tweet/tweet/updateTweetPairFromPairAction';
  type = UpdateTweetPairFromPairAction.type;
  constructor(public payload: {obamaTweetID: TweetID, trumpTweetID: TweetID}) {}
}

export class UpdateTweetPairFromShortIDAction implements Action {
  static type = 'prez-tweet/tweet/updateTweetPairFromShortIDAction';
  type = UpdateTweetPairFromShortIDAction.type;
  constructor(public payload: {shortTweetID: TweetPairShortID}) {}
}
