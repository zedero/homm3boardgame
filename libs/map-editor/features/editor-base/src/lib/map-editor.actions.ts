// actions
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const featureEventActions = createActionGroup({
  source: 'map editor',
  events: {
    'open choose tile popup': props<{
      row: number;
      column: number;
    }>(),
  },
});
