import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { domainEventActions } from './tile-map.actions';
import { RandomMapGeneratorService } from '../../services/random-map-generator/random-map-generator';
import { TileUtil } from '../../../features/tile/src/lib/tile/tile.util';

@Injectable()
export class TileMapEffects {
  private actions$ = inject(Actions);
  private randomMapGeneratorService = inject(RandomMapGeneratorService);

  generateRandomMap$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(domainEventActions.generateRandomMap),
        tap(() => {
          this.randomMapGeneratorService.generate();
        })
      ),
    { dispatch: false }
  );

  test$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(domainEventActions.editTile),
        tap(({ tile }) => {
          this.tileUtil.openDialog(tile);
        })
      ),
    { dispatch: false }
  );

  constructor(private tileUtil: TileUtil) {}
}
