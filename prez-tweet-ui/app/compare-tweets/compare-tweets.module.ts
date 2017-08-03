import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from '../common';
import { CompareTweetsComponent } from './compare-tweets.component';
import { CompareTweetsEffects } from './compare-tweets.effects';
import { TweetPairShortIDResolver } from './tweet-pair-resolver.service';

const ROUTES: Routes = [
  {
    path: 'p/:pairShortId',
    resolve: {pairShortId: TweetPairShortIDResolver},
    component: CompareTweetsComponent,
  },
  {
    path: 'p',
    resolve: {pairShortId: TweetPairShortIDResolver},
    component: CompareTweetsComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    EffectsModule.runAfterBootstrap(CompareTweetsEffects),
  ],
  declarations: [
    CompareTweetsComponent,
  ],
  providers: [
    TweetPairShortIDResolver,
  ]
})
export class CompareTweetsModule {}
