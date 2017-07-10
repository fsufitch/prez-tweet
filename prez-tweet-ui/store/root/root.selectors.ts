import { Observable } from 'rxjs';
import { RootState } from './root.state';

export class RootSelectors {
  static selectTweetState() {
    return (state$: Observable<RootState>) => state$.select(s => s.tweets);
  }

  static selectStatusState() {
    return (state$: Observable<RootState>) => state$.select(s => s.status);
  }

  static selectControlsState() {
    return (state$: Observable<RootState>) => state$.select(s => s.controls);
  }
}
