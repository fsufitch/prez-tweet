import { Observable } from 'rxjs';
import { TweetState } from './tweet.state';

export class TweetSelectors  {
  static selectObamaTweetID() {
    return (state$: Observable<TweetState>) => state$.select(s => s.obamaTweetID);
  }

  static selectTrumpTweetID() {
    return (state$: Observable<TweetState>) => state$.select(s => s.trumpTweetID);
  }
}
