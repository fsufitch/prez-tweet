import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';

import { Observable } from 'rxjs';

import { RootState, RootSelectors, StatusSelectors } from '../../store';

@Injectable()
export class AppStatusService {
  constructor(private store: Store<RootState>) { }

  getAppStatus() {
    return this.store.let(compose(
      StatusSelectors.selectStatus(),
      RootSelectors.selectStatusState()
    ));
  }
}
