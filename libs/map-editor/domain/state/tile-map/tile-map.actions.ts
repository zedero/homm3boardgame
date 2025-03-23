import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { TileMapEntity } from './tile-map.models';
import { Tile } from '../../../util/types/tile';

export const initTileMap = createAction('[TileMap Page] Init');

export const loadTileMapSuccess = createAction(
  '[TileMap/API] Load TileMap Success',
  props<{ tileMap: TileMapEntity[] }>()
);

export const loadTileMapFailure = createAction(
  '[TileMap/API] Load TileMap Failure',
  props<{ error: any }>()
);

export const domainEventActions = createActionGroup({
  source: 'tile map',
  events: {
    'generate image': emptyProps(),
    'generate random map': emptyProps(),
  },
});
