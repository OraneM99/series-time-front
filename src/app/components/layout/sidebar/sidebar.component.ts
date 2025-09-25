import { Component, inject } from '@angular/core';
import { SidebarStore } from '../../../core/stores/sidebar.store';
import {FooterComponent} from '../footer/footer.component';
import { APP_IMPORTS } from '../../../imports/app.imports';
import {AuthStore} from '../../../core/stores/auth.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [...APP_IMPORTS, FooterComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  sidebarStore = inject(SidebarStore);
  authStore = inject(AuthStore);

  // accès direct aux signals
  isOpen = this.sidebarStore.isOpen;
  activeMenu = this.sidebarStore.activeMenu;
  isAdmin = this.authStore.isAdmin;

  toggleSubmenu(menu: string) {
    this.sidebarStore.toggleSubmenu(menu);
  }

  closeSidebar() {
    this.sidebarStore.closeSidebar();
  }
}
