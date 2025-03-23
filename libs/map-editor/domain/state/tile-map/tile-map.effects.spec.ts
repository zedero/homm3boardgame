import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as TileMapActions from './tile-map.actions';
import { TileMapEffects } from './tile-map.effects';

describe('TileMapEffects', () => {
  let actions: Observable<Action>;
  let effects: TileMapEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TileMapEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(TileMapEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: TileMapActions.initTileMap() });

      const expected = hot('-a-|', {
        a: TileMapActions.loadTileMapSuccess({ tileMap: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
