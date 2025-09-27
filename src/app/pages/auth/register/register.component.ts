import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { APP_IMPORTS } from '../../../imports/app.imports';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [...APP_IMPORTS],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, email, password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.http.post(`${environment.apiUrl}/register`, {
      username,
      email,
      password,
    }).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Vous pouvez vous connecter.';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('Erreur inscription', err);
        this.errorMessage = err.error?.message || 'Erreur lors de l’inscription.';
        this.successMessage = null;
      },
    });
  }
}
