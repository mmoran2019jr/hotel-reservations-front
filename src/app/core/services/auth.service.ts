import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/enviroment';

const TOKEN_KEY = 'hotel_token';
const USER_KEY = 'hotel_user';
//Registro , Login de usuario, guarda token en navegador
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap(res => this.handleAuthSuccess(res))
      );
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload)
      .pipe(
        tap(res => this.handleAuthSuccess(res))
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.userId : null;
  }


  private handleAuthSuccess(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res));
    this.currentUserSubject.next(res);
  }

  private getStoredUser(): AuthResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  }
}
