import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ControlMode } from '../../common';
import { SyncControlsComponent } from './sync-controls.component';

@Component({
  selector: 'appcontrols',
  template: require('./controls.component.html'),
  styles: [
    require('./controls.component.scss'),
  ],
})
export class ControlsComponent {
  ControlMode = ControlMode; // For template use
  @Input() mode: ControlMode;
  @Output() modeChanged = new EventEmitter<ControlMode>();
}
