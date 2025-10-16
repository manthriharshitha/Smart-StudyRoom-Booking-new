import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private _changed = new Subject<void>();
  changed$ = this._changed.asObservable();
  constructor(private http: HttpClient) {}
  list(params?: any) { return this.http.get<any[]>(`${environment.apiUrl}/bookings`, { params }); }
  availability(roomId: string, startTime: string, endTime: string) {
    return this.http.post<{ available: boolean }>(`${environment.apiUrl}/bookings/availability`, { roomId, startTime, endTime });
  }
  create(payload: { roomId: string; startTime: string; endTime: string; userName?: string; studentId?: string; purpose?: string }) {
    return this.http.post(`${environment.apiUrl}/bookings`, payload).pipe(
      // notify subscribers that bookings changed when the create call succeeds
      tap(() => this._changed.next())
    );
  }
  update(id: string, payload: any) { return this.http.put(`${environment.apiUrl}/bookings/${id}`, payload); }
  remove(id: string) { return this.http.delete(`${environment.apiUrl}/bookings/${id}`); }
}


