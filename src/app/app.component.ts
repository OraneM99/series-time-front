import { Component } from '@angular/core';
import { faStar, faInfoCircle, faHeart, faEdit, faPlus, faBan } from '@fortawesome/free-solid-svg-icons';
import { APP_IMPORTS } from './imports/app.imports';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {
  faBars, faSearch, faClock, faHeart as faHeartSolid, faRandom, faUser,
  faGear, faRightFromBracket, faUserShield, faTv, faLightbulb, faChartLine, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import {HeaderComponent} from './components/layout/header/header.component';
import {SidebarComponent} from './components/layout/sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...APP_IMPORTS, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faStar, faInfoCircle, faHeart, faEdit, faPlus, faBan,
      faBars, faSearch, faClock, faHeartSolid, faRandom,
      faUser, faGear, faRightFromBracket, faUserShield,
      faTv, faLightbulb, faChartLine, faChevronRight
    );
  }
}
