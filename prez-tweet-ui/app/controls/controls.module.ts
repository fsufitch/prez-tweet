import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ControlsComponent } from './controls.component';
import { SyncControlsComponent } from './sync-controls.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [ControlsComponent, SyncControlsComponent],
  exports: [ControlsComponent],
  providers: [],
})
export class ControlsModule {}
