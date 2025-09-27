import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faUser, faEnvelope, faLock, faArrowRight,
  faTriangleExclamation, faShieldHalved, faBars,
  faSearch, faClock, faHeart, faRandom, faGear,
  faRightFromBracket, faUserShield, faChartLine,
  faLightbulb, faTv
} from '@fortawesome/free-solid-svg-icons';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(private library: FaIconLibrary) {
    library.addIcons(
      faUser, faEnvelope, faLock, faArrowRight,
      faTriangleExclamation, faShieldHalved, faBars,
      faSearch, faClock, faHeart, faRandom, faGear,
      faRightFromBracket, faUserShield, faChartLine,
      faLightbulb, faTv
    );
  }
}
