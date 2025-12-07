import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationsListPage } from './pages/reservations-list-page/reservations-list-page';

const routes: Routes = [
  {
    path: '',
    component: ReservationsListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationsRoutingModule {}
