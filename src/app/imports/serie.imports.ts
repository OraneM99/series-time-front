import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxPaginationModule} from 'ngx-pagination';

export const SERIE_IMPORTS = [
  CommonModule,
  RouterOutlet,
  RouterLink,
  FontAwesomeModule,
  NgxPaginationModule
];
