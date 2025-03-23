import { Store } from '@ngrx/store';
import { domainEventActions } from '@homm3boardgame/domain/state';
import { inject } from '@angular/core';
import { SettingsFacade } from '../../../state/settings/settings.facade';
import { TileMapFacade } from '../../../state/tile-map/tile-map.facade';
import {
  TileBaseData,
  TileMapStore,
} from '../../../state/tile-map/tile-map.reducer';
import { Tile } from '../../../../util/types/tile';

export class PlaceTownPass {
  private store = inject(Store);
  private settings = inject(SettingsFacade);
  private signalStore = inject(TileMapStore);
  public run() {
    this.placeStartingTowns();
  }

  private placeStartingTowns() {
    const playerCount = this.settings.playerCount();
    const townList: Tile[] = this.signalStore.tileList();
    let possibleTownTiles: Tile[] = [];

    // @ts-ignore
    if (playerCount === 1) {
      const furthestPoints = this.getFurthestTwoPoints(townList);
      possibleTownTiles.push(furthestPoints.tileOne);
    } else if (playerCount === 2) {
      const furthestPoints = this.getFurthestTwoPoints(townList);
      possibleTownTiles.push(furthestPoints.tileOne);
      possibleTownTiles.push(furthestPoints.tileTwo);
    } else {
      possibleTownTiles = this.getKFurthestPoints(playerCount, townList);
    }

    for (let i = 0; i < playerCount && i < possibleTownTiles.length; i++) {
      possibleTownTiles[i].tileId = 'S0';
      this.signalStore.updateTile(possibleTownTiles[i]);
    }
  }

  private getFurthestTwoPoints(tileList: Tile[]) {
    let furthest: any = {
      distance: 0,
      tileOne: {},
      tileTwo: {},
    };
    tileList.forEach((tile) => {
      tileList.forEach((otherTile) => {
        if (tile.id === otherTile.id) {
          return;
        }

        const dist = this.distance(
          tile.row,
          otherTile.row,
          tile.col,
          otherTile.col
        );
        if (dist > furthest.distance) {
          furthest = {
            distance: dist,
            tileOne: tile,
            tileTwo: otherTile,
          };
        }
      });
    });
    return furthest;
  }

  distance(x1: number, x2: number, y1: number, y2: number) {
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

  getKFurthestPoints(k: number, tileList: Tile[]) {
    // const data = {
    //   k,
    //   tileList,
    //   walkable: this.generateWalkableCellsList(tileList),
    // };

    // CALL UPON WEBWORKER TO DO THE MATH
    // this.randomMapGeneratorWorker.postMessage(data);

    console.time('Time Spend');
    const choose = function (arr: any, k: any, prefix: any = []) {
      if (k == 0) return [prefix];
      return arr.flatMap((v: any, i: any) =>
        choose(arr.slice(i + 1), k - 1, [...prefix, v])
      );
    };
    const walkable = this.generateWalkableCellsList(tileList);
    const indexes = [...Array(tileList.length).keys()];
    const pairs = choose(indexes, k);

    let fastSearch = false;
    if (pairs.length > 5000) {
      fastSearch = true;
    }

    const listOfDistancesOfPairs = pairs.map((indexSet: any) => {
      const pairOptions = choose(indexSet, 2);
      // total, lowest
      const totalDist = pairOptions.reduce(
        (acc: any, set: any) => {
          let setDist;
          if (fastSearch) {
            // Fast but not best placement
            setDist = this.distance(
              tileList[set[0]].row,
              tileList[set[1]].row,
              tileList[set[0]].col,
              tileList[set[1]].col
            );
          } else {
            // SLOW but better
            setDist = this.walkDistance(
              tileList[set[0]].row,
              tileList[set[1]].row,
              tileList[set[0]].col,
              tileList[set[1]].col,
              walkable
            );
          }

          acc.total += setDist;
          if (acc.minimumDistance === -1 || acc.minimumDistance > setDist) {
            acc.minimumDistance = setDist;
          }
          return acc;
        },
        {
          total: 0,
          minimumDistance: -1,
          set: [],
        }
      );
      totalDist.set = indexSet;
      return totalDist;
    });
    // get highest minimumDistance
    const highestMinimumDistance = listOfDistancesOfPairs.reduce(
      (acc: any, curr: any) => {
        if (curr.minimumDistance > acc) {
          return curr.minimumDistance;
        }
        return acc;
      },
      0
    );

    const pairsWithHighestMinimumDistance = listOfDistancesOfPairs.filter(
      (set: any) => set.minimumDistance === highestMinimumDistance
    );
    pairsWithHighestMinimumDistance.sort((a: any, b: any) => {
      return b.total - a.total;
    });

    console.timeEnd('Time Spend');
    console.log(k, tileList, pairsWithHighestMinimumDistance);

    return pairsWithHighestMinimumDistance[0].set.map((index: any) => {
      return tileList[index];
    });
  }

  walkDistance(x1: any, x2: any, y1: any, y2: any, cellMap: any) {
    const walkable = cellMap;
    const start = x1 + '.' + y1;
    const end = x2 + '.' + y2;

    const frontier: any = [];
    frontier.push(start);
    const reached = new Map();
    reached.set(start, '');

    let steps = 0;
    while (frontier.length > 0) {
      steps++;
      const current = frontier.shift();
      const pos = current.split('.').map((a: any) => {
        return Number(a);
      });
      const row = pos[0];
      const col = pos[1];
      this.getCellNeighbours(row, col).forEach((next) => {
        if (!reached.has(next) && walkable.has(next)) {
          frontier.push(next);
          reached.set(next, current);
        }
      });
      if (current === end) {
        break;
      }
    }

    const getSteps = function (start: any, end: any, cameFrom: any) {
      let current = end;
      const path: any[] = [];
      while (current !== start) {
        path.push(current);
        current = cameFrom.get(current);
      }
      return path.length;
    };
    return getSteps(start, end, reached);
  }

  generateWalkableCellsList(tileList: Tile[]) {
    const walkableCells = new Set();
    tileList?.forEach((tile) => {
      const cells = this.getCellNeighbours(tile.row, tile.col);
      walkableCells.add(tile.row + '.' + tile.col);
      cells.forEach((cell, index) => {
        walkableCells.add(cell);
      });
    });
    return walkableCells;
  }

  getCellNeighbours(row: number, col: number): string[] {
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
}
