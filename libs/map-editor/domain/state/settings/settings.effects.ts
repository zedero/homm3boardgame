import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of, withLatestFrom, map } from 'rxjs';
import * as SettingsActions from './settings.actions';
import { domainSettingsEventActions } from './settings.actions';
import { Store } from '@ngrx/store';
import { SettingsService } from './settings.service';
import { selectFilterSettings } from './settings.selectors';

@Injectable()
export class SettingsEffects {
  private actions$ = inject(Actions);
  private settingsService = inject(SettingsService);
  private store = inject(Store);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.initSettings),
      switchMap(() =>
        of(SettingsActions.loadSettingsSuccess({ settings: [] }))
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(SettingsActions.loadSettingsFailure({ error }));
      })
    )
  );

  saveSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          domainSettingsEventActions.changeExpansionFilter,
          domainSettingsEventActions.setMapSize,
          domainSettingsEventActions.setPlayerCount,
          domainSettingsEventActions.changeTileGroupFlipped
        ),
        withLatestFrom(this.store.select(selectFilterSettings)),
        map(([_, settings]: any) => {
          this.settingsService.saveSettings();
        })
      ),
    { dispatch: false }
  );
}
