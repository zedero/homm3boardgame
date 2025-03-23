import {
  Component,
  computed,
  inject,
  Inject,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataConfigService } from '@homm3boardgame/config';
import { Tile } from '../../../../../util/types/tile';
import { CellEditorComponent } from '@homm3boardgame/cell-editor';
import { DialogComponent } from '@homm3boardgame/shared/ui';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'feature-edit-tile-dialog',
  imports: [CommonModule, CellEditorComponent, DialogComponent, FormsModule],
  templateUrl: './edit-tile-dialog.component.html',
  styleUrl: './edit-tile-dialog.component.scss',
})
export class EditTileDialogComponent {
  private configService = inject(DataConfigService);
  protected image: Signal<string>;
  protected desc: Signal<string>;

  constructor(
    public dialogRef: MatDialogRef<EditTileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tile
  ) {
    this.image = computed(() => {
      const tile = this.configService.TILES()[data.tileId];
      if (tile) {
        return tile.img;
      }
      return 'default';
    });
    this.desc = computed(() => {
      return this.data.tileId;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
