import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:8081/api/reservations';

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
