import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataConfigService } from '@homm3boardgame/config';
import { GridComponent } from '@homm3boardgame/grid';
import { Store } from '@ngrx/store';
import { PlacedTilesComponent } from '@homm3boardgame/placed-tiles';
import { FooterComponent } from '@homm3boardgame/footer';
import { TileMapService } from '../../../../domain/state/tile-map/tile-map.service';

@Component({
  selector: 'feature-editor-base',
  imports: [CommonModule, GridComponent, PlacedTilesComponent, FooterComponent],
  templateUrl: './map-editor.component.html',
  styleUrl: './map-editor.component.scss',
  standalone: true,
})
export class MapEditorComponent {
  private tileMapService = inject(TileMapService);
  isValid = computed(() => {
    return this.tileMapService.isValid();
  });
  constructor(
    private dataConfigService: DataConfigService,
    private store: Store
  ) {}
}
