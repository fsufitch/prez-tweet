import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { ControlsComponent } from './controls.component';
import { SyncControlsComponent } from './sync-controls.component';
import { ControlsService } from './controls.service'

@NgModule({
  imports: [BrowserModule],
  declarations: [ControlsComponent, SyncControlsComponent],
  exports: [ControlsComponent],
  providers: [ControlsService],
})
export class ControlsModule {}
