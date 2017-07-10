import { Action } from '@ngrx/store';

import { DefaultOffsetKey } from '../../common';

export class SetSynchronizedOffsetAction implements Action {
  static type = 'prez-tweet/status/setSyncOffset';
  type = SetSynchronizedOffsetAction.type;
  constructor(public payload: {offsetKey: DefaultOffsetKey}) {}
}
