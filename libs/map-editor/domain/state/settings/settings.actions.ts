import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { SettingsEntity } from './settings.models';
import { Tile } from '../../../util/types/tile';
import { SettingsState, SizeOptions } from './settings.reducer';

export const initSettings = createAction('[Settings Page] Init');

export const loadSettingsSuccess = createAction(
  '[Settings/API] Load Settings Success',
  props<{ settings: SettingsEntity[] }>()
);

export const loadSettingsFailure = createAction(
  '[Settings/API] Load Settings Failure',
  props<{ error: any }>()
);

export const domainSettingsEventActions = createActionGroup({
  source: 'settings',
  events: {
    'change expansion filter': props<{
      set: string;
      isChecked: boolean;
    }>(),
    'load settings success': props<{
      settings: SettingsState;
    }>(),
    'set map size': props<{
      size: SizeOptions;
    }>(),
    'set player count': props<{
      count: number;
    }>(),
    'change tile group flipped': props<{
      group: string;
      isChecked: boolean;
    }>(),
  },
});
