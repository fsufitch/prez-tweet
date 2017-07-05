import { Observable } from 'rxjs';
import { StatusState } from './status.state';

export function selectStatus() {
  return (state$: Observable<StatusState>) => state$.select(s => s);
}
