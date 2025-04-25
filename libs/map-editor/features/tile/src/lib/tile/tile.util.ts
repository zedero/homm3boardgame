import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectTileComponent } from '@homm3boardgame/select-tile';
import { EditTileDialogComponent } from '@homm3boardgame/edit-tile-dialog';
import { Tile } from '../../../../../util/types/tile';

@Injectable({
  providedIn: 'root',
})
export class TileUtil {
  constructor(public dialog: MatDialog) {}

  openDialog(tileData: Tile) {
    this.dialog.open(EditTileDialogComponent, {
      height: '500px',
      width: '100%',
      data: tileData,
    });
  }
}
