import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { SettingsFacade } from '../../../state/settings/settings.facade';
import { TileMapStore } from '../../../state/tile-map/tile-map.reducer';
import { DataConfigService } from '@homm3boardgame/config';

export class ReplacePlaceholderTilesPass {
  private settings = inject(SettingsFacade);
  private signalStore = inject(TileMapStore);
  private config = inject(DataConfigService);

  public run() {
    this.replace();
  }

  private replace() {
    const totals = this.getTotalAvailableTiles();
    const countPlaceholders = this.count('PLACEHOLDER');

    if (countPlaceholders === 0) {
      console.log('NO PLACEHOLDERS');
      return;
    }
    const farArr = new Array(totals.FAR - this.count('F0')).fill('F0');
    const nearArr = new Array(totals.NEAR - this.count('N0')).fill('N0');
    const placeable = [...farArr, ...nearArr];

    this.signalStore.tileList().map((tile) => {
      if (tile.tileId === 'PLACEHOLDER' && placeable.length) {
        const pick = placeable.splice(
          this.random(0, placeable.length - 1),
          1
        )[0];
        this.signalStore.updateTile({
          ...tile,
          tileId: pick,
        });
      }
      return tile;
    });
  }

  private getTotalAvailableTiles() {
    const filterOptions = this.settings.filterSettings();
    const totals = {
      TOWN: 0,
      FAR: 0,
      NEAR: 0,
      CENTER: 0,
      TOTAL: 0,
    };
    Object.entries(filterOptions).forEach(([key, val]) => {
      if (!val) {
        return;
      }
      const content = this.config.EXPANSION_CONTENTS()[key];
      totals.TOWN += content.TOWN;
      totals.FAR += content.FAR;
      totals.NEAR += content.NEAR;
      totals.CENTER += content.CENTER;
      totals.TOTAL +=
        content.TOWN + content.FAR + content.NEAR + content.CENTER;
    });
    totals.TOWN -= this.count('S0');
    totals.FAR -= this.count('F0');
    totals.NEAR -= this.count('N0');
    totals.CENTER -= this.count('C0');
    totals.TOTAL = totals.TOWN + totals.FAR + totals.NEAR + totals.CENTER;
    return totals;
  }

  private count = (ID: string) => {
    return this.signalStore.tileList().reduce((acc, current) => {
      if (current.tileId === ID) {
        acc++;
      }
      return acc;
    }, 0);
  };

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
