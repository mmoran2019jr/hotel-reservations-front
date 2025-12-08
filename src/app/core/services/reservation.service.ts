import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

import { environment } from '../../../environments/enviroment';
//Servicios de reservaciones / Valida token JWT valido
@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = `${environment.apiBaseUrl}/reservations`;

  constructor(private http: HttpClient) {}

  createReservation(payload: {
    roomId: string;
    userId: string;
    checkInDate: string;
    checkOutDate: string;
  }): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, payload);
  }

  getReservationsByUser(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateReservation(
    id: string,
    payload: {
      roomId: string;
      userId: string;
      checkInDate: string;
      checkOutDate: string;
    }
  ): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, payload);
  }

  cancelReservation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkoutReservation(id: string): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/${id}/checkout`, {});
  }
}
