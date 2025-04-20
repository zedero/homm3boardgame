import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import { Tile } from '../../../util/types/tile';
import { Store } from '@ngrx/store';
import { domainEventActions } from './tile-map.actions';
import { Grid, TileMapStore } from './tile-map.reducer';
import { DataConfigService } from '@homm3boardgame/config';

const storageKey = 'scenarioCreatorData';

@Injectable({
  providedIn: 'root',
})
export class TileMapService {
  private selectedMap = signal('default');
  private signalStore = inject(TileMapStore);
  private config = inject(DataConfigService);

  saveTileMap(tileList: Tile[], grid: Grid) {
    const save = {
      grid,
      default: tileList,
    };
    localStorage.setItem(storageKey, JSON.stringify(save));
  }

  loadTileMap() {
    const data = localStorage.getItem(storageKey);
    if (data) {
      const selectedMap = JSON.parse(data)?.[this.selectedMap()];
      if (selectedMap) {
        this.signalStore.setTileList(selectedMap);
      }

      const grid = JSON.parse(data)['grid'];
      if (grid) {
        this.signalStore.setGrid(grid.rows, grid.columns);
      }
    }
  }

  isValid() {
    const tileList = this.signalStore.tileList();
    const walkable = this.generateWalkableCellsList(tileList);
    if (!tileList.length) {
      console.log('EMPTY LIST');
      return true;
    }
    const start = tileList[0].row + '.' + tileList[0].col;

    const frontier: any = [];
    frontier.push(start);
    const reached = new Set();
    reached.add(start);

    while (frontier.length > 0) {
      const current = frontier.shift();
      const pos = current.split('.').map((a: any) => {
        return Number(a);
      });
      const row = pos[0];
      const col = pos[1];
      // console.log(row, col, this.getCellNeighbours(row, col));
      this.getCellNeighbours(row, col).forEach((next: any) => {
        if (!reached.has(next) && walkable.has(next)) {
          frontier.push(next);
          reached.add(next);
        }
      });
    }
    return reached.size === walkable.size;
  }

  generateWalkableCellsList(tileList: Tile[]) {
    const walkableCells = new Set();
    tileList.forEach((tile) => {
      let blockedList = this.config.TILES()[tile.tileId]?.blocked;
      if (!blockedList) {
        return;
      }
      // double the list for easier cell rotation calculation
      blockedList = [...blockedList, ...blockedList];
      const cells = this.getCellNeighbours(tile.row, tile.col);
      walkableCells.add(tile.row + '.' + tile.col);
      cells.forEach((cell: any, index: number) => {
        if (!blockedList[index + 6 - tile.rotation]) {
          walkableCells.add(cell);
        }
      });
    });
    return walkableCells;
  }

  getCellNeighbours(row: number, col: number) {
    const oddr_direction_differences = [
      // even rows
      [
        [0, -1],
        [+1, 0],
        [0, +1],
        [-1, +1],
        [-1, 0],
        [-1, -1],
      ],
      // odd rows
      [
        [+1, -1],
        [+1, 0],
        [+1, +1],
        [0, +1],
        [-1, 0],
        [0, -1],
      ],
    ];

    const parity = row & 1;
    const neighbours: any = [];
    oddr_direction_differences[parity].forEach((nb, index) => {
      const diff = oddr_direction_differences[parity][index];
      neighbours.push(row + diff[1] + '.' + (col + diff[0]));
    });
    return neighbours;
  }

  moveAllUpLeft() {
    const list = JSON.parse(
      JSON.stringify(this.signalStore.tileList())
    ) as Tile[];
    const lowestTopPos = list.reduce((acc, value) => {
      if (acc === -1 || value.row < acc) {
        return value.row;
      } else {
        return acc;
      }
    }, -1);

    const lowestLeftPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col < acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (lowestTopPos <= 1 || lowestLeftPos <= 2) {
      return;
    }

    list.map((tile: any) => {
      if (!(tile.row & 1)) {
        tile.col = tile.col - 1;
      }
      tile.row = tile.row - 1;
    });

    this.signalStore.setTileList(list);
  }

  moveAllUpRight() {
    const list = JSON.parse(
      JSON.stringify(this.signalStore.tileList())
    ) as Tile[];
    const lowestTopPos = list.reduce((acc, value) => {
      if (acc === -1 || value.row < acc) {
        return value.row;
      } else {
        return acc;
      }
    }, -1);

    const HighestRightPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col > acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (
      lowestTopPos <= 1 ||
      HighestRightPos >= this.signalStore.grid.rows() - 2
    ) {
      // TODO ADD RIGHT MAX CHECK
      return;
    }

    list.map((tile: any) => {
      if (tile.row & 1) {
        tile.col = tile.col + 1;
      }
      tile.row = tile.row - 1;
    });
    this.signalStore.setTileList(list);
  }

  moveAllLeft() {
    const list = JSON.parse(
      JSON.stringify(this.signalStore.tileList())
    ) as Tile[];
    const lowestLeftPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col < acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (lowestLeftPos <= 2) {
      return;
    }

    list.map((tile) => {
      tile.col = tile.col - 1;
    });
    this.signalStore.setTileList(list);
  }

  moveAllRight() {
    const list = JSON.parse(
      JSON.stringify(this.signalStore.tileList())
    ) as Tile[];
    const HighestRightPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col > acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (HighestRightPos >= this.signalStore.grid.rows() - 2) {
      return;
    }

    list.map((tile) => {
      tile.col = tile.col + 1;
    });
    this.signalStore.setTileList(list);
  }

  moveDownLeft() {
    const list = JSON.parse(
      JSON.stringify(this.signalStore.tileList())
    ) as Tile[];
    const highestTopPos = list.reduce((acc, value) => {
      if (acc === -1 || value.row > acc) {
        return value.row;
      } else {
        return acc;
      }
    }, -1);

    const lowestLeftPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col < acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (
      highestTopPos >= this.signalStore.grid.columns() - 2 ||
      lowestLeftPos <= 2
    ) {
      // TODO ADD RIGHT MAX CHECK
      return;
    }

    list.map((tile: any) => {
      if (!(tile.row & 1)) {
        tile.col = tile.col - 1;
      }
      tile.row = tile.row + 1;
    });
    this.signalStore.setTileList(list);
  }

  moveDownRight() {
    const list = JSON.parse(
      JSON.stringify(this.signalStore.tileList())
    ) as Tile[];
    const highestTopPos = list.reduce((acc, value) => {
      if (acc === -1 || value.row > acc) {
        return value.row;
      } else {
        return acc;
      }
    }, -1);

    const HighestRightPos = list.reduce((acc, value) => {
      if (acc === 0 || value.col > acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (
      highestTopPos >= this.signalStore.grid.columns() - 2 ||
      HighestRightPos >= this.signalStore.grid.rows() - 2
    ) {
      // TODO ADD RIGHT MAX CHECK
      return;
    }

    list.map((tile: any) => {
      if (tile.row & 1) {
        tile.col = tile.col + 1;
      }
      tile.row = tile.row + 1;
    });
    this.signalStore.setTileList(list);
  }

  constructor() {
    this.loadTileMap();
    effect(() => {
      this.saveTileMap(this.signalStore.tileList(), this.signalStore.grid());
    });
  }
}
