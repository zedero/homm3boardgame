import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Tile } from '../../../../../util/types/tile';
import { TileComponent } from '@homm3boardgame/tile';
import { TileMapStore } from '../../../../../domain/state/tile-map/tile-map.reducer';

@Component({
  selector: 'placed-tiles',
  standalone: true,
  imports: [CommonModule, TileComponent],
  templateUrl: './placed-tiles.component.html',
  styleUrl: './placed-tiles.component.scss',
})
export class PlacedTilesComponent implements OnInit {
  protected tiles$: Signal<Tile[]>;
  containerHeight$: Signal<string>;
  containerWidth$: Signal<string>;
  protected signalStore = inject(TileMapStore);

  constructor(private store: Store) {
    this.tiles$ = this.signalStore.tileList;
    this.containerHeight$ = computed(() => {
      let maxRow = 0;
      this.tiles$().forEach((tile) => {
        if (tile.row > maxRow) {
          maxRow = tile.row;
        }
      });
      return (maxRow + 2) * 100 + (maxRow + 1) * -26 + 'px';
    });

    this.containerWidth$ = computed(() => {
      let maxColumn = 0;
      this.tiles$().forEach((tile) => {
        if (tile.col > maxColumn) {
          maxColumn = tile.col;
        }
      });
      return (maxColumn + 2) * 86 + 'px';
    });
  }

  ngOnInit() {}
}
