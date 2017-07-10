import { Action } from '@ngrx/store';

import { DefaultOffsetKey } from '../../common';

export class SetSynchronizedOffsetAction implements Action {
  static type = 'prez-tweet/controls/setSyncOffset';
  type = SetSynchronizedOffsetAction.type;
  constructor(public payload: {offsetKey: DefaultOffsetKey}) {}
}

export class UpdateSynchronizedOlderAction implements Action {
  static type = 'prez-tweet/controls/updateSyncOlder'
  type = UpdateSynchronizedOlderAction.type;
  constructor(public payload: {
    offsetYears: number,
    currentTweet1StringID: string,
    currentTweet2StringID: string,
  }) {}
}
export class UpdateSynchronizedNewerAction implements Action {
  static type = 'prez-tweet/controls/updateSyncNewer'
  type = UpdateSynchronizedNewerAction.type;
  constructor(public payload: {
    offsetYears: number,
    currentTweet1StringID: string,
    currentTweet2StringID: string,
  }) {}
}
