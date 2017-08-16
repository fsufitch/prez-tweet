import { Injectable } from '@angular/core';

import { compose } from '@ngrx/core/compose';
import { Store } from '@ngrx/store';

import {
  RootState,
  RootSelectors,
  TweetSelectors,
  PopulateTweetAction,
  UpdateTweetPairFromShortIDAction,
  UpdateTweetPairFromPairAction,
  SetCurrentTweetPairAction,
} from '../../store';

@Injectable()
export class TweetService {
 constructor(private store: Store<RootState>) {}

 getObamaTweetID() {
   return this.getCurrentTweetPairID()
     .flatMap(id => this.getTweetPair(id))
     .map(pair => !!pair ? pair.obamaTweetID : undefined);
 }

 getTrumpTweetID() {
   return this.getCurrentTweetPairID()
     .flatMap(id => this.getTweetPair(id))
     .map(pair => !!pair ? pair.trumpTweetID : undefined);
 }

 getTweet(idStr: string) {
   return this.store.let(compose(
     TweetSelectors.selectTweet(idStr),
     RootSelectors.selectTweetState(),
   ));
 }

 getObamaTweet() {
   return this.getObamaTweetID().flatMap(id => this.getTweet(id));
 }

 getTrumpTweet() {
   return this.getTrumpTweetID().flatMap(id => this.getTweet(id));
 }

 populateTweet(idStr: string, force: boolean) {
   let populate = () => this.store.dispatch(new PopulateTweetAction({idStr}));
   if (force) {
     populate();
     return;
   }
   this.getTweet(idStr).take(1).filter(tw => !tw).subscribe(populate);
 }

 getCurrentTweetPairID() {
   return this.store.let(compose(
     TweetSelectors.selectCurrentTweetPairID(),
     RootSelectors.selectTweetState(),
   ))
 }

 getTweetPair(id: string) {
   return this.store.let(compose(
     TweetSelectors.selectTweetPair(id),
     RootSelectors.selectTweetState(),
   ));
 }

 getTweetPairFromTweets(obamaTweetID: string, trumpTweetID: string) {
   return this.store.let(compose(
     TweetSelectors.selectTweetPairFromTweets(obamaTweetID, trumpTweetID),
     RootSelectors.selectTweetState(),
   ));
 }

 setCurrentTweetPairID(id: string) {
   this.store.dispatch(new SetCurrentTweetPairAction({id}));
 }

 populateTweetPairFromShortID(shortID: string, repopulate=false) {
   this.getTweetPair(shortID)
     .take(1)
     .filter(pair => repopulate || !pair)
     .subscribe(() => this.store.dispatch(new UpdateTweetPairFromShortIDAction({shortTweetID: shortID})));
 }

 populateTweetPairFromTweets(obamaTweetID: string, trumpTweetID: string, repopulate=false) {
   this.getTweetPairFromTweets(obamaTweetID, trumpTweetID)
     .take(1)
     .filter(pair => repopulate || !pair)
     .subscribe(() => this.store.dispatch(new UpdateTweetPairFromPairAction({obamaTweetID, trumpTweetID})));
 }
}
