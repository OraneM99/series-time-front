import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SuggestionInterface } from '../../interfaces/suggestion.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  /**
   * Récupère des suggestions de séries/films/animes
   * @param query mot-clé
   * @param type "series"
   */
  searchSuggestions(query: string, type?: string): Observable<SuggestionInterface[]> {
    let params = new HttpParams().set('q', query);
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<SuggestionInterface[]>(`${this.apiUrl}/serie/suggest`, {
      params,
      withCredentials: true
    });
  }
}
