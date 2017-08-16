import { NgModule } from '@angular/core';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import { rootReducers, DEFAULT_ROOT_STATE } from './root';


@NgModule({
  imports: [
    NgrxStoreModule.provideStore(rootReducers, DEFAULT_ROOT_STATE),
  ],
})
export class StoreModule{}
