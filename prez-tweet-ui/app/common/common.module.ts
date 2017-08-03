import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { TweetComponent } from '../tweet';
import { StoreModule } from '../../store';
import { PROVIDERS as SHARED_PROVIDERS } from '../shared';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    StoreModule,
  ],
  providers: [
    ...SHARED_PROVIDERS,
  ],
  declarations: [
    TweetComponent,
  ],
  exports: [
    BrowserModule,
    HttpModule,
    StoreModule,
    TweetComponent,
  ],
})
export class CommonModule {}
