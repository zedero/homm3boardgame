import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { MapEditorEffects } from './map-editor.effects';

@NgModule({
  imports: [EffectsModule.forFeature([MapEditorEffects])],
})
export class MapEditorStoreModule {}
