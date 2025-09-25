import {Component, OnInit, inject, signal, Output, EventEmitter} from '@angular/core';
import { AuthStore } from '../../../core/stores/auth.store';
import { SearchStore } from '../../../core/stores/search.store';
import { APP_IMPORTS } from '../../../imports/app.imports';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarStore } from '../../../core/stores/sidebar.store';

@Component({
  standalone: true,
  imports: [...APP_IMPORTS],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  sidebarStore = inject(SidebarStore);
  private authStore = inject(AuthStore);
  private searchStore = inject(SearchStore);

  @Output() menuToggle = new EventEmitter<void>();

  user = this.authStore.user;
  isAdmin = this.authStore.isAdmin;
  isLoggedIn = this.authStore.isLoggedIn;

  searchQuery = signal('');
  searchType = this.searchStore.type;
  suggestions = this.searchStore.suggestions;
  showSuggest = this.searchStore.showSuggest;
  activeIndex = this.searchStore.activeIndex;

  ngOnInit(): void {
    this.authStore.loadCurrentUser();
  }

  onSearchChange(value: string): void {
    this.searchStore.setQuery(value);
  }

  onSearchChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value); // met à jour le signal
    this.searchStore.setQuery(input.value); // déclenche la recherche
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const selected = this.searchStore.getActiveSuggestion();
      if (selected?.url) window.location.href = selected.url;
    } else {
      this.searchStore.navigate(event);
    }
  }

  onToggleMenu() {
    this.sidebarStore.toggleSidebar();
  }

  logout(): void {
    this.authStore.logout();
  }
}
