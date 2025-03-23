import { Component, computed, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, DialogComponent } from '@homm3boardgame/shared/ui';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { DataConfigService } from '@homm3boardgame/config';
import { Store } from '@ngrx/store';
import { domainSettingsEventActions } from '../../../../../domain/state/settings/settings.actions';
import {
  selectFilterSettings,
  selectGeneratorSettings,
  selectMapSize,
  selectPlayerCount,
} from '../../../../../domain/state/settings/settings.selectors';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { SizeOptions } from '../../../../../domain/state/settings/settings.reducer';
import { domainEventActions } from '@homm3boardgame/domain/state';

interface FlipTilesSettings {
  [key: string]: boolean;
}

@Component({
  selector: 'lib-random-map-dialog',
  imports: [
    CommonModule,
    DialogComponent,
    FormsModule,
    MatCheckbox,
    ReactiveFormsModule,
    MatRadioButton,
    MatRadioGroup,
    ButtonComponent,
  ],
  templateUrl: './random-map-dialog.component.html',
  styleUrl: './random-map-dialog.component.scss',
})
export class RandomMapDialogComponent implements OnInit {
  public sets;
  public expansionsFilter;
  public expansionsFilterSettings;
  public flipTilesSettings;

  selectedMapSize = signal('MEDIUM');
  savedMapSize;
  mapSizeOptions: any[] = [
    { value: 'SMALL', name: 'S' },
    { value: 'MEDIUM', name: 'M' },
    { value: 'LARGE', name: 'L' },
  ];

  selectedPlayers = signal(2);
  savedPlayerCount;
  playerOptions: any[] = [
    { value: 1, name: '1' },
    { value: 2, name: '2' },
    { value: 3, name: '3' },
    { value: 4, name: '4' },
    { value: 5, name: '5' },
    { value: 6, name: '6' },
  ];

  public flip = signal([{ name: 'TOWN', desc: 'town' }]);

  constructor(
    public dialogRef: MatDialogRef<RandomMapDialogComponent>,
    protected config: DataConfigService,
    private _formBuilder: FormBuilder,
    private store: Store
  ) {
    this.savedMapSize = this.store.selectSignal(selectMapSize);
    this.selectedMapSize.set(this.savedMapSize());

    this.savedPlayerCount = this.store.selectSignal(selectPlayerCount);
    this.selectedPlayers.set(this.savedPlayerCount());

    this.sets = this._formBuilder.group(
      this.generateFormBuilderGroup(config.EXPANSION_FILTER_DESC())
    );

    this.expansionsFilterSettings =
      this.store.selectSignal(selectFilterSettings);
    const t = this.store.selectSignal(selectGeneratorSettings) as unknown;
    this.flipTilesSettings = t as Signal<FlipTilesSettings>;

    this.expansionsFilter = this.generateFilterList(
      config.EXPANSION(),
      config.EXPANSION_FILTER_DESC()
    );
  }

  ngOnInit(): void {
    this.flip.set([
      { name: 'flipTownTiles', desc: 'town' },
      { name: 'flipFarTiles', desc: 'far' },
      { name: 'flipNearTiles', desc: 'near' },
      { name: 'flipCenterTiles', desc: 'center' },
    ]);
  }

  checkExpansion(name: any, event: any) {
    this.store.dispatch(
      domainSettingsEventActions.changeExpansionFilter({
        set: name,
        isChecked: event.checked,
      })
    );
  }

  selectMapSize(size: SizeOptions) {
    this.store.dispatch(
      domainSettingsEventActions.setMapSize({
        size,
      })
    );
  }

  selectPlayerCount(count: number) {
    this.store.dispatch(
      domainSettingsEventActions.setPlayerCount({
        count,
      })
    );
  }

  toggleSetting(group: string, event: any) {
    this.store.dispatch(
      domainSettingsEventActions.changeTileGroupFlipped({
        group,
        isChecked: event.checked,
      })
    );
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

  generateRandomMap() {
    this.store.dispatch(domainEventActions.generateRandomMap());
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
