import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { AppStatusComponent, AppStatusService } from './status';
import { TweetComponent, TweetService } from './tweet';
import { TwttrService } from './twttr';
import { ControlsModule } from './controls';

import { StoreModule } from '../store';
import { API_EFFECTS } from '../api';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    StoreModule,
    ...API_EFFECTS.map(e => EffectsModule.runAfterBootstrap(e)),
    ControlsModule,
  ],

  declarations: [
    AppComponent,
    AppStatusComponent,
    TweetComponent,
    HeaderComponent,
    FooterComponent,
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
