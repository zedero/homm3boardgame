import { Actions, createEffect, ofType } from '@ngrx/effects';
import { featureEventActions } from './map-editor.actions';
import { tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { SelectTileUtil } from '../../../select-tile/src/lib/select-tile.util';

@Injectable()
export class MapEditorEffects {
  private actions$ = inject(Actions);
  selectTileUtil = inject(SelectTileUtil);

  addTile$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(featureEventActions.openChooseTilePopup),
        tap(({ row, column }) => {
          this.selectTileUtil.openDialog({ row, column });
        })
      ),
    { dispatch: false }
  );
}
