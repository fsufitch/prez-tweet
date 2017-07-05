import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

import { Observable } from 'rxjs';

import { RootState, selectStatusState, selectStatus } from '../../store';

@Injectable()
export class AppStatusService {
  constructor(private store: Store<RootState>) { }

  getAppStatus() {
    return this.store.let(compose(
      selectStatus(),
      selectStatusState()
    ));
  }
}
