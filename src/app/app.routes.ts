import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@homm3boardgame/map-editor').then((m) => m.MapEditorComponent),
  },
  {
    path: 'map-editor',
    loadComponent: () =>
      import('@homm3boardgame/map-editor').then((m) => m.MapEditorComponent),
  },
  {
    path: 'simulator',
    loadComponent: () =>
      import('@homm3boardgame/simulator').then((m) => m.SimulatorComponent),
  },
  {
    path: 'battle-ai',
    loadComponent: () =>
      import('@homm3boardgame/battle-ai').then((m) => m.BattleAiComponent),
  },
];
