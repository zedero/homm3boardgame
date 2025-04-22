import {
  Component,
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

@Component({
  selector: 'feature-cell-editor',
  imports: [CommonModule, CubeComponent, PortraitComponent, FormsModule],
  templateUrl: './cell-editor.component.html',
  styleUrl: './cell-editor.component.scss',
})
export class CellEditorComponent implements OnInit, OnDestroy {
  // Injects
  private configService = inject(DataConfigService);
  private signalStore = inject(TileMapStore);

  // Inputs
  tileData: WritableSignal<Tile> = signal({} as Tile);
  tileGuid = input.required<string>();
  //TODO Make sure that the tileData is from the domain store and that the input turn to the guid of the tile

  index = input.required<number>();

  // Properties
  destroyed$ = new Subject();
  protected factions: WritableSignal<any[]> = signal([]);
  selectedHero: WritableSignal<string> = signal('');
  heroes: WritableSignal<any[]> = signal([
    { value: '0', name: '- No Hero -', faction: 'NONE' },
  ]);

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

  constructor(private store: Store) {
    this.factions.set(Object.keys(this.configService.FACTIONS()));
    this.createHeroesSelect();
  }

  ngOnInit() {
    // this.store
    //   .select(selectTileByGuid(this.tileGuid()))
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe((tile) => {
    //     if (tile) {
    //       this.tileData.set(tile);
    //     }
    //     this.selectedCube.set(this.tileData().cubes[this.index()]);
    //     this.selectedHero.set(this.tileData().hero[this.index()]);
    //   });
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
}
