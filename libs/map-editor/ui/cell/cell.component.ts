import { Component, computed, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { featureEventActions } from '../../features/editor-base/src/lib/map-editor.actions';

@Component({
  selector: 'app-cell',
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss',
})
export class CellComponent {
  rowId = input.required<number>();
  colId = input.required<number>();
  guid = computed(() => `${this.rowId()}.${this.colId()}`);

  create() {
    this.store.dispatch(
      featureEventActions.openChooseTilePopup({
        row: this.rowId(),
        column: this.colId(),
      })
    );
  }

  constructor(private store: Store) {}
}
