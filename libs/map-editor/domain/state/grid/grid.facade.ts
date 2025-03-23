import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as GridActions from './grid.actions';
import * as GridFeature from './grid.reducer';
import * as GridSelectors from './grid.selectors';

@Injectable()
export class GridFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(GridSelectors.selectGridLoaded));
  allGrid$ = this.store.pipe(select(GridSelectors.selectAllGrid));
  selectedGrid$ = this.store.pipe(select(GridSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(GridActions.initGrid());
  }
}
