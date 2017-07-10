import { Observable } from 'rxjs';
import { ControlsState } from './controls.state';

export class ControlsSelectors {
  static selectMode() {
    return (state$: Observable<ControlsState>) => state$.select(s => s.mode);
  }

  static selectSynchronizedOffsetKey() {
    return (state$: Observable<ControlsState>) => state$.select(s => s.syncOffset)
  }
}
