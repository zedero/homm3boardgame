import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SelectTileComponent } from '@homm3boardgame/select-tile';

@Injectable({
  providedIn: 'root',
})
export class SelectTileUtil {
  constructor(public dialog: MatDialog) {}

  openDialog(data: { row: number; column: number }) {
    return this.dialog.open(SelectTileComponent, {
      height: '400px',
      width: '100%',
      data,
    });
  }
}
