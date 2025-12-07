import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomsListPage } from './pages/rooms-list-page/rooms-list-page';
import { RoomDetailPage } from './pages/room-detail-page/room-detail-page';

const routes: Routes = [
  {
    path: '',
    component: RoomsListPage,
  },
  {
    path: ':id',
    component: RoomDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomsRoutingModule {}
