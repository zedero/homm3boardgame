import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { PlacedTilesEffects } from './placed-tiles.effects';

@NgModule({
  imports: [EffectsModule.forFeature([PlacedTilesEffects])],
})
export class PlacedTilesStoreModule {}
