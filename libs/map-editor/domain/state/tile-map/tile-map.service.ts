import { effect, inject, Injectable, signal } from '@angular/core';
import { BASE_TILE, Tile, TileHexArray } from '../../../util/types/tile';
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
        // this.updateTileListData(selectedMap);
        this.signalStore.setTileList(this.updateTileListData(selectedMap));
      }

      const grid = JSON.parse(data)['grid'];
      if (grid) {
        this.signalStore.setGrid(grid.rows, grid.columns);
      }
    }
  }

  updateTileListData(tileList: Tile[]) {
    const updatedTileList = tileList.map((tile) => {
      return {
        ...BASE_TILE,
        ...tile,
      };
    });

    // make sure that the 0 for heroes in the old format is converted to string
    return updatedTileList.map((tile) => {
      const hero = tile.hero.map((hero) => {
        // @ts-ignore
        if (hero === 0) {
          return '';
        }
        return hero;
      }) as TileHexArray<string>;
      return {
        ...tile,
        hero,
      };
    });
  }

  isValid() {
    const tileList = this.signalStore.tileList();
    const walkable = this.generateWalkableCellsList(tileList);

    if (!tileList.length) {
      return true;
    }

    const teleportLinks = this.generateTeleportLinks(tileList);
    const start = tileList[0].row + '.' + tileList[0].col;
    const frontier: string[] = [start];
    const reached = new Set<string>([start]);

    while (frontier.length > 0) {
      const current = frontier.shift() as string;
      const pos = current.split('.').map((a: string) => Number(a));
      const row = pos[0];
      const col = pos[1];

      const normalNeighbours = this.getCellNeighbours(row, col);
      const teleportNeighbours = [...(teleportLinks.get(current) ?? [])];

      [...normalNeighbours, ...teleportNeighbours].forEach((next: string) => {
        if (!reached.has(next) && walkable.has(next)) {
          frontier.push(next);
          reached.add(next);
        }
      });
    }

    return reached.size === walkable.size;
  }

  generateWalkableCellsList(tileList: Tile[]) {
    const walkableCells = new Set<string>();

    // Cell layout inside one physical tile:
    //       0   1
    //     2   3   4
    //       5   6
    //
    // Six-value legacy blocked arrays are clockwise, beginning at upper-right.
    // Seven-value Sea/Subterranean arrays are field-index based.
    const EDGE_CELL_INDEX_BY_SIDE = [1, 4, 6, 5, 2, 0];

    tileList.forEach((tile) => {
      const rawBlocked = this.config.TILES()[tile.tileId]?.blocked ?? [];
      const staticBlockedBySide =
        rawBlocked.length === 7
          ? EDGE_CELL_INDEX_BY_SIDE.map((cellIndex) => !!rawBlocked[cellIndex])
          : Array.from({ length: 6 }, (_, index) => !!rawBlocked[index]);

      const cells = this.getCellNeighbours(tile.row, tile.col);
      walkableCells.add(tile.row + '.' + tile.col);

      cells.forEach((cell: string, worldSideIndex: number) => {
        const localSideIndex = (worldSideIndex + 6 - tile.rotation) % 6;
        const fieldIndex = EDGE_CELL_INDEX_BY_SIDE[localSideIndex];

        const hasReplacement =
          !!tile.creaturebanks?.[fieldIndex] ||
          !!tile.mapLocations?.[fieldIndex];
        const manuallyBlocked = !!tile.blockedHex?.[fieldIndex];
        const staticallyBlocked = staticBlockedBySide[localSideIndex];

        // For structural map validity, a replacement supersedes the printed or
        // manually blocked field at that edge.
        if (hasReplacement || (!staticallyBlocked && !manuallyBlocked)) {
          walkableCells.add(cell);
        }
      });
    });

    return walkableCells;
  }

  generateTeleportLinks(tileList: Tile[]) {
    const links = new Map<string, Set<string>>();
    const groups = new Map<string, Set<string>>();

    const addToGroup = (group: string, tile: Tile) => {
      if (!groups.has(group)) {
        groups.set(group, new Set<string>());
      }
      groups.get(group)?.add(tile.row + '.' + tile.col);
    };

    tileList.forEach((tile) => {
      (tile.mapLocations ?? []).forEach((location) => {
        if (!location) {
          return;
        }

        const twoWay = location.match(/^monolith-2w-(\d{2})[ab]$/);
        if (twoWay) {
          addToGroup(`monolith-2w-${twoWay[1]}`, tile);
          return;
        }

        const oneWay = location.match(/^monolith-1w-(\d{2})-(?:in|out)$/);
        if (oneWay) {
          // isValid() is a structural connectivity check. Because its start tile
          // is arbitrary, one-way pairs are treated as weak/undirected links here.
          addToGroup(`monolith-1w-${oneWay[1]}`, tile);
          return;
        }

        if (location.startsWith('whirlpool-')) {
          // Every Whirlpool can lead to another Whirlpool; the die determines
          // which target is used during actual play.
          addToGroup('whirlpool-network', tile);
        }
      });
    });

    const addLink = (from: string, to: string) => {
      if (from === to) {
        return;
      }
      if (!links.has(from)) {
        links.set(from, new Set<string>());
      }
      links.get(from)?.add(to);
    };

    groups.forEach((positions) => {
      const nodes = [...positions];
      for (const from of nodes) {
        for (const to of nodes) {
          addLink(from, to);
        }
      }
    });

    return links;
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
