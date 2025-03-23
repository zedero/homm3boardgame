import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { provideStore, provideState } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import * as fromGrid from './../../libs/map-editor/domain/state/grid/grid.reducer';
import { GridEffects } from '../../libs/map-editor/domain/state/grid/grid.effects';
import { GridFacade } from '../../libs/map-editor/domain/state/grid/grid.facade';
import * as fromTileMap from '../../libs/map-editor/domain/state/tile-map/tile-map.reducer';
import { TileMapEffects } from '../../libs/map-editor/domain/state/tile-map/tile-map.effects';
import { TileMapFacade } from '../../libs/map-editor/domain/state/tile-map/tile-map.facade';
import { MapEditorEffects } from '../../libs/map-editor/features/editor-base/src/lib/map-editor.effects';
import { PlacedTilesEffects } from '../../libs/map-editor/features/placed-tiles/src/lib/placed-tiles/placed-tiles.effects';
import * as fromSettings from './../../libs/map-editor/domain/state/settings/settings.reducer';
import { SettingsEffects } from '../../libs/map-editor/domain/state/settings/settings.effects';
import { SettingsFacade } from '../../libs/map-editor/domain/state/settings/settings.facade';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(SettingsEffects),
    provideState(
      fromSettings.SETTINGS_FEATURE_KEY,
      fromSettings.settingsReducer
    ),
    SettingsFacade,
    provideEffects(MapEditorEffects),
    provideEffects(PlacedTilesEffects),
    TileMapFacade,
    provideEffects(TileMapEffects),
    provideState(fromTileMap.TILE_MAP_FEATURE_KEY, fromTileMap.tileMapReducer),
    provideStore(),
    provideEffects(GridEffects),

    provideState(fromGrid.GRID_FEATURE_KEY, fromGrid.gridReducer),
    GridFacade,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(
      StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
      })
    ),
  ],
};
