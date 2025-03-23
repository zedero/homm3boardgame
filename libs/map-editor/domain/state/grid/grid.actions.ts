import { createAction, createActionGroup, props } from '@ngrx/store';
import { GridEntity, Position } from './grid.models';

export const initGrid = createAction('[Grid Page] Init');

export const loadGridSuccess = createAction(
  '[Grid/API] Load Grid Success',
  props<{ grid: GridEntity[] }>()
);

export const loadGridFailure = createAction(
  '[Grid/API] Load Grid Failure',
  props<{ error: any }>()
);

//action group
export const domainActions = createActionGroup({
  source: 'Grid',
  events: {
    'Add new tile': props<{ row: number; column: number }>(),
  },
});
