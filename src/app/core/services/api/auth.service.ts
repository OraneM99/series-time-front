import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {UserInterface} from '../../../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Récupérer l’utilisateur courant */
  getCurrentUser(): Observable<UserInterface | null> {
    return this.http.get<UserInterface | null>(`${this.apiUrl}/me`, {
      withCredentials: true
    });
  }

  /** Déconnexion (supprime la session côté serveur) */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    });
  }

  /** (optionnel) Login côté Angular */
  login(username: string, password: string): Observable<UserInterface> {
    return this.http.post<UserInterface>(
      `${this.apiUrl}/login`,
      { username, password },
      { withCredentials: true }
    );
  }
}
