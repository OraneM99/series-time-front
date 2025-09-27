import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/stores/auth.store';
import {APP_IMPORTS} from '../../imports/app.imports';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [...APP_IMPORTS],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  private authStore = inject(AuthStore);

  user = this.authStore.user;
}
