import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TILE_MAP_FEATURE_KEY, TileMapState } from './tile-map.reducer';
import { Tile } from '../../../util/types/tile';

export const selectTileMapState =
  createFeatureSelector<TileMapState>(TILE_MAP_FEATURE_KEY);

export const selectTileList = createSelector(
  selectTileMapState,
  (state: TileMapState) => state.tileList
);
