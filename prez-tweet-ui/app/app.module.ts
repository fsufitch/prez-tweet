import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from './common';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer';
import { HeaderComponent } from './header';
import { AppStatusComponent } from './status';
import { ControlsModule } from './controls';
import { CompareTweetsModule } from './compare-tweets';

import { EFFECTS as API_EFFECTS } from '../api';
import { EFFECTS as SHARED_EFFECTS } from './shared';
import { EFFECTS as CONTROLS_EFFECTS } from './controls';

const isProd = ['prod', 'deploy'].indexOf(process.env.ENV) > -1;
const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/p',
  }
];

const EFFECTS = [...API_EFFECTS, ...CONTROLS_EFFECTS, ...SHARED_EFFECTS];

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    CompareTweetsModule,
    ...EFFECTS.map(e => EffectsModule.runAfterBootstrap(e)),
    RouterModule.forRoot(ROUTES, {
      //enableTracing: !isProd,
      useHash: true,
    }),
  ],

  declarations: [
    AppComponent,
    AppStatusComponent,
    HeaderComponent,
    FooterComponent,
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
