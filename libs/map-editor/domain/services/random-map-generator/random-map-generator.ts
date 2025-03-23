import { Injectable } from '@angular/core';
import { RandomTilePlacementPass } from './passes/random-tile-placement-pass';
import { PlaceTownPass } from './passes/place-town-pass';
import { ConnectToStartingTilePass } from './passes/connect-to-starting-tile-pass';
import { SetupPass } from './passes/setup-pass';
import { ReplacePlaceholderTilesPass } from './passes/replace-placeholder-tiles-pass';
import { FlipTilesPass } from './passes/flip-tiles-pass';
import { MoveTilesPass } from './passes/move-tiles-pass';

@Injectable({
  providedIn: 'root',
})
export class RandomMapGeneratorService {
  private randomTilePlacementPass = new RandomTilePlacementPass();
  private placeTownPass = new PlaceTownPass();
  private connectToStartingTilePass = new ConnectToStartingTilePass();
  private setupPass = new SetupPass();
  private replacePlaceholderTilesPass = new ReplacePlaceholderTilesPass();
  private flipTilesPass = new FlipTilesPass();
  private moveTilesPass = new MoveTilesPass();

  public generate() {
    this.setupPass.run();
    this.randomTilePlacementPass.run();
    this.placeTownPass.run();
    this.connectToStartingTilePass.run();
    this.replacePlaceholderTilesPass.run();
    this.flipTilesPass.run();
    this.moveTilesPass.run();
  }
}
