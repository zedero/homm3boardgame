import { createReducer, on, Action } from '@ngrx/store';

import { Tile } from '../../../util/types/tile';
import { domainEventActions } from './tile-map.actions';
import { generateGuid } from '../../../util/guid/guid';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';

export const TILE_MAP_FEATURE_KEY = 'tileMap';

export type Grid = {
  rows: number;
  columns: number;
};

export interface TileMapState {
  tileList: Tile[];
  grid: Grid;
}

export interface TileMapPartialState {
  readonly [TILE_MAP_FEATURE_KEY]: TileMapState;
}

export const initialTileMapState: TileMapState = {
  tileList: [],
  grid: {
    rows: 12,
    columns: 12,
  },
};

const reducer = createReducer(
  initialTileMapState
  // on(domainEventActions.addTile, (state, { row, column, tileId }) => {
  //   const tile: Tile = {
  //     row,
  //     col: column,
  //     tileId,
  //     id: generateGuid(),
  //     cubes: [0, 0, 0, 0, 0, 0, 0],
  //     hero: ['', '', '', '', '', '', ''],
  //     rotation: 0,
  //   };
  //   return {
  //     ...state,
  //     tileList: [...state.tileList, tile],
  //   };
  // }),
  // on(domainEventActions.deleteTile, (state, { tileId }) => {
  //   return {
  //     ...state,
  //     tileList: state.tileList.filter((tile) => tile.id !== tileId),
  //   };
  // }),
  // on(domainEventActions.updateTile, (state, updatedTile) => {
  //   console.log(updatedTile, {
  //     ...state,
  //     tileList: state.tileList.map((tile) =>
  //       tile.id === updatedTile.id ? { ...tile, ...updatedTile } : tile
  //     ),
  //   });
  //   return {
  //     ...state,
  //     tileList: state.tileList.map((tile) =>
  //       tile.id === updatedTile.id ? { ...tile, ...updatedTile } : tile
  //     ),
  //   };
  // }),
  // on(domainEventActions.setTileList, (state, { tileList }) => {
  //   return {
  //     ...state,
  //     tileList: tileList,
  //   };
  // })
);

export function tileMapReducer(
  state: TileMapState | undefined,
  action: Action
) {
  return reducer(state, action);
}

export type TileBaseData = {
  row: number;
  column: number;
  tileId: string;
};

export const TileMapStore = signalStore(
  { providedIn: 'root' },
  withState(initialTileMapState),
  withComputed((store) => ({
    connectedTilesMap: computed(() => {
      // move connected over to here
      return store.tileList().length;
    }),
  })),
  // patch state methods
  withMethods((store) => ({
    addTile: (tileBaseData: TileBaseData) => {
      const tile: Tile = {
        row: tileBaseData.row,
        col: tileBaseData.column,
        tileId: tileBaseData.tileId,
        id: generateGuid(),
        cubes: [0, 0, 0, 0, 0, 0, 0],
        hero: ['', '', '', '', '', '', ''],
        rotation: 0,
      };
      patchState(store, (state) => ({
        tileList: [...state.tileList, tile],
      }));
    },
    deleteTile: (id: string) => {
      patchState(store, (state) => ({
        tileList: state.tileList.filter((tile) => tile.id !== id),
      }));
    },
    updateTile: (updatedTile: Tile) => {
      patchState(store, (state) => ({
        tileList: state.tileList.map((tile) =>
          tile.id === updatedTile.id ? { ...tile, ...updatedTile } : tile
        ),
      }));
    },
    setTileList: (tileList: Tile[]) => {
      patchState(store, () => ({
        tileList,
      }));
    },
    setGrid: (rows: number, columns: number) => {
      patchState(store, () => ({
        grid: {
          rows,
          columns,
        },
      }));
    },
  })),
  // Select Methods
  withMethods((store) => ({
    selectTileByGuid: (guid: string) => {
      return store.tileList().find((tile) => tile.id === guid);
    },
  }))
);
