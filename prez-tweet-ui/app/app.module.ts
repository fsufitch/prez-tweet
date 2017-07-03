import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'

import { AppComponent } from './app.component';
import { AppStatusComponent, AppStatusService } from './status';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
  ],

  declarations: [
    AppComponent,
    AppStatusComponent
  ],

  providers: [
    AppStatusService,
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
