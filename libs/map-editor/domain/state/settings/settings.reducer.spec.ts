import { Action } from '@ngrx/store';

import * as SettingsActions from './settings.actions';
import { SettingsEntity } from './settings.models';
import {
  SettingsState,
  initialSettingsState,
  settingsReducer,
} from './settings.reducer';

describe('Settings Reducer', () => {
  const createSettingsEntity = (id: string, name = ''): SettingsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Settings actions', () => {
    it('loadSettingsSuccess should return the list of known Settings', () => {
      const settings = [
        createSettingsEntity('PRODUCT-AAA'),
        createSettingsEntity('PRODUCT-zzz'),
      ];
      const action = SettingsActions.loadSettingsSuccess({ settings });

      const result: SettingsState = settingsReducer(
        initialSettingsState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = settingsReducer(initialSettingsState, action);

      expect(result).toBe(initialSettingsState);
    });
  });
});
