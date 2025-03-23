export interface Tile {
  row: number;
  col: number;
  id: string;
  tileId: string;
  cubes: number[];
  hero: string[];
  rotation: number;
}
