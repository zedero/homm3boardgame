export type TileHexArray<T> = [T, T, T, T, T, T, T];

export interface Tile {
  row: number;
  col: number;
  id: string;
  tileId: string;
  cubes: TileHexArray<number>;
  hero: TileHexArray<string>;
  rotation: number;
  suggestedPlacement: boolean;
  // showBlockedField: TileHexArray<boolean>;
}

export const BASE_TILE: Tile = {
  row: 0,
  col: 0,
  tileId: 'PLACEHOLDER',
  id: '',
  cubes: [0, 0, 0, 0, 0, 0, 0],
  hero: ['', '', '', '', '', '', ''],
  rotation: 0,
  suggestedPlacement: true,
  // showBlockedField: [false, false, false, false, false, false, false],
};
