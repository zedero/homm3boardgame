import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as TileMapActions from './tile-map.actions';
import * as TileMapFeature from './tile-map.reducer';
import * as TileMapSelectors from './tile-map.selectors';

@Injectable()
export class TileMapFacade {
  private readonly store = inject(Store);

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(TileMapActions.initTileMap());
  }
}
