import { Observable } from 'rxjs';
import { TweetState } from './tweet.state';

export function selectObamaTweetID() {
  return (state$: Observable<TweetState>) => state$.select(s => s.obamaTweetID);
}

export function selectTrumpTweetID() {
  return (state$: Observable<TweetState>) => state$.select(s => s.trumpTweetID);
}
