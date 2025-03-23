import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { domainEventActions } from '@homm3boardgame/domain/state';
import * as htmlToImage from 'html-to-image';

@Injectable()
export class PlacedTilesEffects {
  private actions$ = inject(Actions);

  generateImage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(domainEventActions.generateImage),
        tap(() => {
          console.log('generate image @');
          let node: any = document.getElementById('placedTiles');
          console.log(node);
          htmlToImage
            .toPng(node)
            .then((dataUrl) => {
              download(dataUrl, `scenario-map-${new Date().getTime()}.png`);
            })
            .catch(function (error) {
              console.error('oops, something went wrong!', error);
            });
        })
      ),
    { dispatch: false }
  );
}

const download = (dataurl: any, filename: string) => {
  const link = document.createElement('a');
  link.href = dataurl;
  link.download = filename;
  link.click();
};
