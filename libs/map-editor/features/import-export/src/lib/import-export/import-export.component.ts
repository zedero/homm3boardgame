import {
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent, DialogComponent } from '@homm3boardgame/shared/ui';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BASE_TILE, Tile, TileHexArray } from '../../../../../util/types/tile';
import * as zlib from 'pako';
import { Data, DeflateFunctionOptions } from 'pako';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { TileMapStore } from '../../../../../domain/state/tile-map/tile-map.reducer';

@Component({
  selector: 'feature-import-export',
  imports: [
    CommonModule,
    DialogComponent,
    ButtonComponent,
    FormsModule,
    CdkCopyToClipboard,
  ],
  templateUrl: './import-export.component.html',
  styleUrl: './import-export.component.scss',
})
export class ImportExportComponent {
  private tileList: Signal<Tile[]>;
  public exportValue: Signal<string>;
  public importValue: WritableSignal<string> = signal<string>('');
  private signalStore = inject(TileMapStore);

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ImportExportComponent>
  ) {
    this.tileList = this.signalStore.tileList;
    this.exportValue = computed(() => {
      const conf = { to: 'string' } as DeflateFunctionOptions;
      const zip = zlib.deflate(
        JSON.stringify(this.tileList()),
        conf
      ) as unknown;
      return btoa(zip as string);
    });
  }

  import() {
    const conf = { to: 'string' } as DeflateFunctionOptions;
    const fromBase64 = atob(this.importValue()) as unknown;
    const unzipped = zlib.inflate(fromBase64 as Data, conf) as unknown;
    const parsed = JSON.parse(unzipped as string);
    this.signalStore.setTileList(this.updateTileListData(parsed));
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  updateTileListData(tileList: Tile[]) {
    const updatedTileList = tileList.map((tile) => {
      return {
        ...BASE_TILE,
        ...tile,
      };
    });

    // make sure that the 0 for heroes in the old format is converted to string
    return updatedTileList.map((tile) => {
      const hero = tile.hero.map((hero) => {
        // @ts-ignore
        if (hero === 0) {
          return '';
        }
        return hero;
      }) as TileHexArray<string>;
      return {
        ...tile,
        hero,
      };
    });
  }
}
