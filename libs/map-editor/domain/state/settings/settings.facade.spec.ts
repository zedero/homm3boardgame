import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as SettingsActions from './settings.actions';
import { SettingsEffects } from './settings.effects';
import { SettingsFacade } from './settings.facade';
import { SettingsEntity } from './settings.models';
import {
  SETTINGS_FEATURE_KEY,
  SettingsState,
  initialSettingsState,
  settingsReducer,
} from './settings.reducer';
import * as SettingsSelectors from './settings.selectors';

interface TestSchema {
  settings: SettingsState;
}

describe('SettingsFacade', () => {
  let facade: SettingsFacade;
  let store: Store<TestSchema>;
  const createSettingsEntity = (id: string, name = ''): SettingsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(SETTINGS_FEATURE_KEY, settingsReducer),
          EffectsModule.forFeature([SettingsEffects]),
        ],
        providers: [SettingsFacade],
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
      facade = TestBed.inject(SettingsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allSettings$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allSettings$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadSettingsSuccess` to manually update list
     */
    it('allSettings$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allSettings$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        SettingsActions.loadSettingsSuccess({
          settings: [createSettingsEntity('AAA'), createSettingsEntity('BBB')],
        })
      );

      list = await readFirst(facade.allSettings$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
