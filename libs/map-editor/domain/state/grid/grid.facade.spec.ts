import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as GridActions from './grid.actions';
import { GridEffects } from './grid.effects';
import { GridFacade } from './grid.facade';
import { GridEntity } from './grid.models';
import {
  GRID_FEATURE_KEY,
  GridState,
  initialGridState,
  gridReducer,
} from './grid.reducer';
import * as GridSelectors from './grid.selectors';

interface TestSchema {
  grid: GridState;
}

describe('GridFacade', () => {
  let facade: GridFacade;
  let store: Store<TestSchema>;
  const createGridEntity = (id: string, name = ''): GridEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(GRID_FEATURE_KEY, gridReducer),
          EffectsModule.forFeature([GridEffects]),
        ],
        providers: [GridFacade],
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
      facade = TestBed.inject(GridFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allGrid$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allGrid$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadGridSuccess` to manually update list
     */
    it('allGrid$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allGrid$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        GridActions.loadGridSuccess({
          grid: [createGridEntity('AAA'), createGridEntity('BBB')],
        })
      );

      list = await readFirst(facade.allGrid$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
