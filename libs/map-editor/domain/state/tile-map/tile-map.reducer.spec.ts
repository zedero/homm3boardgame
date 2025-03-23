import { Action } from '@ngrx/store';

import * as TileMapActions from './tile-map.actions';
import { TileMapEntity } from './tile-map.models';
import {
  TileMapState,
  initialTileMapState,
  tileMapReducer,
} from './tile-map.reducer';

describe('TileMap Reducer', () => {
  const createTileMapEntity = (id: string, name = ''): TileMapEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid TileMap actions', () => {
    it('loadTileMapSuccess should return the list of known TileMap', () => {
      const tileMap = [
        createTileMapEntity('PRODUCT-AAA'),
        createTileMapEntity('PRODUCT-zzz'),
      ];
      const action = TileMapActions.loadTileMapSuccess({ tileMap });

      const result: TileMapState = tileMapReducer(initialTileMapState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = tileMapReducer(initialTileMapState, action);

      expect(result).toBe(initialTileMapState);
    });
  });
});
