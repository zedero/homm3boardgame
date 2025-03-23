import { Store } from '@ngrx/store';
import { domainEventActions } from '@homm3boardgame/domain/state';
import { inject } from '@angular/core';
import { SettingsFacade } from '../../../state/settings/settings.facade';
import { TileMapFacade } from '../../../state/tile-map/tile-map.facade';
import {
  TileBaseData,
  TileMapStore,
} from '../../../state/tile-map/tile-map.reducer';

export class SetupPass {
  private store = inject(Store);
  private settings = inject(SettingsFacade);
  private signalStore = inject(TileMapStore);

  private rows = this.settings.rows;
  private columns = this.settings.columns;

  public run() {
    this.setup();
  }

  private setup() {
    const playerCount = this.settings.playerCount();
    const mapSize = this.settings.mapSize();

    if (mapSize === 'SMALL') {
      this.signalStore.setGrid(11, 11);
    }
    if (mapSize === 'MEDIUM') {
      this.signalStore.setGrid(15, 15);
    }
    if (mapSize === 'LARGE') {
      this.signalStore.setGrid(20, 20);
    }
  }
}
