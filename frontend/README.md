Angular 17 Frontend - Study Room Booking System

This folder provides guidance and snippets to build the Angular frontend quickly.

Create Project
```
ng new study-room-booking --routing --style=scss
cd study-room-booking
npm install @angular/material @angular/cdk @angular/animations
npm install @fullcalendar/angular @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

Environment
Set API base in `src/environments/environment.ts` as needed:
```ts
export const environment = {
  apiUrl: 'http://localhost:4000/api'
};
```

Auth Interceptor (attach JWT)
```ts
import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(req);
  }
}
```

Auth Guard
```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
```

Services
```ts
// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  login(email: string, password: string) {
    return this.http.post<{ token: string, user: any }>(`${environment.apiUrl}/auth/login`, { email, password });
  }
  signup(payload: { name: string; email: string; password: string; role?: 'student'|'admin' }) {
    return this.http.post<{ token: string, user: any }>(`${environment.apiUrl}/auth/signup`, payload);
  }
}

// rooms.service.ts
@Injectable({ providedIn: 'root' })
export class RoomsService {
  private http = inject(HttpClient);
  list(q?: string) { return this.http.get<any[]>(`${environment.apiUrl}/rooms`, { params: q ? { q } : {} }); }
  create(room: any) { return this.http.post(`${environment.apiUrl}/rooms`, room); }
  update(id: string, room: any) { return this.http.put(`${environment.apiUrl}/rooms/${id}`, room); }
  remove(id: string) { return this.http.delete(`${environment.apiUrl}/rooms/${id}`); }
}

// bookings.service.ts
@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  list(params?: any) { return this.http.get<any[]>(`${environment.apiUrl}/bookings`, { params }); }
  availability(roomId: string, startTime: string, endTime: string) {
    return this.http.post<{ available: boolean }>(`${environment.apiUrl}/bookings/availability`, { roomId, startTime, endTime });
  }
  create(roomId: string, startTime: string, endTime: string) {
    return this.http.post(`${environment.apiUrl}/bookings`, { roomId, startTime, endTime });
  }
  update(id: string, payload: any) { return this.http.put(`${environment.apiUrl}/bookings/${id}`, payload); }
  remove(id: string) { return this.http.delete(`${environment.apiUrl}/bookings/${id}`); }
}
```

Routing
```ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },
  { path: '', canActivate: [authGuard], children: [
      { path: '', redirectTo: 'rooms', pathMatch: 'full' },
      { path: 'rooms', loadComponent: () => import('./features/rooms/room-list/room-list.component').then(m => m.RoomListComponent) },
      { path: 'calendar', loadComponent: () => import('./features/rooms/room-calendar/room-calendar.component').then(m => m.RoomCalendarComponent) },
      { path: 'book', loadComponent: () => import('./features/bookings/booking-form/booking-form.component').then(m => m.BookingFormComponent) },
      { path: 'history', loadComponent: () => import('./features/bookings/booking-history/booking-history.component').then(m => m.BookingHistoryComponent) },
      { path: 'admin', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  ]}
];
```

Material Snackbar for notifications
```ts
import { MatSnackBar } from '@angular/material/snack-bar';
// Inject and call snackBar.open('Booking created', 'Close', { duration: 3000 });
```

FullCalendar Example (Room Calendar)
```ts
import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BookingsService } from '../../core/bookings.service';

@Component({
  selector: 'app-room-calendar',
  standalone: true,
  template: `<full-calendar [options]="calendarOptions"></full-calendar>`
})
export class RoomCalendarComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    events: (info, success, failure) => {
      this.bookings.list({ start: info.startStr, end: info.endStr }).subscribe({
        next: (items) => success(items.map(b => ({
          title: b.roomId?.roomName || 'Booked',
          start: b.startTime,
          end: b.endTime
        }))),
        error: failure
      });
    }
  };
  constructor(private bookings: BookingsService) {}
}
```

Run
```
ng serve --open
```


