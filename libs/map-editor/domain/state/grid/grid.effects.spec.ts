import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as GridActions from './grid.actions';
import { GridEffects } from './grid.effects';

describe('GridEffects', () => {
  let actions: Observable<Action>;
  let effects: GridEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        GridEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(GridEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: GridActions.initGrid() });

      const expected = hot('-a-|', {
        a: GridActions.loadGridSuccess({ grid: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
