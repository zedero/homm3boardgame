export type TileHexArray<T> = [T, T, T, T, T, T, T];

export interface Tile {
  row: number;
  col: number;
  id: string;
  tileId: string;
  cubes: TileHexArray<number>;
  creaturebanks: TileHexArray<string>;
  hero: TileHexArray<string>;
  rotation: number;
  suggestedPlacement: boolean;
  blockedHex: TileHexArray<boolean>;
  faction: string;
}

export const BASE_TILE: Tile = {
  row: 0,
  col: 0,
  tileId: 'PLACEHOLDER',
  id: '',
  cubes: [0, 0, 0, 0, 0, 0, 0],
  creaturebanks: ['', '', '', '', '', '', ''],
  hero: ['', '', '', '', '', '', ''],
  rotation: 0,
  suggestedPlacement: false,
  blockedHex: [false, false, false, false, false, false, false],
  faction: '',
};
