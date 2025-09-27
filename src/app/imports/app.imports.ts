import { RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

export const APP_IMPORTS = [
  RouterOutlet,
  RouterLink,
  FontAwesomeModule,
  FormsModule,
  ReactiveFormsModule,
  DatePipe
];
