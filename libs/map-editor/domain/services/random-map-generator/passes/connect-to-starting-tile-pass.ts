import { inject } from '@angular/core';
import { TileMapStore } from '../../../state/tile-map/tile-map.reducer';
import { Tile } from 'libs/map-editor/util/types/tile';

export class ConnectToStartingTilePass {
  private signalStore = inject(TileMapStore);

  public run() {
    this.connect();
  }

  private connect() {
    this.placeFar();
    this.placeNear();
    this.placeCenter();
  }

  placeFar() {
    const tiles = [...this.signalStore.tileList()];
    const towns = tiles.filter((tile: Tile) => tile.tileId === 'S0'); // Ensure a boolean is returned

    towns.forEach((town) => {
      const neighbours = this.getNeighbours(tiles, [town]).filter(
        (tile) => tile.tileId === 'PLACEHOLDER'
      );
      const randomNeighbour = this.random(0, neighbours.length - 1);
      this.signalStore.updateTile({
        ...neighbours[randomNeighbour],
        tileId: 'F0',
      });
    });
  }

  placeNear() {
    const tiles = [...this.signalStore.tileList()];
    const farTiles = tiles.filter((tile: Tile) => tile.tileId === 'F0');

    farTiles.forEach((town) => {
      const neighbours = this.getNeighbours(tiles, [town]).filter(
        (tile) => tile.tileId === 'PLACEHOLDER'
      );
      const tile = neighbours[0];
      //   .find(
      //   (neighbour) => neighbour.tileId !== 'S0' && neighbour.tileId !== 'F0'
      // );
      if (!tile) {
        console.log('No valid neighbours', neighbours, tile);
        return;
      }

      this.signalStore.updateTile({
        ...tile,
        tileId: 'N0',
      });
    });
  }

  placeCenter() {
    const mostMid = this.getMostCenterTileFromTowns();
    if (mostMid) {
      this.signalStore.updateTile({
        ...mostMid.tile,
        tileId: 'C0',
      });
    }
  }

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getNeighbours(tiles: Tile[], towns: Tile[]) {
    const neighbours: Tile[] = [];
    towns.forEach((town) => {
      tiles.forEach((tile) => {
        if (town.id !== tile.id) {
          const distance = this.distance(
            town.row,
            tile.row,
            town.col,
            tile.col
          );
          if (distance <= 3) {
            neighbours.push(tile);
          }
        }
      });
    });
    return neighbours;
  }

  private distance(x1: number, x2: number, y1: number, y2: number) {
    // calculate offset to cube
    var q = y1 - (x1 - (x1 & 1)) / 2;
    var r = x1;
    const s = -q - r;

    var q2 = y2 - (x2 - (x2 & 1)) / 2;
    var r2 = x2;
    const s2 = -q2 - r2;

    // cube coordinates to distance
    return (Math.abs(q - q2) + Math.abs(r - r2) + Math.abs(s - s2)) / 2;
  }

  getMostCenterTileFromTowns() {
    const tiles: Tile[] = [...this.signalStore.tileList()];
    const walkable = this.generateWalkableCellsList(tiles);
    const townTiles = tiles.filter((tile) => tile.tileId === 'S0');
    const remainingTiles = tiles.filter(
      (tile) => tile.tileId === 'PLACEHOLDER'
    );

    const calcDistanceToTowns = remainingTiles.map((tile: Tile) => {
      const t = townTiles.reduce(
        (acc, town) => {
          const distance = this.walkDistance(
            tile.row,
            town.row,
            tile.col,
            town.col,
            walkable
          );
          acc.total = acc.total + distance;
          if (distance > acc.max) acc.max = distance;
          if (acc.minimum === -1 || distance < acc.minimum) {
            acc.minimum = distance;
          }
          return acc;
        },
        {
          total: 0,
          minimum: -1,
          max: 0,
          id: tile.row + '.' + tile.col,
          worth: 0,
          tile: tile,
        }
      );
      return t;
    });

    // asign worth based on minimum distance
    calcDistanceToTowns
      .sort((a, b) => {
        return a.minimum - b.minimum;
      })
      .forEach((tile, index) => {
        tile.worth += index;
      });

    // asign worth based on max distance
    calcDistanceToTowns
      .sort((a, b) => {
        return b.max - a.max;
      })
      .forEach((tile, index) => {
        tile.worth += index;
      });

    // asign worth based on total distances
    calcDistanceToTowns
      .sort((a, b) => {
        return b.total - a.total;
      })
      .forEach((tile, index) => {
        tile.worth += index;
      });

    // sort by worth
    calcDistanceToTowns.sort((a, b) => {
      return b.worth - a.worth;
    });

    // console.log(calcDistanceToTowns)

    return calcDistanceToTowns[0];
  }

  generateWalkableCellsList(tileList: Tile[]) {
    const walkableCells: Set<string> = new Set();
    tileList?.forEach((tile) => {
      const cells = this.getCellNeighbours(tile.row, tile.col);
      walkableCells.add(tile.row + '.' + tile.col);
      cells.forEach((cell: string, index: number) => {
        walkableCells.add(cell);
      });
    });
    return walkableCells;
  }

  walkDistance(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    cellMap: Set<string>
  ) {
    const walkable = cellMap;
    const start = x1 + '.' + y1;
    const end = x2 + '.' + y2;

    const frontier: string[] = [];
    frontier.push(start);
    const reached = new Map();
    reached.set(start, '');
    let steps = 0;
    while (frontier.length > 0) {
      steps++;
      const current = frontier.shift();
      if (!current) {
        break; // Ensure we exit the loop if current is undefined
      }
      const pos = current.split('.').map((a: string) => {
        return Number(a);
      });
      const row = pos[0];
      const col = pos[1];
      this.getCellNeighbours(row, col).forEach((next: string) => {
        if (!reached.has(next) && walkable.has(next)) {
          frontier.push(next);
          reached.set(next, current);
        }
      });
      if (current === end) {
        break;
      }
    }

    const getSteps = function (
      start: string,
      end: string,
      cameFrom: Map<string, string>
    ) {
      let current = end;
      const path: string[] = [];
      while (current !== start) {
        path.push(current);
        current = cameFrom.get(current) as string;
      }
      return path.length;
    };
    return getSteps(start, end, reached);
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
    const neighbours: string[] = [];
    oddr_direction_differences[parity].forEach((nb, index) => {
      const diff = oddr_direction_differences[parity][index];
      neighbours.push(row + diff[1] + '.' + (col + diff[0]));
    });
    return neighbours;
  }
}
