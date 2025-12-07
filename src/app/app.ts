import { Component, signal, inject} from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { AuthResponse } from './core/models/auth.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  currentUser$: Observable<AuthResponse | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  private router = inject(Router);

  async logout(): Promise<void> {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Estás a punto de salir de tu cuenta',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      heightAuto: false
    });

    // Si el usuario pulsa "Sí"
    if (result.isConfirmed) {
      this.authService.logout();           // limpia token, localStorage, etc.

      // Mensaje de despedida rápido
      await Swal.fire({
        title: '¡Hasta pronto!',
        text: 'Sesión cerrada correctamente',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        heightAuto: false
      });

      this.router.navigate(['/rooms']);
    }
    // Si pulsa "Cancelar" simplemente no hace nada
  }
}
