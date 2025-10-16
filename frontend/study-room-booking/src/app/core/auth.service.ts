import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(`${environment.apiUrl}/auth/login`, { email, password });
  }
  signup(payload: { name: string; email: string; password: string; role?: 'student' | 'admin' }) {
    return this.http.post<{ token: string; user: any }>(`${environment.apiUrl}/auth/signup`, payload);
  }
}


