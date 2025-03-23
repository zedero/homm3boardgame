import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '@homm3boardgame/shared/ui';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tile } from '../../util/types/tile';

@Component({
  selector: 'app-about-dialog',
  imports: [CommonModule, DialogComponent],
  templateUrl: './about-dialog.component.html',
  styleUrl: './about-dialog.component.scss',
})
export class AboutDialogComponent {
  constructor(public dialogRef: MatDialogRef<AboutDialogComponent>) {}
  close(): void {
    this.dialogRef.close();
  }
}
