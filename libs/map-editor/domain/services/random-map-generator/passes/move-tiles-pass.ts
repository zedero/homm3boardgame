import { inject } from '@angular/core';
import { TileMapService } from '../../../state/tile-map/tile-map.service';

export class MoveTilesPass {
  private tileMapService = inject(TileMapService);

  public run() {
    for (let i = 0; i < 20; i++) {
      this.tileMapService.moveAllUpRight();
    }
    for (let i = 0; i < 20; i++) {
      this.tileMapService.moveAllUpLeft();
    }
    for (let i = 0; i < 30; i++) {
      this.tileMapService.moveAllLeft();
    }
  }
}
