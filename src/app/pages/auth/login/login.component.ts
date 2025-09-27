import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/api/auth.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { APP_IMPORTS } from '../../../imports/app.imports';

@Component({
  selector: 'app-login',
  imports: [...APP_IMPORTS],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private authStore: AuthStore
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const { email, password } = this.form.value;

    this.authService.login(email ?? '', password ?? '').subscribe({
      next: () => {
        this.authStore.loadCurrentUser();
        this.router.navigate(['/']).then(() => {
          console.log('✅ Navigation vers /');
        });
      },
      error: (err) => {
        console.error('❌ Erreur de connexion', err);
        this.errorMessage =
          err.error?.message || 'Email ou mot de passe incorrect.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
