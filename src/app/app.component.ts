import { Component } from '@angular/core';
import { faStar, faInfoCircle, faHeart, faEdit, faPlus, faBan } from '@fortawesome/free-solid-svg-icons';
import { APP_IMPORTS } from './imports/app.imports';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [...APP_IMPORTS],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(library: FaIconLibrary) {
      library.addIcons(faStar, faInfoCircle, faHeart, faEdit, faPlus, faBan);
  }
}
