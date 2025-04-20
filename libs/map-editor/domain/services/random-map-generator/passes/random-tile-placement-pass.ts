import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { SettingsFacade } from '../../../state/settings/settings.facade';
import {
  TileBaseData,
  TileMapStore,
} from '../../../state/tile-map/tile-map.reducer';

export class RandomTilePlacementPass {
  private store = inject(Store);
  private settings = inject(SettingsFacade);
  private signalStore = inject(TileMapStore);

  private rows = this.signalStore.grid.rows;
  private columns = this.signalStore.grid.columns;

  public run() {
    this.clearMap();
    this.placeRandomTile();
    this.generateConnectedRandomMap();
  }
  private clearMap() {
    this.signalStore.setTileList([]);
  }

  private placeRandomTile() {
    const randomRow = this.random(1, this.rows() - 2);
    const randomColumn = this.random(2, this.columns() - 1);
    this.placeTile(randomRow, randomColumn);
  }

  private placeTile(row: number, column: number) {
    const tile: TileBaseData = {
      row,
      column,
      tileId: 'PLACEHOLDER',
    };
    this.signalStore.addTile(tile);
  }

  private generateConnectedRandomMap() {
    const maxTiles = this.getMaxTiles();

    let tilesPlaced = 1;
    let connected = this.getConnectedTilesMap();

    while (connected.size && tilesPlaced < maxTiles) {
      tilesPlaced++;
      const pick: string = [...connected][
        Math.floor(Math.random() * connected.size)
      ];
      const pos = pick.split('.').map((a) => {
        return Number(a);
      });
      const row = pos[0];
      const col = pos[1];
      this.placeTile(row, col);
      connected = this.getConnectedTilesMap();
    }
  }

  getConnectedTilesMap(): Set<string> {
    const maxRows = this.rows();
    const maxCols = this.columns();
    let connected: Set<string> = new Set();
    const addConnectedWithinBounds = (
      row: number,
      col: number,
      increasedChance: 0 | 1 = 0
    ) => {
      if (row < 1 || row >= maxRows - 1) {
        return;
      }

      if (this.isEven(row)) {
        if (col < 2 || col >= maxCols - 1) {
          return;
        }
      } else {
        if (col < 1 || col >= maxCols - 1) {
          return;
        }
      }
      increasedChance = 0;
      for (let i = 0; i <= increasedChance; i++) {
        connected.add(`${row}.${col}` + '.'.repeat(i));
      }
    };

    this.signalStore.tileList().forEach((tile) => {
      if (this.isEven(tile.row)) {
        addConnectedWithinBounds(tile.row - 3, tile.col - 2);
        addConnectedWithinBounds(tile.row - 3, tile.col - 1, 1);
        addConnectedWithinBounds(tile.row - 3, tile.col, 1);
        addConnectedWithinBounds(tile.row - 3, tile.col + 1);

        addConnectedWithinBounds(tile.row + 3, tile.col - 2);
        addConnectedWithinBounds(tile.row + 3, tile.col - 1, 1);
        addConnectedWithinBounds(tile.row + 3, tile.col, 1);
        addConnectedWithinBounds(tile.row + 3, tile.col + 1);

        addConnectedWithinBounds(tile.row - 2, tile.col - 2, 1);
        addConnectedWithinBounds(tile.row - 1, tile.col - 3, 1);
        addConnectedWithinBounds(tile.row, tile.col - 3);
        addConnectedWithinBounds(tile.row + 1, tile.col - 3, 1);
        addConnectedWithinBounds(tile.row + 2, tile.col - 2, 1);

        addConnectedWithinBounds(tile.row - 2, tile.col + 2, 1);
        addConnectedWithinBounds(tile.row - 1, tile.col + 2, 1);
        addConnectedWithinBounds(tile.row, tile.col + 3);
        addConnectedWithinBounds(tile.row + 1, tile.col + 2, 1);
        addConnectedWithinBounds(tile.row + 2, tile.col + 2, 1);
      } else {
        addConnectedWithinBounds(tile.row - 3, tile.col - 1);
        addConnectedWithinBounds(tile.row - 3, tile.col, 1);
        addConnectedWithinBounds(tile.row - 3, tile.col + 1, 1);
        addConnectedWithinBounds(tile.row - 3, tile.col + 2);

        addConnectedWithinBounds(tile.row + 3, tile.col - 1);
        addConnectedWithinBounds(tile.row + 3, tile.col, 1);
        addConnectedWithinBounds(tile.row + 3, tile.col + 1, 1);
        addConnectedWithinBounds(tile.row + 3, tile.col + 2);

        addConnectedWithinBounds(tile.row - 2, tile.col - 2, 1);
        addConnectedWithinBounds(tile.row - 1, tile.col - 2, 1);
        addConnectedWithinBounds(tile.row, tile.col - 3);
        addConnectedWithinBounds(tile.row + 1, tile.col - 2, 1);
        addConnectedWithinBounds(tile.row + 2, tile.col - 2, 1);

        addConnectedWithinBounds(tile.row - 2, tile.col + 2, 1);
        addConnectedWithinBounds(tile.row - 1, tile.col + 3, 1);
        addConnectedWithinBounds(tile.row, tile.col + 3);
        addConnectedWithinBounds(tile.row + 1, tile.col + 3, 1);
        addConnectedWithinBounds(tile.row + 2, tile.col + 2, 1);
      }
    });

    const blockedCells = this.generateBlockedCellsList();
    connected = this.difference(connected, blockedCells);
    const increasedChangeSet = this.createIncreasedChanceSet(blockedCells);
    connected = this.difference(connected, increasedChangeSet);
    return connected;
  }

  private createIncreasedChanceSet(set: Set<string>): Set<string> {
    let newSet: Set<string> = new Set();
    set.forEach((elem) => newSet.add(elem + '.'));
    return newSet;
  }

  generateBlockedCellsList(excludeGuid?: string): Set<string> {
    const blockedCells: Set<string> = new Set();
    this.signalStore.tileList().forEach((tile) => {
      if (tile.id === excludeGuid) {
        return;
      }
      blockedCells.add(`${tile.row}.${tile.col}`);
      blockedCells.add(`${tile.row}.${tile.col - 1}`);
      blockedCells.add(`${tile.row}.${tile.col + 1}`);

      blockedCells.add(`${tile.row}.${tile.col - 2}`);
      blockedCells.add(`${tile.row}.${tile.col + 2}`);
      if (this.isEven(tile.row)) {
        blockedCells.add(`${tile.row - 1}.${tile.col - 1}`);
        blockedCells.add(`${tile.row - 1}.${tile.col}`);
        blockedCells.add(`${tile.row + 1}.${tile.col - 1}`);
        blockedCells.add(`${tile.row + 1}.${tile.col}`);

        blockedCells.add(`${tile.row - 1}.${tile.col - 2}`);
        blockedCells.add(`${tile.row - 1}.${tile.col + 1}`);
        blockedCells.add(`${tile.row + 1}.${tile.col - 2}`);
        blockedCells.add(`${tile.row + 1}.${tile.col + 1}`);

        blockedCells.add(`${tile.row - 2}.${tile.col - 1}`);
        blockedCells.add(`${tile.row - 2}.${tile.col}`);
        blockedCells.add(`${tile.row - 2}.${tile.col + 1}`);
        blockedCells.add(`${tile.row + 2}.${tile.col - 1}`);
        blockedCells.add(`${tile.row + 2}.${tile.col}`);
        blockedCells.add(`${tile.row + 2}.${tile.col + 1}`);
      } else {
        blockedCells.add(`${tile.row - 1}.${tile.col}`);
        blockedCells.add(`${tile.row - 1}.${tile.col + 1}`);
        blockedCells.add(`${tile.row + 1}.${tile.col}`);
        blockedCells.add(`${tile.row + 1}.${tile.col + 1}`);

        blockedCells.add(`${tile.row - 1}.${tile.col - 1}`);
        blockedCells.add(`${tile.row - 1}.${tile.col + 2}`);
        blockedCells.add(`${tile.row + 1}.${tile.col - 1}`);
        blockedCells.add(`${tile.row + 1}.${tile.col + 2}`);

        blockedCells.add(`${tile.row - 2}.${tile.col - 1}`);
        blockedCells.add(`${tile.row - 2}.${tile.col}`);
        blockedCells.add(`${tile.row - 2}.${tile.col + 1}`);
        blockedCells.add(`${tile.row + 2}.${tile.col - 1}`);
        blockedCells.add(`${tile.row + 2}.${tile.col}`);
        blockedCells.add(`${tile.row + 2}.${tile.col + 1}`);
      }
    });
    // this.blockedCells = blockedCells;
    return blockedCells;
  }

  private isEven(n: number) {
    return n % 2 == 0;
  }

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private difference(s1: Set<string>, s2: Set<string>): Set<string> {
    let newSet: Set<string> = new Set();
    s1.forEach((elem) => newSet.add(elem));
    s2.forEach((elem) => newSet.delete(elem));
    return newSet;
  }

  private getMaxTiles() {
    let maxTiles = 0;
    const playerCount = this.settings.playerCount();
    const mapSize = this.settings.mapSize();
    if (mapSize === 'SMALL') {
      maxTiles = playerCount * 3 + this.random(0, 1);
    }
    if (mapSize === 'MEDIUM') {
      maxTiles = playerCount * 4 + this.random(0, 2);
    }
    if (mapSize === 'LARGE') {
      maxTiles = playerCount * 4 + this.random(4, 7);
    }
    return maxTiles;
  }
}
