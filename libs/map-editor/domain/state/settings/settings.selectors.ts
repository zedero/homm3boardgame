import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SETTINGS_FEATURE_KEY, SettingsState } from './settings.reducer';

export const selectSettingsState =
  createFeatureSelector<SettingsState>(SETTINGS_FEATURE_KEY);

export const selectFilterSettings = createSelector(
  selectSettingsState,
  (state) => state.filterSettings
);

export const selectGeneratorSettings = createSelector(
  selectSettingsState,
  (state) => state.generatorSettings
);

export const selectGridSettings = createSelector(
  selectSettingsState,
  (state) => state.grid
);

export const selectFilterSettingByName = (name: string) =>
  createSelector(selectFilterSettings, (settings) => settings[name]);

export const selectMapSize = createSelector(
  selectGeneratorSettings,
  (settings) => settings.size
);

export const selectPlayerCount = createSelector(
  selectGeneratorSettings,
  (settings) => settings.playerCount
);

export const selectRows = createSelector(
  selectGridSettings,
  (settings) => settings.rows
);

export const selectColumns = createSelector(
  selectGridSettings,
  (settings) => settings.columns
);

export const selectTownsFlipped = createSelector(
  selectGeneratorSettings,
  (settings) => settings.flipTownTiles
);
export const selectFarTilesFlipped = createSelector(
  selectGeneratorSettings,
  (settings) => settings.flipFarTiles
);
export const selectNearTilesFlipped = createSelector(
  selectGeneratorSettings,
  (settings) => settings.flipNearTiles
);
export const selectCenterTilesFlipped = createSelector(
  selectGeneratorSettings,
  (settings) => settings.flipCenterTiles
);
