import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  constructor(private http: HttpClient) {}
  list(q?: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/rooms`, { params: q ? { q } : {} });
  }
  create(room: any) { return this.http.post(`${environment.apiUrl}/rooms`, room); }
  update(id: string, room: any) { return this.http.put(`${environment.apiUrl}/rooms/${id}`, room); }
  remove(id: string) { return this.http.delete(`${environment.apiUrl}/rooms/${id}`); }
}


