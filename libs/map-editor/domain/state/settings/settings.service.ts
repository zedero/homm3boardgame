import { Injectable, Signal, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { domainSettingsEventActions } from './settings.actions';
import { selectSettingsState } from './settings.selectors';

const version = 2;
const storageKey = 'scenarioCreatorSettings_v' + version;

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  saveSettings() {
    const settings = this.store.selectSignal(selectSettingsState);
    localStorage.setItem(storageKey, JSON.stringify(settings()));
  }
  loadSettings() {
    const data = localStorage.getItem(storageKey);
    if (data) {
      const settings = JSON.parse(data);
      this.store.dispatch(
        domainSettingsEventActions.loadSettingsSuccess({
          settings,
        })
      );
    }
  }

  constructor(private store: Store) {
    this.loadSettings();
  }
}
