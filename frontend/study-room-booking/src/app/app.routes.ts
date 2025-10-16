import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'rooms', pathMatch: 'full' },
      { path: 'rooms', loadComponent: () => import('./features/rooms/room-list/room-list.component').then(m => m.RoomListComponent) },
      { path: 'calendar', loadComponent: () => import('./features/rooms/room-calendar/room-calendar.component').then(m => m.RoomCalendarComponent) },
      { path: 'book', loadComponent: () => import('./features/bookings/booking-form/booking-form.component').then(m => m.BookingFormComponent) },
      { path: 'history', loadComponent: () => import('./features/bookings/booking-history/booking-history.component').then(m => m.BookingHistoryComponent) },
      { path: 'admin', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
    ]
  }
];
