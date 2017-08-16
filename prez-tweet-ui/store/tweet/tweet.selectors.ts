import { Observable } from 'rxjs';
import { compose } from '@ngrx/core/compose';
import { TweetState } from './tweet.state';

import { Tweet, TweetPair, createTweetPairLongID } from './tweet.model';

export class TweetSelectors  {
  static selectTweet(idStr: string) {
    return (state$: Observable<TweetState>) => state$.select(s => s.tweets.get(idStr));
  }

  static selectTweetPair(id: string) {
    return (state$ : Observable<TweetState>) => state$.select(s => s.tweetPairs.get(id));
  }

  static selectCurrentTweetPairID() {
    return (state$ : Observable<TweetState>) => state$.select(s => s.currentTweetPair);
  }

  static selectTweetPairFromTweets(obamaTweetID: string, trumpTweetID: string) {
    let longID = createTweetPairLongID(obamaTweetID, trumpTweetID);
    return (state$: Observable<TweetState>) => state$.select(s => s.tweetPairs.get(longID));
  }
}
