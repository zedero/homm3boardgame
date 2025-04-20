import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tile } from '../../../../../util/types/tile';
import { ButtonComponent, DialogComponent } from '@homm3boardgame/shared/ui';
import { TileMapService } from '../../../../../domain/state/tile-map/tile-map.service';

@Component({
  selector: 'lib-move-tiles-dialog',
  imports: [CommonModule, DialogComponent, ButtonComponent],
  templateUrl: './move-tiles-dialog.component.html',
  styleUrl: './move-tiles-dialog.component.scss',
})
export class MoveTilesDialogComponent {
  private tileMapService = inject(TileMapService);
  constructor(public dialogRef: MatDialogRef<MoveTilesDialogComponent>) {}

  moveUpLeft() {
    this.tileMapService.moveAllUpLeft();
  }
  moveUpRight() {
    this.tileMapService.moveAllUpRight();
  }
  moveLeft() {
    this.tileMapService.moveAllLeft();
  }
  moveRight() {
    this.tileMapService.moveAllRight();
  }
  moveDownLeft() {
    this.tileMapService.moveDownLeft();
  }
  moveDownRight() {
    this.tileMapService.moveDownRight();
  }

  close(): void {
    this.dialogRef.close();
  }
}
