import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
// Guard que protege rutas que requieren autenticacion
// Valida autenticacion de usuario
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (this.authService.isAuthenticated()) {
      return true;
    }

    // redirige al login (módulo auth) y conserva la URL a la que quería ir
    return this.router.createUrlTree(['/auth'], {
      queryParams: { returnUrl: state.url },
    });
  }
}
