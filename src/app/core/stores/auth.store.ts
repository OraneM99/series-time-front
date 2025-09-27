import { Injectable, signal, computed } from '@angular/core';
import { UserInterface } from '../../interfaces/user.interface';
import { AuthService } from '../services/api/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _user = signal<UserInterface | null>(null);
  private _loading = signal(false);

  readonly user = computed(() => this._user());
  readonly isLoggedIn = computed(() => !!this._user());
  readonly isAdmin = computed(() => this._user()?.roles?.includes('ROLE_ADMIN') ?? false);
  readonly loading = computed(() => this._loading());

  constructor(private authService: AuthService) {}

  /** Charger l’utilisateur courant */
  loadCurrentUser(): void {
    this._loading.set(true);
    this.authService.getCurrentUser().subscribe({
      next: (user) => this._user.set(user),
      error: () => this._user.set(null),
      complete: () => this._loading.set(false)
    });
  }

  /** Déconnexion */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this._user.set(null);
        window.location.href = '/login';
      },
      error: () => {
        this._user.set(null);
        window.location.href = '/login';
      }
    });
  }
}
