import {
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileHexArray, Tile } from '../../../../../util/types/tile';
import { DataConfigService } from '@homm3boardgame/config';
import { CubeComponent } from '../../../../../ui/cube/cube.component';
import { PortraitComponent } from '../../../../../ui/portrait/portrait.component';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { TileMapStore } from '../../../../../domain/state/tile-map/tile-map.reducer';
import { CheckboxComponent } from '../../../../../../shared/ui/src/lib/ui/components/checkbox/checkbox.component';
import { BlockedHexComponent } from '../../../../../ui/blocked-hex/blocked-hex.component';

@Component({
  selector: 'feature-cell-editor',
  imports: [
    CommonModule,
    CubeComponent,
    PortraitComponent,
    FormsModule,
    CheckboxComponent,
    BlockedHexComponent,
  ],
  templateUrl: './cell-editor.component.html',
  styleUrl: './cell-editor.component.scss',
})
export class CellEditorComponent implements OnInit, OnDestroy {
  // Injects
  private configService = inject(DataConfigService);
  protected signalStore = inject(TileMapStore);

  // Inputs
  tileData: WritableSignal<Tile> = signal({} as Tile);
  tileGuid = input.required<string>();
  index = input.required<number>();

  // Properties
  destroyed$ = new Subject();
  protected factions: WritableSignal<any[]> = signal([]);
  selectedHero: WritableSignal<string> = signal('');
  heroes: WritableSignal<any[]> = signal([
    { value: '0', name: '- No Hero -', faction: 'NONE' },
  ]);
  blockedHex;

  selectedCube: WritableSignal<number> = signal(0);
  cubes: Signal<any[]> = signal([
    { value: '0', name: '- No Cube -' },
    { value: '1', name: 'Black cube' },
    { value: '2', name: 'Necropolis cube' },
    { value: '3', name: 'Castle cube' },
    { value: '4', name: 'Dungeon cube' },
    { value: '5', name: 'Tower cube' },
    { value: '6', name: 'Rampart cube' },
    { value: '7', name: 'Fortress cube' },
    { value: '8', name: 'Inferno cube' },
    { value: '9', name: 'Stronghold cube' },
    { value: '10', name: 'Conflux cube' },
    { value: '11', name: 'Cove cube' },
  ]);

  constructor() {
    this.factions.set(Object.keys(this.configService.FACTIONS()));
    this.createHeroesSelect();
    this.blockedHex = computed(() => {
      return (
        this.signalStore.selectTileByGuid(this.tileGuid())?.blockedHex?.[
          this.index()
        ] || false
      );
    });
  }

  ngOnInit() {
    const data = this.signalStore.selectTileByGuid(this.tileGuid()) as Tile;
    this.tileData.set(data);
    this.selectedCube.set(this.tileData().cubes[this.index()]);
    this.selectedHero.set(this.tileData().hero[this.index()]);
  }

  createHeroesSelect() {
    let heroes = Object.entries(this.configService.PORTRAITS())
      .sort((a: any, b: any) => {
        const one = a[1].faction;
        const two = b[1].faction;
        if (one < two) {
          return -1;
        }
        if (one > two) {
          return 1;
        }
        return 0;
      })
      .map(([key, val]: any) => {
        return {
          value: key,
          name: val.desc,
          faction: val.faction,
        };
      });

    heroes.unshift({ value: '0', name: '- No Hero -', faction: 'NONE' });
    this.heroes.set(heroes);
  }

  selectCube(_cube: string) {
    const cube = parseInt(_cube);
    this.signalStore.updateTile({
      ...this.tileData(),
      cubes: this.tileData().cubes.map((c, i) => {
        if (i === this.index()) {
          return cube;
        }
        return c;
      }) as TileHexArray<number>,
    });
  }
  selectHero(hero: string) {
    this.signalStore.updateTile({
      ...this.tileData(),
      hero: this.tileData().hero.map((h, i) => {
        if (i === this.index()) {
          return hero;
        }
        return h;
      }) as TileHexArray<string>,
    });
  }

  setBlockedState(state: boolean) {
    const tile = this.signalStore.selectTileByGuid(this.tileGuid()) as Tile;
    this.signalStore.updateTile({
      ...tile,
      blockedHex: tile.blockedHex.map((h, i) => {
        if (i === this.index()) {
          return state;
        }
        return h;
      }) as TileHexArray<boolean>,
    });
  }

  getFactionDesc(faction: string) {
    return this.configService.FACTIONS()[faction];
  }

  getHeroesByFaction(faction: string) {
    return this.heroes().filter((hero) => {
      if (hero.faction === faction) {
        return hero;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(1);
    this.destroyed$.complete();
  }

  protected readonly signal = signal;
}
