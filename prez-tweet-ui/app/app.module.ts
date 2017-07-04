import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'

import { AppComponent } from './app.component';
import { AppStatusComponent, AppStatusService } from './status';
import { TweetComponent } from './tweet';
import { TwttrService } from './twttr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
  ],

  declarations: [
    AppComponent,
    AppStatusComponent,
    TweetComponent,
  ],

  providers: [
    AppStatusService,
    TwttrService,
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
