import { Injectable } from '@angular/core';

import { compose } from '@ngrx/core/compose';
import { Store } from '@ngrx/store';

import {
  RootState,
  selectObamaTweetID,
  selectTrumpTweetID,
  selectTweetState,
} from '../../store';

@Injectable()
export class TweetService {
 constructor(private store: Store<RootState>) {}

 getTrumpTweetID() {
   return compose(
     selectTrumpTweetID(),
     selectTweetState()
   )(this.store);
 }

 getObamaTweetID() {
   return compose(
     selectObamaTweetID(),
     selectTweetState()
   )(this.store);
 }
}
