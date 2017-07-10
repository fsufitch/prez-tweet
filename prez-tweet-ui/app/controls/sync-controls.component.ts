import { Component } from '@angular/core';

import { DefaultOrderedOffsetKeys, DefaultOffsets, DefaultOffsetKey } from '../../common';
import { ControlsService } from './controls.service';


@Component({
  selector: `[sync-controls]"]`,
  template: require('./sync-controls.component.html'),
})
export class SyncControlsComponent {
  constructor(private controlsService: ControlsService) {}

  activeOffsetKey$ = this.controlsService.getSynchronizedOffsetKey();
  activeOffset$ = this.activeOffsetKey$.map(k => DefaultOffsets[k]);

  offsetMap = DefaultOffsets
  orderedOffsetKeys = DefaultOrderedOffsetKeys

  offsetClicked(offsetKey: DefaultOffsetKey) {
    this.controlsService.setSynchronizedOffset(offsetKey);
  }
}
