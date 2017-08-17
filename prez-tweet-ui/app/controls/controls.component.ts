import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DefaultOffsetKey, DefaultOffsets, DefaultOrderedOffsetKeys } from '../../common';
import { ControlsService } from './controls.service';

@Component({
  selector: 'appcontrols',
  template: require('./controls.component.html'),
  styles: [
    require('./controls.component.scss'),
  ],
})
export class ControlsComponent {
  constructor(private controlsService: ControlsService) {}
  showSyncBrowsing = false;

  activeOffsetKey$ = this.controlsService.getSynchronizedOffsetKey();
  activeOffset$ = this.activeOffsetKey$.map(k => DefaultOffsets[k]);

  canSyncOlder$ = this.controlsService.canSyncOlder();
  canSyncNewer$ = this.controlsService.canSyncNewer();

  offsetMap = DefaultOffsets
  orderedOffsetKeys = DefaultOrderedOffsetKeys

  offsetClicked(offsetKey: DefaultOffsetKey) {
    this.controlsService.setSynchronizedOffset(offsetKey);
  }

  olderClicked() {
    this.controlsService.triggerSynchronizedOlder();
  }

  newerClicked() {
    this.controlsService.triggerSynchronizedNewer();
  }
}
