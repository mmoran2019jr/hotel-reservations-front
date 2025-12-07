import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-page',
  standalone: false,
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
loading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

    form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { name, email, password } = this.form.value;

    this.authService.register({
      name: name!,
      email: email!,
      password: password!,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Cuenta creada. Sesión iniciada.', 'Cerrar', { duration: 2500 });
        this.router.navigateByUrl('/rooms');
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
