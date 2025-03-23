import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as SettingsActions from './settings.actions';
import * as SettingsSelectors from './settings.selectors';
import { selectFilterSettings, selectMapSize } from './settings.selectors';

@Injectable()
export class SettingsFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  // loaded$ = this.store.pipe(select(SettingsSelectors.selectSettingsLoaded));
  // allSettings$ = this.store.pipe(select(SettingsSelectors.selectAllSettings));
  // selectedSettings$ = this.store.pipe(select(SettingsSelectors.selectEntity));
  rows$ = this.store.pipe(select(SettingsSelectors.selectRows));
  columns$ = this.store.pipe(select(SettingsSelectors.selectColumns));
  rows = this.store.selectSignal(SettingsSelectors.selectRows);
  columns = this.store.selectSignal(SettingsSelectors.selectColumns);
  playerCount = this.store.selectSignal(SettingsSelectors.selectPlayerCount);
  mapSize = this.store.selectSignal(SettingsSelectors.selectMapSize);
  filterSettings = this.store.selectSignal(
    SettingsSelectors.selectFilterSettings
  );

  townsFlipped = this.store.selectSignal(SettingsSelectors.selectTownsFlipped);
  farTilesFlipped = this.store.selectSignal(
    SettingsSelectors.selectFarTilesFlipped
  );
  nearTilesFlipped = this.store.selectSignal(
    SettingsSelectors.selectNearTilesFlipped
  );
  centerTilesFlipped = this.store.selectSignal(
    SettingsSelectors.selectCenterTilesFlipped
  );

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(SettingsActions.initSettings());
  }
}
