import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('study-room-booking');
  // don't access localStorage at module init (server / SSR / vite runners may error)
  isLogged = signal<boolean>(false);

  constructor(private router: Router) {
    // set initial login state if running in the browser
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      this.isLogged.set(!!localStorage.getItem('token'));

      // update login state on navigation (covers login/signup redirects)
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.isLogged.set(!!localStorage.getItem('token'));
        }
      });

      // listen for storage changes (other tabs)
      window.addEventListener('storage', (ev: StorageEvent) => {
        if (ev.key === 'token') this.isLogged.set(!!localStorage.getItem('token'));
      });
    }
  }

  logout(): void {
    try { localStorage.removeItem('token'); } catch {}
    try { sessionStorage.removeItem('token'); } catch {}
    this.isLogged.set(false);
    this.router.navigate(['/login']);
  }

  signout(): void {
    // alias for logout to show separate button if required
    this.logout();
  }
}
