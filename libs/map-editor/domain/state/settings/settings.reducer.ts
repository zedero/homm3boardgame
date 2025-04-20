import { createReducer, on, Action } from '@ngrx/store';

import { domainSettingsEventActions } from './settings.actions';

export const SETTINGS_FEATURE_KEY = 'settings';

export type SizeOptions = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface SettingsState {
  generatorSettings: {
    flipCenterTiles: boolean;
    flipFarTiles: boolean;
    flipNearTiles: boolean;
    flipTownTiles: boolean;
    playerCount: number;
    size: SizeOptions;
  };
  filterSettings: {
    [key: string]: boolean;
  };
}

export interface SettingsPartialState {
  readonly [SETTINGS_FEATURE_KEY]: SettingsState;
}

export const initialSettingsState: SettingsState = {
  generatorSettings: {
    flipCenterTiles: false,
    flipFarTiles: false,
    flipNearTiles: false,
    flipTownTiles: true,
    playerCount: 2,
    size: 'MEDIUM',
  },
  filterSettings: {
    CORE: true,
    FORTRESS: true,
    INFERNO: true,
    RAMPART: true,
    RANDOM: true,
    TOWER: true,
  },
};

const reducer = createReducer(
  initialSettingsState,
  on(
    domainSettingsEventActions.changeExpansionFilter,
    (state, { set, isChecked }) => {
      console.log(set, isChecked);
      return {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          [set]: isChecked,
        },
      };
    }
  ),
  on(domainSettingsEventActions.loadSettingsSuccess, (state, { settings }) => ({
    ...state,
    ...settings,
  })),
  on(domainSettingsEventActions.setMapSize, (state, { size }) => ({
    ...state,
    generatorSettings: {
      ...state.generatorSettings,
      size,
    },
  })),
  on(domainSettingsEventActions.setPlayerCount, (state, { count }) => ({
    ...state,
    generatorSettings: {
      ...state.generatorSettings,
      playerCount: count,
    },
  })),
  on(
    domainSettingsEventActions.changeTileGroupFlipped,
    (state, { group, isChecked }) => {
      return {
        ...state,
        generatorSettings: {
          ...state.generatorSettings,
          [group]: isChecked,
        },
      };
    }
  )
);

export function settingsReducer(
  state: SettingsState | undefined,
  action: Action
) {
  return reducer(state, action);
}
