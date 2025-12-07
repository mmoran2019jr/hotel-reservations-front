import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { PageResponse } from '../models/pagination.model';
import { environment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = `${environment.apiBaseUrl}/rooms`;

  constructor(private http: HttpClient) {}

  getRooms(
    page = 0,
    size = 10,
    type?: string,
    minPrice?: number,
    maxPrice?: number,
    onlyAvailable?: boolean
  ): Observable<PageResponse<Room>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (type) {
      params = params.set('type', type);
    }
    if (minPrice != null) {
      params = params.set('minPrice', minPrice);
    }
    if (maxPrice != null) {
      params = params.set('maxPrice', maxPrice);
    }
    if (onlyAvailable != null) {
      params = params.set('onlyAvailable', onlyAvailable);
    }

    return this.http.get<PageResponse<Room>>(this.apiUrl, { params });
  }

  getRoomById(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  // opcionales (si vas a tener CRUD desde el front):
  createRoom(room: Partial<Room>): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  updateRoom(id: string, room: Partial<Room>): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
