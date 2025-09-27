import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStore {
  isOpen = signal(false);
  activeMenu = signal<string | null>(null);

  toggleSidebar() {
    this.isOpen.set(!this.isOpen());
  }

  closeSidebar() {
    this.isOpen.set(false);
  }

  toggleSubmenu(menu: string) {
    this.activeMenu.set(this.activeMenu() === menu ? null : menu);
  }
}
