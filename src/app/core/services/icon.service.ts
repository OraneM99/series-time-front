import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { APP_ICONS } from '../../config/app.icon';

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(private library: FaIconLibrary) {
    library.addIcons(...APP_ICONS);
  }
}
