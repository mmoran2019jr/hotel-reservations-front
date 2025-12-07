import { NgModule } from '@angular/core';
import { RoomsRoutingModule } from './rooms-routing-module';
import { SharedModule } from '../shared/shared-module';
//import { RoomsListPageComponent } from './pages/rooms-list-page/rooms-list-page';
//import { RoomDetailPageComponent } from './pages/room-detail-page/room-detail-page.component';
import { RoomsListPage } from './pages/rooms-list-page/rooms-list-page';
import { RoomDetailPage } from './pages/room-detail-page/room-detail-page';

import { ReactiveFormsModule } from '@angular/forms';           // para [formGroup]

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDivider } from '@angular/material/divider';

@NgModule({
  declarations: [
    //RoomDetailPageComponent,
    //RoomsListPageComponent,
    RoomsListPage,
    RoomDetailPage,
  ],
  imports: [
    SharedModule,
    RoomsRoutingModule,
    ReactiveFormsModule,           // SIN ESTO: "Can't bind to 'formGroup'"

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatDivider

  ],
})
export class RoomsModule {}
