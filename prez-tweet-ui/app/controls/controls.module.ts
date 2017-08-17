import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import { ControlsComponent } from './controls.component';
import { ControlsService } from './controls.service'
import { TweetNavComponent } from './tweet-nav.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [ControlsComponent, TweetNavComponent],
  exports: [ControlsComponent, TweetNavComponent],
  providers: [ControlsService],
})
export class ControlsModule {}
