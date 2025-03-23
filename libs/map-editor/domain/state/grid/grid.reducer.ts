import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as GridActions from './grid.actions';
import { GridEntity } from './grid.models';

export const GRID_FEATURE_KEY = 'grid';

export interface GridState extends EntityState<GridEntity> {
  selectedId?: string | number; // which Grid record has been selected
  loaded: boolean; // has the Grid list been loaded
  error?: string | null; // last known error (if any)
  rows: number;
  columns: number;
  featureSwitch: boolean;
}

export interface GridPartialState {
  readonly [GRID_FEATURE_KEY]: GridState;
}

export const gridAdapter: EntityAdapter<GridEntity> =
  createEntityAdapter<GridEntity>();

export const initialGridState: GridState = gridAdapter.getInitialState({
  // set initial required properties
  loaded: false,
  rows: 12,
  columns: 12,
  featureSwitch: false,
});

const reducer = createReducer(
  initialGridState,
  on(GridActions.initGrid, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GridActions.loadGridSuccess, (state, { grid }) =>
    gridAdapter.setAll(grid, { ...state, loaded: true })
  ),
  on(GridActions.loadGridFailure, (state, { error }) => ({ ...state, error }))
);

export function gridReducer(state: GridState | undefined, action: Action) {
  return reducer(state, action);
}
