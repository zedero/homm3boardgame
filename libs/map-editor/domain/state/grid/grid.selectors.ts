import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GRID_FEATURE_KEY, GridState, gridAdapter } from './grid.reducer';

// Lookup the 'Grid' feature state managed by NgRx
export const selectGridState =
  createFeatureSelector<GridState>(GRID_FEATURE_KEY);

const { selectAll, selectEntities } = gridAdapter.getSelectors();

export const selectGridLoaded = createSelector(
  selectGridState,
  (state: GridState) => state.loaded
);

export const selectGridError = createSelector(
  selectGridState,
  (state: GridState) => state.error
);

export const selectAllGrid = createSelector(
  selectGridState,
  (state: GridState) => selectAll(state)
);

export const selectGridEntities = createSelector(
  selectGridState,
  (state: GridState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectGridState,
  (state: GridState) => state.selectedId
);

export const selectEntity = createSelector(
  selectGridEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
