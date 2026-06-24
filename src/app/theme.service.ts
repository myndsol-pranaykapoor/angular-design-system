import { Injectable, signal } from '@angular/core';

/** Active PDS product theme — drives both the CSS primary variables
 *  (via the data-pds-theme attribute) and the dual-colour icon set. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Reactive current theme; default = ACT */
  readonly theme = signal<string>('act');

  setTheme(theme: string): void {
    this.theme.set(theme);
    document.documentElement.setAttribute('data-pds-theme', theme);
  }
}
