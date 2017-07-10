import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

import { DefaultOffsetKey } from '../../common';
import {
  RootState,
  RootSelectors,
  ControlsSelectors,
  SetSynchronizedOffsetAction,
 } from '../../store';

@Injectable()
export class ControlsService {
  constructor(private store: Store<RootState>) {}

  getControlsMode() {
    return this.store.let(compose(
      ControlsSelectors.selectMode(),
      RootSelectors.selectControlsState()
    ));
  }

  getSynchronizedOffsetKey() {
    return this.store.let(compose(
      ControlsSelectors.selectSynchronizedOffsetKey(),
      RootSelectors.selectControlsState()
    ));
  }

  setSynchronizedOffset(offsetKey: DefaultOffsetKey) {
    this.store.dispatch(new SetSynchronizedOffsetAction({offsetKey}))
  }
}
