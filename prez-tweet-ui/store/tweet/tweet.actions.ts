import { Action } from '@ngrx/store';

export class SetObamaTweetIDAction implements Action {
  static type = 'prez-tweet/tweet/setObama';
  type = SetObamaTweetIDAction.type;
  constructor(public payload: {tweetID: string}) {}
}

export class SetTrumpTweetIDAction implements Action {
  static type = 'prez-tweet/tweet/setTrump';
  type = SetTrumpTweetIDAction.type;
  constructor(public payload: {tweetID: string}) {}
}

export class UpdateLatestTweetIDsAction implements Action {
  static type = 'prez-tweet/tweet/updateLatest';
  type = UpdateLatestTweetIDsAction.type;
}
