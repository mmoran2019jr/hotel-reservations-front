import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejo básico de errores HTTP
        let message = 'Error desconocido';

        if (error.status === 0) {
          message = 'No hay conexión con el servidor';
        } else if (error.status === 400) {
          message = 'Solicitud inválida';
        } else if (error.status === 401 || error.status === 403) {
          message = 'No autorizado. Inicia sesión nuevamente.';
        } else if (error.status === 404) {
          message = 'Recurso no encontrado';
        } else if (error.status >= 500) {
          message = 'Error en el servidor';
        }

        this.snackBar.open(message, 'Cerrar', {
          duration: 3000,
        });

        return throwError(() => error);
      })
    );
  }
}
