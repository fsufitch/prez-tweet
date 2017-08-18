import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { CommonModule } from '../common';
import { ControlsComponent } from './controls.component';
import { ControlsService } from './controls.service'
import { TweetNavComponent } from './tweet-nav.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ControlsComponent, TweetNavComponent],
  exports: [ControlsComponent, TweetNavComponent],
  providers: [ControlsService],
})
export class ControlsModule {}
