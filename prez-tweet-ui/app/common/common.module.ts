import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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
    FormsModule,
    TweetComponent,
  ],
})
export class CommonModule {}
