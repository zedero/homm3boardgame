import {
  Component,
  computed,
  inject,
  Inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataConfigService } from '@homm3boardgame/config';
import { Tile } from '../../../../../util/types/tile';
import { CellEditorComponent } from '@homm3boardgame/cell-editor';
import { DialogComponent } from '@homm3boardgame/shared/ui';
import { FormsModule } from '@angular/forms';
import { TileComponent } from '@homm3boardgame/tile';
import { CheckboxComponent } from '../../../../../../shared/ui/src/lib/ui/components/checkbox/checkbox.component';
import { TileMapStore } from '../../../../../domain/state/tile-map/tile-map.reducer';

@Component({
  selector: 'feature-edit-tile-dialog',
  imports: [
    CommonModule,
    CellEditorComponent,
    DialogComponent,
    FormsModule,
    CheckboxComponent,
  ],
  templateUrl: './edit-tile-dialog.component.html',
  styleUrl: './edit-tile-dialog.component.scss',
})
export class EditTileDialogComponent implements OnInit {
  private configService = inject(DataConfigService);
  private signalStore = inject(TileMapStore);
  protected image: Signal<string>;
  protected desc: Signal<string>;
  protected suggestedPlacement: Signal<number>;

  selectedFaction: WritableSignal<string> = signal('');
  factionBorder: Signal<any[]> = signal([
    { value: '', name: '- none -' },
    { value: 'necropolis', name: 'Necropolis' },
    { value: 'castle', name: 'Castle' },
    { value: 'dungeon', name: 'Dungeon' },
    { value: 'tower', name: 'Tower' },
    { value: 'rampart', name: 'Rampart' },
    { value: 'fortress', name: 'Fortress' },
    { value: 'inferno', name: 'Inferno' },
    { value: 'stronghold', name: 'Stronghold' },
    { value: 'conflux', name: 'Conflux' },
    { value: 'cove', name: 'Cove' },
  ]);

  protected canHaveFactionBorder: WritableSignal<boolean> = signal(false);

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
    this.suggestedPlacement = computed(() => {
      return this.data.suggestedPlacement ? 0.5 : 1;
    });
  }

  ngOnInit() {
    // const data = this.signalStore.selectTileByGuid(this.tileGuid()) as Tile;
    this.selectedFaction.set(this.data.faction);
    if (this.configService.getTileGroupById(this.data.tileId) == 'RANDOM') {
      this.canHaveFactionBorder.set(true);
    }
  }

  changeSuggestionState(event: boolean) {
    const tile = this.signalStore.selectTileByGuid(this.data.id) as Tile;
    this.signalStore.updateTile({
      ...tile,
      suggestedPlacement: event,
    });
  }

  selectFaction(event: any) {
    const tile = this.signalStore.selectTileByGuid(this.data.id) as Tile;
    this.signalStore.updateTile({
      ...tile,
      faction: event,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
