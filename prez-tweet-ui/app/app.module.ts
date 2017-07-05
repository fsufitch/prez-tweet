import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { AppStatusComponent, AppStatusService } from './status';
import { TweetComponent, TweetService } from './tweet';
import { TwttrService } from './twttr';

import { rootReducers, DEFAULT_ROOT_STATE } from '../store';
import { API_EFFECTS } from '../api';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    StoreModule.provideStore(rootReducers, DEFAULT_ROOT_STATE),
    ...API_EFFECTS.map(e => EffectsModule.runAfterBootstrap(e)),
  ],

  declarations: [
    AppComponent,
    AppStatusComponent,
    TweetComponent,
  ],

  providers: [
    AppStatusService,
    TweetService,
    TwttrService,
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
