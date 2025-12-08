import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

//Definicion de rutas de la aplicacion (lazy loading)
const routes: Routes =
[
  {
    path: 'auth',
      loadChildren: () =>
      import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'rooms',
      loadChildren: () =>
      import('./rooms/rooms-module').then(m => m.RoomsModule)
  },
  { path: 'reservations',
      loadChildren: () =>
      import('./reservations/reservations-module').then(m => m.ReservationsModule) ,
      canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/rooms',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/rooms',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
