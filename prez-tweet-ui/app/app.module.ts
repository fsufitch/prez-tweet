import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'

import { AppComponent } from './app.component';
import { AppStatusComponent, AppStatusService } from './status';
import { TweetComponent } from './tweet';

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
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
