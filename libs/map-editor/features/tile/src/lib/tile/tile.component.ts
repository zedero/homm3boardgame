import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BASE_TILE, Tile } from '../../../../../util/types/tile';
import { DataConfigService } from '@homm3boardgame/config';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CubeComponent } from '../../../../../ui/cube/cube.component';
import { PortraitComponent } from '../../../../../ui/portrait/portrait.component';
import { MatDialog } from '@angular/material/dialog';
import { TileMapStore } from '../../../../../domain/state/tile-map/tile-map.reducer';
import { BlockedHexComponent } from '../../../../../ui/blocked-hex/blocked-hex.component';
import { Store } from '@ngrx/store';
import { domainEventActions } from '@homm3boardgame/domain/state';

@Component({
  selector: 'feature-tile',
  imports: [
    CommonModule,
    CdkDrag,
    CdkDragHandle,
    CubeComponent,
    PortraitComponent,
    BlockedHexComponent,
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
  standalone: true,
})
export class TileComponent implements OnInit {
  // Injects
  private configService = inject(DataConfigService);
  private signalStore = inject(TileMapStore);

  // Inputs
  tileGuid = input.required<string>();
  displayMode = input<boolean>(false);
  tileData = computed(() => {
    let tile = this.signalStore.selectTileByGuid(this.tileGuid());
    if (tile && this.displayMode()) {
      tile = { ...tile, rotation: 0 };
    }
    return tile ?? BASE_TILE;
  });

  borderColor = computed(() => {
    const style = window.getComputedStyle(document.body);
    return style.getPropertyValue(`--${this.factionBorder()}`);
  });

  public dragPosition = signal({ x: 0, y: 0 });

  protected image: Signal<string> = computed(() => {
    const tile = this.configService.TILES()[this.tileData().tileId];
    return tile?.img ?? 'default';
  });
  protected desc: Signal<string> = computed(() => {
    return this.tileData().tileId;
  });
  protected rotation: Signal<string> = computed(() => {
    return this.tileData().rotation * 60 + 'deg';
  });
  protected suggestedPlacement: Signal<number> = computed(() => {
    return this.tileData().suggestedPlacement ? 0.5 : 1;
  });

  protected canHaveFactionBorder: Signal<boolean> = computed(() => {
    return (
      this.configService.getTileGroupById(this.tileData().tileId) == 'RANDOM'
    );
  });

  protected factionBorder: Signal<string> = computed(() => {
    return this.canHaveFactionBorder() ? this.tileData().faction : '';
  });

  ngOnInit() {
    if (!this.displayMode()) {
      this.snapToCell(this.generateId(this.tileData()));
    }
  }

  public snap(event: any) {
    let x, y;
    if (event.type === 'mouseup') {
      x = event.clientX;
      y = event.clientY;
    } else {
      x = event.changedTouches[0].clientX;
      y = event.changedTouches[0].clientY;
    }

    const collisionElements = document.elementsFromPoint(x, y);

    const target = collisionElements.find((element: Element) => {
      return element.className === 'cell';
    });

    // snap back to sell if you don't have a target. No need to run a save action
    if (!target?.id) {
      this.snapToCell(this.generateId(this.tileData()));
      return;
    }

    // Check if the target is a valid snap space
    // if (!this.tilesService.isValidSnapSpace(target.id, this.config)) {
    //   this.snapToCell(this.generateId(this.config));
    //   return;
    // }

    this.snapToCell(target.id);
    this.saveTilePosition(target.id);
  }

  protected delete() {
    this.signalStore.deleteTile(this.tileData().id);
  }

  protected rotate() {
    let newRotation = this.tileData().rotation + 1;
    if (newRotation >= 6) {
      newRotation = 0;
    }

    this.signalStore.updateTile({
      ...this.tileData(),
      rotation: newRotation,
    });
  }

  private snapToCell = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    this.dragPosition.set({
      x: element.offsetLeft - 86,
      y: element.offsetTop - 74,
    });
  };

  private saveTilePosition(cellId: string) {
    const pos = cellId.split('.').map((a: string) => {
      return Number(a);
    });
    this.signalStore.updateTile({
      ...this.tileData(),
      row: pos[0],
      col: pos[1],
    });
  }

  protected editTile() {
    // this.tileUtil.openDialog(this.tileData());
    this.store.dispatch(
      domainEventActions.editTile({
        tile: this.tileData(),
      })
    );
  }

  private generateId(data: Tile) {
    return `${data.row}.${data.col}`;
  }

  constructor(public dialog: MatDialog, private store: Store) {}
}
