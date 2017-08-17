import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from '../common';
import { ControlsModule } from '../controls';
import { CompareTweetsComponent } from './compare-tweets.component';
import { CompareTweetsEffects } from './compare-tweets.effects';
import { TweetPairResolver } from './tweet-pair-resolver.service';

const ROUTES: Routes = [
  {
    path: 'p/:pairShortId',
    resolve: {tweetPair: TweetPairResolver},
    component: CompareTweetsComponent,
  },
  {
    path: 'p',
    resolve: {tweetPair: TweetPairResolver},
    component: CompareTweetsComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ControlsModule,
    RouterModule.forChild(ROUTES),
    EffectsModule.runAfterBootstrap(CompareTweetsEffects),
  ],
  declarations: [
    CompareTweetsComponent,
  ],
  providers: [
    TweetPairResolver,
  ]
})
export class CompareTweetsModule {}
