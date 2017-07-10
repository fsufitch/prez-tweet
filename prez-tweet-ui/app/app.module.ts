import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { AppStatusComponent } from './status';
import { TweetComponent } from './tweet';
import { ControlsModule } from './controls';

import { StoreModule } from '../store';
import { API_EFFECTS } from '../api';
import { SERVICES } from './shared';

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
    ...SERVICES,
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
