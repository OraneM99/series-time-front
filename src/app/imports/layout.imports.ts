import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../components/layout/header/header.component';
import {SidebarComponent} from '../components/layout/sidebar/sidebar.component';
import {FooterComponent} from '../components/layout/footer/footer.component';


export const LAYOUT_IMPORTS = [
  RouterOutlet,
  HeaderComponent,
  SidebarComponent,
  FooterComponent,
];
