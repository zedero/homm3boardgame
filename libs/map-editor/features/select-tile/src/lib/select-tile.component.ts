import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DataConfigService } from '@homm3boardgame/config';
import { MatCheckbox } from '@angular/material/checkbox';
import { domainEventActions } from '@homm3boardgame/domain/state';
import { Store } from '@ngrx/store';
import { DialogComponent } from '@homm3boardgame/shared/ui';
import { selectFilterSettings } from '../../../../domain/state/settings/settings.selectors';
import { domainSettingsEventActions } from '../../../../domain/state/settings/settings.actions';
import { TileMapStore } from '../../../../domain/state/tile-map/tile-map.reducer';

@Component({
  selector: 'lib-select-tile',
  imports: [CommonModule, ReactiveFormsModule, MatCheckbox, DialogComponent],
  templateUrl: './select-tile.component.html',
  styleUrl: './select-tile.component.scss',
})
export class SelectTileComponent {
  private signalStore = inject(TileMapStore);
  public sets;
  public expansionsFilter;
  public GROUP;
  public EXPANSION;
  public tilesConfiguration;
  public placedFilter;
  public tilesLeft: any;
  public expansionsFilterSettings;

  constructor(
    public dialogRef: MatDialogRef<SelectTileComponent>,
    protected config: DataConfigService,
    private _formBuilder: FormBuilder,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sets = this._formBuilder.group(
      this.generateFormBuilderGroup(config.EXPANSION_FILTER_DESC())
    );
    this.expansionsFilter = this.generateFilterList(
      config.EXPANSION(),
      config.EXPANSION_FILTER_DESC()
    );
    this.GROUP = config.GROUP();
    this.EXPANSION = config.EXPANSION();
    this.tilesConfiguration = Object.values(this.config.TILES());
    this.placedFilter = this.getPlacedTiles();

    this.expansionsFilterSettings =
      this.store.selectSignal(selectFilterSettings);
  }

  generateFormBuilderGroup(descObj: any) {
    const group: any = {};
    Object.keys(descObj).forEach((val: any) => {
      group[val] = true;
    });

    Object.entries(this.config.filterOptions).forEach(([key, val]) => {
      if (group[key]) {
        group[key] = val;
      }
    });
    return group;
  }

  generateFilterList(filterObj: any, descObj: any) {
    // change enum obj to string list of keys
    const filterList = Object.keys(filterObj).filter((val) => {
      return isNaN(parseInt(val));
    });
    return filterList.map((val: any) => {
      return {
        name: val,
        desc: descObj[val],
      };
    });
  }

  enumToList(obj: any) {
    return Object.keys(obj).filter((val) => {
      return isNaN(parseInt(val));
    });
  }
  getExpansionSelection() {
    const selectedExpansions = new Set();
    Object.entries(this.sets.value).map((entry) => {
      if (entry[1]) {
        selectedExpansions.add(this.EXPANSION[entry[0]]);
      }
    });
    return selectedExpansions;
  }

  getPlacedTiles() {
    this.getTilesLeft();
    const placed = new Set();
    // this.tilesService.tileList.forEach((tile) => {
    //   if (this.config.EXPANSION[this.config.TILES[tile.tileId].expansionID] !== "RANDOM") {
    //     placed.add(tile.tileId)
    //   }
    // });
    return placed;
  }

  getTilesLeft() {
    const totals = {
      TOWN: 0,
      FAR: 0,
      NEAR: 0,
      CENTER: 0,
      TOWN_MAX: 0,
      FAR_MAX: 0,
      NEAR_MAX: 0,
      CENTER_MAX: 0,
    };
    this.getExpansionSelection().forEach((selectedExpansion: any) => {
      const content =
        this.config.EXPANSION_CONTENTS()[
          this.config.EXPANSION()[selectedExpansion]
        ];
      totals.TOWN += content.TOWN;
      totals.FAR += content.FAR;
      totals.NEAR += content.NEAR;
      totals.CENTER += content.CENTER;
      totals.TOWN_MAX += content.TOWN;
      totals.FAR_MAX += content.FAR;
      totals.NEAR_MAX += content.NEAR;
      totals.CENTER_MAX += content.CENTER;
    });

    // this.tilesService.tileList.forEach((tile) => {
    //   const groupId = this.config.GROUP[this.config.TILES[tile.tileId].group];
    //   if (this.config.GROUP[groupId] === this.config.GROUP.STARTINGTILE) {
    //     totals.TOWN--;
    //   }
    //   if (this.config.GROUP[groupId] === this.config.GROUP.FAR) {
    //     totals.FAR--;
    //   }
    //   if (this.config.GROUP[groupId] === this.config.GROUP.NEAR) {
    //     totals.NEAR--;
    //   }
    //   if (this.config.GROUP[groupId] === this.config.GROUP.CENTER) {
    //     totals.CENTER--;
    //   }
    //   if (this.config.GROUP[groupId] === this.config.GROUP.RANDOM) {
    //     if (tile.tileId === "S0") {
    //       totals.TOWN--;
    //     }
    //     if (tile.tileId === "F0") {
    //       totals.FAR--;
    //     }
    //     if (tile.tileId === "N0") {
    //       totals.NEAR--;
    //     }
    //     if (tile.tileId === "C0") {
    //       totals.CENTER--;
    //     }
    //   }
    // })

    this.tilesLeft = totals;
    return totals;
  }

  getGroup(config: any, groupEnum: number) {
    const selectedExpansionsIDs = this.getExpansionSelection();
    const left = this.getTilesLeft();

    if (groupEnum === this.config.GROUP()['RANDOM']) {
      return config
        .filter((item: any) => {
          return (
            item.group === groupEnum &&
            selectedExpansionsIDs.has(item.expansionID) &&
            item.id !== 'PLACEHOLDER'
          );
        })
        .filter((item: any) => {
          if (item.id === 'S0' && left.TOWN > 0) {
            return true;
          }
          if (item.id === 'F0' && left.FAR > 0) {
            return true;
          }
          if (item.id === 'N0' && left.NEAR > 0) {
            return true;
          }
          if (item.id === 'C0' && left.CENTER > 0) {
            return true;
          }
          return false;
        });
    }

    return config
      .filter((item: any) => {
        return (
          item.group === groupEnum &&
          selectedExpansionsIDs.has(item.expansionID) &&
          item.id !== 'PLACEHOLDER'
        );
      })
      .filter((item: any) => {
        // check if tile has been placed already
        return !this.placedFilter.has(item.id);
      });
    // .filter((item: any) => {
    //   // check if there are tiles left of this sort.
    //   return (
    //     left[this.config.GROUP[item.group].replace('STARTINGTILE', 'TOWN')] >
    //     0
    //   );
    // });
  }

  getLeft(group: any) {
    if (group === 'RANDOM') {
      // const t = Object.entries(this.tilesLeft).filter(([key, val]) => {
      //   return !key.includes('_MAX')
      // }).reduce((acc: number, [key, val]) => {
      //   // @ts-ignore
      //   return acc += val
      // }, 0)
      // console.log(t)

      return {
        current: Object.entries(this.tilesLeft)
          .filter(([key, val]) => {
            return !key.includes('_MAX');
          })
          .reduce((acc: number, [key, val]) => {
            // @ts-ignore
            return (acc += val);
          }, 0),
        total: Object.entries(this.tilesLeft)
          .filter(([key, val]) => {
            return key.includes('_MAX');
          })
          .reduce((acc: number, [key, val]) => {
            // @ts-ignore
            return (acc += val);
          }, 0),
      };
    }
    return {
      current: this.tilesLeft[group.replace('STARTINGTILE', 'TOWN')],
      total: this.tilesLeft[group.replace('STARTINGTILE', 'TOWN') + '_MAX'],
    };
  }

  selectTile(id: string) {
    this.signalStore.addTile({
      row: this.data.row,
      column: this.data.column,
      tileId: id,
    });
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  saveFilterOptions(name: string, event: any) {
    console.log(name, event);
    this.store.dispatch(
      domainSettingsEventActions.changeExpansionFilter({
        set: name,
        isChecked: event.checked,
      })
    );
  }
}
