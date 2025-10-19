import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoomsService } from '../../../core/rooms.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  template: `
  <div style="max-width:900px;margin:20px auto;padding:12px;">
    <h2 style="margin:0 0 12px 0;color:#114ea6;">Manage Rooms</h2>

    <div style="display:flex;gap:12px;margin-bottom:18px;align-items:center;">
      <form [formGroup]="form" (ngSubmit)="onSave()" style="display:flex;gap:8px;align-items:center;">
        <input placeholder="Room name" formControlName="roomName" style="padding:10px;border:1px solid #ddd;border-radius:8px;" />
        <input placeholder="Capacity" type="number" formControlName="capacity" style="width:120px;padding:10px;border:1px solid #ddd;border-radius:8px;" />
        <input placeholder="Location" formControlName="location" style="padding:10px;border:1px solid #ddd;border-radius:8px;" />
        <button type="submit" [disabled]="form.invalid" style="background:#114ea6;color:#fff;padding:8px 12px;border-radius:8px;border:none">{{editingId ? 'Update' : 'Create'}}</button>
        <button type="button" (click)="onClear()" style="background:#f3f4f6;color:#111827;padding:8px 12px;border-radius:8px;border:1px solid #e5e7eb">Clear</button>
      </form>
    </div>
  <div *ngIf="errorMessage" style="margin-bottom:12px;color:#b00020;background:#fff1f2;padding:12px;border-radius:8px">{{errorMessage}}</div>

    <div *ngIf="rooms.length; else none" style="background:#fff;padding:12px;border-radius:10px;box-shadow:0 8px 24px rgba(3,7,18,0.06);">
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr style="background:#114ea6;color:#fff;text-align:left;"><th style="padding:12px">Name</th><th style="padding:12px">Capacity</th><th style="padding:12px">Location</th><th style="padding:12px;text-align:right">Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let r of rooms" style="border-bottom:1px solid #eef3fb;">
            <td style="padding:12px">{{r.roomName}}</td>
            <td style="padding:12px">{{r.capacity}}</td>
            <td style="padding:12px">{{r.location}}</td>
            <td style="padding:12px;text-align:right">
              <button (click)="onEdit(r)" style="margin-right:8px;padding:6px 10px;border-radius:8px;border:1px solid #cfe3ff;background:#fff;color:#114ea6">Edit</button>
              <button (click)="onDelete(r)" style="padding:6px 10px;border-radius:8px;border:none;background:#ff595e;color:#fff">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ng-template #none>
      <div style="padding:12px;background:#fafafa;border-radius:8px">No rooms found.</div>
    </ng-template>
  </div>
  `
})
export class AdminRoomsComponent implements OnInit {
  rooms: any[] = [];
  form: any;
  editingId: string | null = null;
  errorMessage: string | null = null;
  constructor(private roomsService: RoomsService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.form = this.fb.group({ roomName: ['', Validators.required], capacity: [1, [Validators.required, Validators.min(1)]], location: ['', Validators.required] });
  }
  ngOnInit(): void { this.load(); }
  load() { this.roomsService.list().subscribe(res => this.rooms = res || []);
  }
  onEdit(r: any) {
    this.editingId = r._id;
    this.form.patchValue({ roomName: r.roomName, capacity: r.capacity, location: r.location });
  }
  onDelete(r: any) {
    if (!confirm('Delete room "' + r.roomName + '"?')) return;
    this.errorMessage = null;
  this.roomsService.remove(r._id).subscribe({ next: () => { this.snack.open('Deleted', 'Close', { duration: 2000 }); this.load(); }, error: (err) => { this.errorMessage = err?.error?.error || 'Delete failed'; this.snack.open(this.errorMessage || '', 'Close', { duration: 3000 }); } });
  }
  onClear() { this.editingId = null; this.form.reset({ roomName:'', capacity:1, location:'' }); }
  onSave() {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.errorMessage = null;
    if (this.editingId) {
  this.roomsService.update(this.editingId, v).subscribe({ next: () => { this.snack.open('Updated', 'Close', { duration: 2000 }); this.onClear(); this.load(); }, error: (err) => { this.errorMessage = err?.error?.error || 'Update failed'; this.snack.open(this.errorMessage || '', 'Close', { duration: 3000 }); } });
    } else {
  this.roomsService.create(v).subscribe({ next: () => { this.snack.open('Created', 'Close', { duration: 2000 }); this.onClear(); this.load(); }, error: (err) => { this.errorMessage = err?.error?.error || 'Create failed'; this.snack.open(this.errorMessage || '', 'Close', { duration: 3000 }); } });
    }
  }
}
