import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as SettingsActions from './settings.actions';
import { SettingsEffects } from './settings.effects';

describe('SettingsEffects', () => {
  let actions: Observable<Action>;
  let effects: SettingsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SettingsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(SettingsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: SettingsActions.initSettings() });

      const expected = hot('-a-|', {
        a: SettingsActions.loadSettingsSuccess({ settings: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
