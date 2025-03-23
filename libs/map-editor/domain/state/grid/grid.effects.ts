import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as GridActions from './grid.actions';

@Injectable()
export class GridEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GridActions.initGrid),
      switchMap(() => of(GridActions.loadGridSuccess({ grid: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(GridActions.loadGridFailure({ error }));
      })
    )
  );
}
