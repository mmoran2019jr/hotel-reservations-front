import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  loading = false;

  // ¡Así se hace ahora! (Angular 14+)
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { email, password } = this.form.getRawValue();

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/rooms';
        this.router.navigateByUrl(returnUrl);

        // Cambiamos solo esta línea: en vez de snackBar → SweetAlert2
        Swal.fire({
          icon: 'success',
          title: '¡Sesión iniciada!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
      },
      error: () => {
        this.loading = false;

        // Opcional: también puedes mejorar el error con SweetAlert2 (sin romper nada)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales incorrectas',
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timerProgressBar: true
        });
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
