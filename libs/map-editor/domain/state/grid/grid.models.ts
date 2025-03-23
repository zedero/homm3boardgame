/**
 * Interface for the 'Grid' data
 */
export interface GridEntity {
  id: string | number; // Primary ID
  name: string;
}

export interface Position {
  row: number;
  col: number;
}
