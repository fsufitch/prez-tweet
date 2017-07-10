import { Injectable } from '@angular/core';

import { compose } from '@ngrx/core/compose';
import { Store } from '@ngrx/store';

import {
  RootState,
  RootSelectors,
  TweetSelectors,
} from '../../store';

@Injectable()
export class TweetService {
 constructor(private store: Store<RootState>) {}

 getTrumpTweetID() {
   return compose(
     TweetSelectors.selectTrumpTweetID(),
     RootSelectors.selectTweetState()
   )(this.store);
 }

 getObamaTweetID() {
   return compose(
     TweetSelectors.selectObamaTweetID(),
     RootSelectors.selectTweetState()
   )(this.store);
 }
}
