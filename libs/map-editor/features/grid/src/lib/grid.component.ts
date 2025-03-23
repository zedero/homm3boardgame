import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from '../../../../ui/cell/cell.component';
import { TileMapStore } from '../../../../domain/state/tile-map/tile-map.reducer';

@Component({
  selector: 'feature-grid',
  imports: [CommonModule, CellComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  private signalStore = inject(TileMapStore);
  rows: Signal<number[]>;
  columns: Signal<number[]>;

  constructor() {
    this.rows = computed(() => {
      return Array(this.signalStore.grid.rows())
        .fill(0)
        .map((_, i) => i);
    });

    this.columns = computed(() => {
      return Array(this.signalStore.grid.columns())
        .fill(0)
        .map((_, i) => i);
    });
  }
}
