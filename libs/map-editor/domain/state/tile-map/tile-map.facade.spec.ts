import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as TileMapActions from './tile-map.actions';
import { TileMapEffects } from './tile-map.effects';
import { TileMapFacade } from './tile-map.facade';
import { TileMapEntity } from './tile-map.models';
import {
  TILE_MAP_FEATURE_KEY,
  TileMapState,
  initialTileMapState,
  tileMapReducer,
} from './tile-map.reducer';
import * as TileMapSelectors from './tile-map.selectors';

interface TestSchema {
  tileMap: TileMapState;
}

describe('TileMapFacade', () => {
  let facade: TileMapFacade;
  let store: Store<TestSchema>;
  const createTileMapEntity = (id: string, name = ''): TileMapEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(TILE_MAP_FEATURE_KEY, tileMapReducer),
          EffectsModule.forFeature([TileMapEffects]),
        ],
        providers: [TileMapFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(TileMapFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allTileMap$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allTileMap$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadTileMapSuccess` to manually update list
     */
    it('allTileMap$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allTileMap$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        TileMapActions.loadTileMapSuccess({
          tileMap: [createTileMapEntity('AAA'), createTileMapEntity('BBB')],
        })
      );

      list = await readFirst(facade.allTileMap$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
