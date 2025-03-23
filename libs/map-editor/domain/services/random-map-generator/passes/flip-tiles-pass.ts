import { inject } from '@angular/core';
import { SettingsFacade } from '../../../state/settings/settings.facade';
import { TileMapStore } from '../../../state/tile-map/tile-map.reducer';
import { Tile } from '../../../../util/types/tile';
import { DataConfigService } from '@homm3boardgame/config';
import { TileMapService } from '../../../state/tile-map/tile-map.service';

export class FlipTilesPass {
  private settings = inject(SettingsFacade);
  private signalStore = inject(TileMapStore);
  private config = inject(DataConfigService);
  private tileMapService = inject(TileMapService);

  public run() {
    this.flip();
  }

  private flip() {
    const towns: string[] = this.getTileIDByGroupFilteredBySelectedExpansions(
      this.config.GROUP()['STARTINGTILE']
    );
    const center: string[] = this.getTileIDByGroupFilteredBySelectedExpansions(
      this.config.GROUP()['CENTER']
    );
    const near: string[] = this.getTileIDByGroupFilteredBySelectedExpansions(
      this.config.GROUP()['NEAR']
    );
    const far: string[] = this.getTileIDByGroupFilteredBySelectedExpansions(
      this.config.GROUP()['FAR']
    );

    const townsFlipped = this.settings.townsFlipped();
    const centerFlipped = this.settings.centerTilesFlipped();
    const farFlipped = this.settings.farTilesFlipped();
    const nearFlipped = this.settings.nearTilesFlipped();

    const tileList = [...this.signalStore.tileList()];

    tileList.map((tile: Tile) => {
      if (townsFlipped && towns.length > 0) {
        if (tile.tileId === 'S0') {
          const pick = towns.splice(this.random(0, towns.length - 1), 1)[0];
          this.flipAndValidate(tile, pick);
        }
      }

      if (centerFlipped && center.length > 0) {
        if (tile.tileId === 'C0') {
          const pick = center.splice(this.random(0, center.length - 1), 1)[0];
          this.flipAndValidate(tile, pick);
        }
      }

      if (nearFlipped && near.length > 0) {
        if (tile.tileId === 'N0') {
          const pick = near.splice(this.random(0, near.length - 1), 1)[0];
          this.flipAndValidate(tile, pick);
        }
      }

      if (farFlipped && far.length > 0) {
        if (tile.tileId === 'F0') {
          const pick = far.splice(this.random(0, far.length - 1), 1)[0];
          this.flipAndValidate(tile, pick);
        }
      }
    });
  }

  private flipAndValidate(tile: Tile, tileId: string) {
    this.signalStore.updateTile({
      ...tile,
      tileId,
    });

    for (let i = 1; i < 6; i++) {
      if (this.tileMapService.isValid()) {
        break;
      }
      this.signalStore.updateTile({
        ...tile,
        tileId,
        rotation: i,
      });
    }
  }

  private getTileIDByGroupFilteredBySelectedExpansions(group: number) {
    const filterOptions = this.settings.filterSettings();

    const list = Object.entries(filterOptions)
      .filter(([key, value]) => key !== 'RANDOM' && value)
      .map(([key, value]) => {
        return this.config.EXPANSION()[key];
      });

    const selectedExpansions = new Set(list);

    return this.getTilesByGroup(group)
      .filter((tile: any) => {
        return selectedExpansions.has(tile.expansionID);
      })
      .map((tile: any) => {
        return tile.id;
      });
  }

  private getTileIDByGroup(group: number) {
    return this.getTilesByGroup(group).map((tile: any) => {
      return tile.id;
    });
  }

  private getTilesByGroup(group: number) {
    return Object.values(this.config.TILES()).filter((tile: any) => {
      return tile.group === group;
    });
  }

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
