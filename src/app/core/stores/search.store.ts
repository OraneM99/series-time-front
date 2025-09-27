import { Injectable, signal, computed } from '@angular/core';
import { SearchService } from '../services/search.service';
import { SuggestionInterface } from '../../interfaces/suggestion.interface';

@Injectable({ providedIn: 'root' })
export class SearchStore {
  private _query = signal('');
  private _type = signal('');
  private _suggestions = signal<SuggestionInterface[]>([]);
  private _showSuggest = signal(false);
  private _activeIndex = signal(-1);

  // exposés
  readonly query = computed(() => this._query());
  readonly type = computed(() => this._type());
  readonly suggestions = computed(() => this._suggestions());
  readonly showSuggest = computed(() => this._showSuggest());
  readonly activeIndex = computed(() => this._activeIndex());
  readonly hasResults = computed(() => this._suggestions().length > 0);

  constructor(private searchService: SearchService) {}

  /** Met à jour la recherche */
  setQuery(query: string): void {
    this._query.set(query);

    if (query.length < 2) {
      this.resetSuggestions();
      return;
    }

    this.searchService.searchSuggestions(query, this._type()).subscribe({
      next: (data) => {
        this._suggestions.set(data.slice(0, 10));
        this._showSuggest.set(data.length > 0);
        this._activeIndex.set(-1);
      },
      error: () => this.resetSuggestions()
    });
  }

  /** Navigation clavier */
  navigate(event: KeyboardEvent): void {
    const itemsLength = this._suggestions().length;
    if (!itemsLength) return;

    let newIndex = this._activeIndex();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      newIndex = (newIndex + 1) % itemsLength;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      newIndex = (newIndex - 1 + itemsLength) % itemsLength;
    }
    if (event.key === 'Escape') {
      this.resetSuggestions();
      return;
    }

    this._activeIndex.set(newIndex);
  }

  /** Récupérer la suggestion active */
  getActiveSuggestion(): SuggestionInterface | null {
    return this._suggestions()[this._activeIndex()] ?? null;
  }

  /** Reset */
  private resetSuggestions(): void {
    this._suggestions.set([]);
    this._showSuggest.set(false);
    this._activeIndex.set(-1);
  }
}
