import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { domainEventActions } from '@homm3boardgame/domain/state';
import * as htmlToImage from 'html-to-image';
import { Options } from 'html-to-image/lib/types';

@Injectable()
export class PlacedTilesEffects {
  private actions$ = inject(Actions);

  generateImage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(domainEventActions.generateImage),
        tap(() => {
          const node = document.getElementById('placedTiles');
          if (!node) {
            return;
          }

          htmlToImage
            .toPng(node, contentCropOptions(node))
            .then((dataUrl) => {
              download(dataUrl, `scenario-map-${new Date().getTime()}.png`);
            })
            .catch((error) => {
              console.error('oops, something went wrong!', error);
            });
        })
      ),
    { dispatch: false }
  );
}

const contentCropOptions = (node: HTMLElement): Options => {
  const tiles = Array.from(node.querySelectorAll('.tile'));
  if (tiles.length === 0) {
    return {};
  }

  const nodeRect = node.getBoundingClientRect();
  const rects = tiles.map((tile) => tile.getBoundingClientRect());

  const left = Math.floor(
    Math.min(...rects.map((rect) => rect.left)) - nodeRect.left
  );
  const top = Math.floor(
    Math.min(...rects.map((rect) => rect.top)) - nodeRect.top
  );
  const right = Math.ceil(
    Math.max(...rects.map((rect) => rect.right)) - nodeRect.left
  );
  const bottom = Math.ceil(
    Math.max(...rects.map((rect) => rect.bottom)) - nodeRect.top
  );

  return {
    width: right - left,
    height: bottom - top,
    style: {
      transform: `translate(${-left}px, ${-top}px)`,
      transformOrigin: 'top left',
    },
  };
};

const download = (dataurl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataurl;
  link.download = filename;
  link.click();
};
