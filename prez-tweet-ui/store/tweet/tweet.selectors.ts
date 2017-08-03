import { Observable } from 'rxjs';
import { TweetState } from './tweet.state';

import {
  TweetID,
  TweetPairShortID,
  TweetPairLongID,
  createTweetPairLongID,
  extractTweetIDs,
} from './tweet-pair.model';

export class TweetSelectors  {
  static selectObamaTweetID() {
    return (state$: Observable<TweetState>) => state$.select(s => s.obamaTweetID);
  }

  static selectTrumpTweetID() {
    return (state$: Observable<TweetState>) => state$.select(s => s.trumpTweetID);
  }

  static selectTweetPairFromShortID(shortID: TweetPairShortID) {
    return (state$ : Observable<TweetState>) => state$.select(s => {
      let longID: TweetPairLongID = s.shortToLongMap.get(shortID);
      if (!longID) return null;

      let {obamaTweetID, trumpTweetID} = extractTweetIDs(longID);
      return {obamaTweetID, trumpTweetID};
    })
  }

  static selectShortIDFromTweetPair(obamaTweetID: TweetID, trumpTweetID: TweetID) {
    let longID: TweetPairLongID = createTweetPairLongID(obamaTweetID, trumpTweetID);
    return (state$: Observable<TweetState>) => state$.select(s => s.longToShortMap.get(longID));
  }
}
