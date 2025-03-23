import { GridEntity } from './grid.models';
import {
  gridAdapter,
  GridPartialState,
  initialGridState,
} from './grid.reducer';
import * as GridSelectors from './grid.selectors';

describe('Grid Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getGridId = (it: GridEntity) => it.id;
  const createGridEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as GridEntity);

  let state: GridPartialState;

  beforeEach(() => {
    state = {
      grid: gridAdapter.setAll(
        [
          createGridEntity('PRODUCT-AAA'),
          createGridEntity('PRODUCT-BBB'),
          createGridEntity('PRODUCT-CCC'),
        ],
        {
          ...initialGridState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Grid Selectors', () => {
    it('selectAllGrid() should return the list of Grid', () => {
      const results = GridSelectors.selectAllGrid(state);
      const selId = getGridId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = GridSelectors.selectEntity(state) as GridEntity;
      const selId = getGridId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectGridLoaded() should return the current "loaded" status', () => {
      const result = GridSelectors.selectGridLoaded(state);

      expect(result).toBe(true);
    });

    it('selectGridError() should return the current "error" state', () => {
      const result = GridSelectors.selectGridError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
