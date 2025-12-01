import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkMode$ = new BehaviorSubject<boolean>(this.getInitialMode());

  constructor() {
    // Apply initial mode
    this.applyMode(this.darkMode$.value);
  }

  get isDarkMode$() {
    return this.darkMode$.asObservable();
  }

  get isDarkMode(): boolean {
    return this.darkMode$.value;
  }

  toggleDarkMode(): void {
    const newMode = !this.darkMode$.value;
    this.setDarkMode(newMode);
  }

  setDarkMode(enabled: boolean): void {
    this.darkMode$.next(enabled);
    this.applyMode(enabled);
    localStorage.setItem('darkMode', JSON.stringify(enabled));
  }

  private getInitialMode(): boolean {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyMode(darkMode: boolean): void {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
