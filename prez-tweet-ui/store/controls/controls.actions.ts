import { Action } from '@ngrx/store';

import { DefaultOffsetKey } from '../../common';
import { Tweet } from '../tweet';

export class SetSynchronizedOffsetAction implements Action {
  static type = 'prez-tweet/controls/setSyncOffset';
  type = SetSynchronizedOffsetAction.type;
  constructor(public payload: {offsetKey: DefaultOffsetKey}) {}
}

export class UpdateSynchronizedOffsetAction implements Action {
  static type = 'prez-tweet/controls/updateSyncOffset'
  type = UpdateSynchronizedOffsetAction.type;
  constructor(public payload: {
    offsetYears: number,
    obamaTweetStringID: string,
    trumpTweetStringID: string,
  }) {}
}

export class TriggerSynchronizedOlderAction implements Action {
  static type = 'prez-tweet/controls/triggerSyncOlder';
  type = TriggerSynchronizedOlderAction.type;
  constructor(public payload: {
    offsetYears: number,
    obamaTweet: Tweet,
    trumpTweet: Tweet,
  }) {}
}

export class TriggerSynchronizedNewerAction implements Action {
  static type = 'prez-tweet/controls/triggerSyncNewer';
  type = TriggerSynchronizedNewerAction.type;
  constructor(public payload: {
    offsetYears: number,
    obamaTweet: Tweet,
    trumpTweet: Tweet,
  }) {}
}
