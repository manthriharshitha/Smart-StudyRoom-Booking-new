import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoomsService } from '../../../core/rooms.service';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '../../../core/bookings.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  template: `
  <div style="max-width:560px;margin:20px auto;padding:12px;">
    <h2 style="font-size:1.5rem;margin-bottom:8px;">Book a Room</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex;flex-direction:column;gap:12px;background:#fff;padding:18px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.06);">

  <label style="font-size:1.2rem;color:#333">Your name</label>
  <input placeholder="Full name" formControlName="userName" style="padding:14px;border:1px solid #ddd;border-radius:6px;font-size:1.2rem;" />

  <label style="font-size:1.2rem;color:#333">Student ID</label>
  <input placeholder="Student ID" formControlName="studentId" style="padding:14px;border:1px solid #ddd;border-radius:6px;font-size:1.2rem;" />

  <label style="font-size:1.2rem;color:#333">Study purpose</label>
  <select formControlName="purpose" style="padding:12px;border:1px solid #ddd;border-radius:6px;font-size:1.2rem;">
        <option value="individual">Individual study</option>
        <option value="group_project">Group project</option>
        <option value="exam_preparation">Exam preparation</option>
        <option value="research">Research work</option>
        <option value="presentation_practice">Presentation practice</option>
      </select>

  <label style="font-size:1.2rem;color:#333">Room</label>
  <select formControlName="roomId" style="padding:12px;border:1px solid #ddd;border-radius:6px;font-size:1.2rem;">
        <option *ngFor="let r of rooms" [value]="r._id">{{r.roomName}} ({{r.capacity}})</option>
      </select>

  <label style="font-size:1.2rem;color:#333">Date (pick a date)</label>
  <input type="date" formControlName="endDate" style="padding:10px;border:1px solid #ddd;border-radius:6px;font-size:1.2rem;" />

  <label style="font-size:1.2rem;color:#333">Starting (enter time)</label>
  <input type="time" formControlName="startTime" style="padding:12px;border:1px solid #ddd;border-radius:6px;font-size:1.2rem;" />

  <label style="font-size:1.2rem;color:#333">Ending</label>
  <input type="time" formControlName="endTime" style="padding:12px;border:1px solid #ddd;border-radius:6px;font-size:1.2rem;" />
  
  

      <div style="display:flex;gap:10px;align-items:center;">
        <button type="button" (click)="check()" [disabled]="form.invalid" style="background:#1a73e8;color:#fff;border:none;padding:10px 12px;border-radius:8px;">Check availability</button>
        <div *ngIf="available===true" style="color:green;font-weight:600;">Slot available</div>
        <div *ngIf="available===false" style="color:red;font-weight:600;">Slot not available</div>
      </div>

      <button type="submit" [disabled]="form.invalid" style="width:100%;background:#0b63d6;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:700;font-size:1.05rem;">Book</button>
    </form>
  </div>
  `
})
export class BookingFormComponent {
  rooms: any[] = [];
  available: boolean | null = null;
  form!: FormGroup;
  constructor(private fb: FormBuilder, private roomsService: RoomsService, private bookings: BookingsService, private snack: MatSnackBar, private route: ActivatedRoute) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      studentId: ['', Validators.required],
      purpose: ['individual', Validators.required],
      roomId: ['', Validators.required],
  // startTime is time-only (HH:MM)
  startTime: ['', Validators.required],
      // endDate is date (YYYY-MM-DD) chosen with calendar
      endDate: ['', Validators.required],
  // endTime is time-only (HH:MM)
  endTime: ['', Validators.required],
    });
    this.roomsService.list().subscribe(res => {
      this.rooms = res;
      const roomId = this.route.snapshot.queryParamMap.get('roomId');
      if (roomId) {
        this.form.patchValue({ roomId });
      }
    });
  }
  private combineDateTime(date: string, time: string, ampm?: string): string | null {
    // date: YYYY-MM-DD, time: HH:MM, ampm optional ('AM'|'PM')
    if (!date || !time) return null;
    let [hh, mm] = time.split(':').map(s => parseInt(s, 10));
    if (isNaN(hh) || isNaN(mm)) return null;
    if (ampm) {
      // convert 12-hour to 24-hour
      if (ampm === 'PM' && hh < 12) hh += 12;
      if (ampm === 'AM' && hh === 12) hh = 0;
    }
    const hhStr = hh.toString().padStart(2, '0');
    const mmStr = mm.toString().padStart(2, '0');
    const iso = `${date}T${hhStr}:${mmStr}:00`;
    const d = new Date(iso);
    return d.toISOString();
  }

  check(): void {
    const v = this.form.value as any;
  const startIso = this.combineDateTime(v.endDate, v.startTime);
  const endIso = this.combineDateTime(v.endDate, v.endTime);
    if (!startIso || !endIso) {
      this.available = null;
      return;
    }
    this.bookings.availability(v.roomId, startIso, endIso).subscribe(res => this.available = res.available);
  }
  onSubmit(): void {
    if (this.form.invalid) { return; }
    const v = this.form.value as any;
  const startIso = this.combineDateTime(v.endDate, v.startTime);
  const endIso = this.combineDateTime(v.endDate, v.endTime);
  if (!startIso || !endIso) { this.snack.open('Please select date and times', 'Close', { duration: 2500 }); return; }
    const payload = {
      roomId: v.roomId,
      startTime: startIso,
      endTime: endIso,
      userName: v.userName,
      studentId: v.studentId,
      purpose: v.purpose
    };
    this.bookings.create(payload).subscribe({
      next: () => this.snack.open('Booking created', 'Close', { duration: 2000 }),
      error: (err) => this.snack.open(err.error?.error || 'Failed', 'Close', { duration: 3000 })
    });
  }
}


