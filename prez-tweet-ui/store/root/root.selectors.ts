import { Observable } from 'rxjs';
import { RootState } from './root.state';

export function selectTweetState() {
  return (state$: Observable<RootState>) => state$.select(s => s.tweets);
}

export function selectStatusState() {
  return (state$: Observable<RootState>) => state$.select(s => s.status);
}
