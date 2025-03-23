import { Action } from '@ngrx/store';

import * as GridActions from './grid.actions';
import { GridEntity } from './grid.models';
import { GridState, initialGridState, gridReducer } from './grid.reducer';

describe('Grid Reducer', () => {
  const createGridEntity = (id: string, name = ''): GridEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Grid actions', () => {
    it('loadGridSuccess should return the list of known Grid', () => {
      const grid = [
        createGridEntity('PRODUCT-AAA'),
        createGridEntity('PRODUCT-zzz'),
      ];
      const action = GridActions.loadGridSuccess({ grid });

      const result: GridState = gridReducer(initialGridState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = gridReducer(initialGridState, action);

      expect(result).toBe(initialGridState);
    });
  });
});
