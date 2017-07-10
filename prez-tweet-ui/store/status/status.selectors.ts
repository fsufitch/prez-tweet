import { Observable } from 'rxjs';
import { StatusState } from './status.state';

export class StatusSelectors {
  static selectStatus() {
    return (state$: Observable<StatusState>) => state$.select(s => s);
  }
}
