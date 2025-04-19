import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  NumberInputComponent,
} from '@homm3boardgame/shared/ui';
import { Store } from '@ngrx/store';
import { domainEventActions } from '../../../../../domain/state/tile-map/tile-map.actions';
import { EditTileDialogComponent } from '@homm3boardgame/edit-tile-dialog';
import { MatDialog } from '@angular/material/dialog';
import { AboutDialogComponent } from '../../../../../ui/about-dialog/about-dialog.component';
import { ImportExportComponent } from '@homm3boardgame/import-export';
import { RandomMapDialogComponent } from '@homm3boardgame/random-map-dialog';
import { TileMapStore } from '../../../../../domain/state/tile-map/tile-map.reducer';
import { TileMapService } from '../../../../../domain/state/tile-map/tile-map.service';

@Component({
  selector: 'feature-footer',
  imports: [CommonModule, ButtonComponent, NumberInputComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected signalStore = inject(TileMapStore);
  private tileMapService = inject(TileMapService);
  generateImage() {
    this.store.dispatch(domainEventActions.generateImage());
  }

  clearTileMap() {
    this.signalStore.setTileList([]);
  }

  showAbout() {
    let dialogRef = this.dialog.open(AboutDialogComponent, {
      height: '500px',
      width: '100%',
    });
  }

  showImportExport() {
    let dialogRef = this.dialog.open(ImportExportComponent, {
      height: '500px',
      width: '100%',
    });
  }

  showMapGenerator() {
    let dialogRef = this.dialog.open(RandomMapDialogComponent, {
      height: '500px',
      width: '100%',
    });
  }

  generateRandomMap() {
    this.store.dispatch(domainEventActions.generateRandomMap());
  }

  moveTiles() {
    //moveAllUpLeft
    // this.tileMapService.moveAllUpRight();
  }

  updateRows(rows: number) {
    console.log(rows);
    this.signalStore.setGrid(rows, this.signalStore.grid.columns());
  }

  updateCols(cols: number) {
    this.signalStore.setGrid(this.signalStore.grid.rows(), cols);
  }

  constructor(private store: Store, public dialog: MatDialog) {}
}
