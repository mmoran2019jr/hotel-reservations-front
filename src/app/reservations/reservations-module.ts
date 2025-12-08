import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ReservationsRoutingModule } from './reservations-routing-module';
import { Reservations } from './reservations';
import { ReservationsListPage } from './pages/reservations-list-page/reservations-list-page';
import { SharedModule } from '../shared/shared-module';


@NgModule({
  declarations: [
    Reservations,
    ReservationsListPage
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ReservationsRoutingModule
  ]
})
export class ReservationsModule { }
