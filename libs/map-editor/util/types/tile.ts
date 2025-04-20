export type FieldArray<T> = [T, T, T, T, T, T, T];

export interface Tile {
  row: number;
  col: number;
  id: string;
  tileId: string;
  cubes: FieldArray<number>;
  hero: FieldArray<string>;
  rotation: number;
  isSuggestion: boolean;
  showBlockedField: FieldArray<0 | 1>;
}

export const BASE_TILE: Tile = {
  row: 0,
  col: 0,
  tileId: 'PLACEHOLDER',
  id: '',
  cubes: [0, 0, 0, 0, 0, 0, 0],
  hero: ['', '', '', '', '', '', ''],
  rotation: 0,
  isSuggestion: false,
  showBlockedField: [0, 0, 0, 0, 0, 0, 0],
};
