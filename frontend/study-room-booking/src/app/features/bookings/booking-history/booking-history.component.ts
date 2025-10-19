import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookingsService } from '../../../core/bookings.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
  <div style="max-width:980px;margin:28px auto;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <h2 style="margin:0;font-size:1.6rem;color:#0b63d6;">My Bookings</h2>
      <div style="color:#666;font-size:0.95rem">Showing {{bookings?.length || 0}} booking(s)</div>
    </div>

    <div *ngIf="errorMessage" style="color:#b00020;background:#fff1f2;padding:12px;border-radius:8px;margin-bottom:12px">{{errorMessage}}</div>
    <div *ngIf="!bookings?.length && !errorMessage" style="color:#666;margin-bottom:12px">No bookings found.</div>

    <div *ngIf="bookings?.length" style="overflow:auto;background:#fff;border-radius:10px;padding:12px;box-shadow:0 8px 24px rgba(3,7,18,0.06);">
      <table style="width:100%;border-collapse:collapse;min-width:640px;font-size:1.05rem;">
        <thead>
          <tr style="background:#114ea6;color:#fff;text-align:left;">
            <th style="padding:12px 16px;font-weight:700;">Room</th>
            <th style="padding:12px 16px;font-weight:700;">Start</th>
            <th style="padding:12px 16px;font-weight:700;">End</th>
            <th style="padding:12px 16px;font-weight:700;">Status</th>
            <th style="padding:12px 16px;font-weight:700;text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let b of bookings; let i = index" [style.background]="i % 2 === 0 ? '#fbfdff' : 'transparent'" style="border-bottom:1px solid #eef3fb;">
            <td style="padding:12px 16px;vertical-align:middle">{{b.roomId?.roomName || '—'}}</td>
            <td style="padding:12px 16px;vertical-align:middle">{{b.startTime | date:'short'}}</td>
            <td style="padding:12px 16px;vertical-align:middle">{{b.endTime | date:'short'}}</td>
            <td style="padding:12px 16px;vertical-align:middle">
              <span [ngStyle]="{'background': b.status==='booked' ? '#e6f4ea' : '#fff3cd','color': b.status==='booked' ? '#1b7a3a' : '#856404','padding':'6px 10px','border-radius':'999px','font-weight':'700','font-size':'0.95rem'}">{{b.status}}</span>
            </td>
            <td style="padding:12px 16px;vertical-align:middle;text-align:right;white-space:nowrap;">
              <button (click)="onEdit(b)" style="margin-right:8px;padding:8px 10px;border-radius:8px;border:1px solid #cfe3ff;background:#fff;color:#114ea6;cursor:pointer">Edit</button>
              <button (click)="onCancel(b)" style="padding:8px 10px;border-radius:8px;border:none;background:#ff595e;color:#fff;cursor:pointer">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  errorMessage = '';
  private sub?: Subscription;
  constructor(private bookingsService: BookingsService, private router: Router, private snack: MatSnackBar) {}
  ngOnInit(): void {
    this.load();
    this.sub = this.bookingsService.changed$.subscribe(() => this.load());
  }

  load() {
    this.errorMessage = '';
    this.bookingsService.list().subscribe({
      next: (res) => this.bookings = res,
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.bookings = [];
        this.errorMessage = err?.error?.error || 'Failed to load bookings';
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onEdit(booking: any) {
    // navigate to booking form with booking id to edit
    this.router.navigate(['/book'], { queryParams: { bookingId: booking._id } });
  }

  onCancel(booking: any) {
    if (!confirm('Cancel this booking?')) return;
    this.bookingsService.remove(booking._id).subscribe({
      next: () => {
        // immediate local update for better UX
        this.bookings = this.bookings.filter(b => b._id !== booking._id);
        this.snack.open('Booking cancelled', 'Close', { duration: 2000 });
      },
      error: (err) => {
        const msg = err?.error?.error || err?.message || 'Failed to cancel';
        this.snack.open(msg, 'Close', { duration: 3000 });
        console.error('Cancel failed', err);
      }
    });
  }
}


