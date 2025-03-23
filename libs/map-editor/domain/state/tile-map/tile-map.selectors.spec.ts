import { TileMapEntity } from './tile-map.models';
import {
  tileMapAdapter,
  TileMapPartialState,
  initialTileMapState,
} from './tile-map.reducer';
import * as TileMapSelectors from './tile-map.selectors';

describe('TileMap Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getTileMapId = (it: TileMapEntity) => it.id;
  const createTileMapEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as TileMapEntity);

  let state: TileMapPartialState;

  beforeEach(() => {
    state = {
      tileMap: tileMapAdapter.setAll(
        [
          createTileMapEntity('PRODUCT-AAA'),
          createTileMapEntity('PRODUCT-BBB'),
          createTileMapEntity('PRODUCT-CCC'),
        ],
        {
          ...initialTileMapState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('TileMap Selectors', () => {
    it('selectAllTileMap() should return the list of TileMap', () => {
      const results = TileMapSelectors.selectAllTileMap(state);
      const selId = getTileMapId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = TileMapSelectors.selectEntity(state) as TileMapEntity;
      const selId = getTileMapId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectTileMapLoaded() should return the current "loaded" status', () => {
      const result = TileMapSelectors.selectTileMapLoaded(state);

      expect(result).toBe(true);
    });

    it('selectTileMapError() should return the current "error" state', () => {
      const result = TileMapSelectors.selectTileMapError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
