import { Action } from '@ngrx/store';

import { DefaultOffsetKey } from '../../common';

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

export class UpdateSynchronizedOlderAction implements Action {
  static type = 'prez-tweet/controls/updateSyncOlder'
  type = UpdateSynchronizedOlderAction.type;
  constructor(public payload: {
    offsetYears: number,
    obamaTweetStringID: string,
    trumpTweetStringID: string,
  }) {}
}
export class UpdateSynchronizedNewerAction implements Action {
  static type = 'prez-tweet/controls/updateSyncNewer'
  type = UpdateSynchronizedNewerAction.type;
  constructor(public payload: {
    offsetYears: number,
    obamaTweetStringID: string,
    trumpTweetStringID: string,
  }) {}
}
