import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoomsService } from '../../../core/rooms.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
  <div style="max-width:1000px;margin:24px auto;font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <h2 style="margin:0 0 20px 0;font-weight:900;letter-spacing:-.3px;font-size:1.8rem;color:#114ea6;">Find a room by group size</h2>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:28px;margin-bottom:28px;">
      <button type="button" (click)="selectCategory('quiet')" 
              [style.border]="selectedCategory==='quiet' ? '2px solid #4338ca' : '1px solid #e5e7eb'"
      style="text-align:left;border-radius:16px;padding:28px;background:#eef2ff;color:#111827;cursor:pointer;">
  <div style="font-size:1.75rem;font-weight:900;color:#114ea6;">🤫 Quiet Zone</div>
  <div style="opacity:.9;margin-top:10px;font-size:1.2rem;color:#0f172a;">Perfect for 1–2 people</div>
      </button>

      <button type="button" (click)="selectCategory('group')"
              [style.border]="selectedCategory==='group' ? '2px solid #047857' : '1px solid #e5e7eb'"
      style="text-align:left;border-radius:16px;padding:28px;background:#ecfdf5;color:#064e3b;cursor:pointer;">
  <div style="font-size:1.75rem;font-weight:900;color:#114ea6;">👥 Group Study</div>
  <div style="opacity:.9;margin-top:10px;font-size:1.2rem;color:#0f172a;">Great for 4–8 people</div>
      </button>

      <button type="button" (click)="selectCategory('large')"
              [style.border]="selectedCategory==='large' ? '2px solid #b45309' : '1px solid #e5e7eb'"
      style="text-align:left;border-radius:16px;padding:28px;background:#fffbeb;color:#7c2d12;cursor:pointer;">
  <div style="font-size:1.75rem;font-weight:900;color:#114ea6;">🏫 Large Group</div>
  <div style="opacity:.9;margin-top:10px;font-size:1.2rem;color:#0f172a;">Ideal for 8–10 people</div>
      </button>
    </div>

    <div style="display:flex;gap:16px;align-items:center;margin-bottom:24px;">
  <button (click)="applySelection()" style="background:#114ea6;color:#fff;border:none;border-radius:14px;padding:16px 20px;font-weight:800;font-size:1.18rem;cursor:pointer;box-shadow:0 6px 18px rgba(17,78,166,0.18);">Show available rooms</button>
  <button (click)="clearSelection()" style="background:#f3f4f6;color:#111827;border:1px solid #e5e7eb;border-radius:14px;padding:16px 20px;font-size:1.1rem;cursor:pointer;">Clear</button>
    </div>

    <ng-container *ngIf="filteredRooms().length; else none">
      <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:28px;">
        <li *ngFor="let r of filteredRooms()" style="border:1px solid #e5e7eb;border-radius:14px;padding:26px;background:#fff;box-shadow:0 6px 18px rgba(3,7,18,0.03);">
          <div style="font-weight:900;font-size:1.45rem;margin-bottom:10px;color:#114ea6;">{{r.roomName}}</div>
          <div style="opacity:.9;font-size:1.18rem;margin-bottom:8px;color:#0f172a;">Capacity: {{r.capacity}}</div>
          <div style="opacity:.9;font-size:1.18rem;color:#0f172a;">Location: {{r.location}}</div>
        </li>
      </ul>
    </ng-container>
    <ng-template #none>
      <div style="padding:14px;border:1px dashed #e5e7eb;border-radius:10px;background:#fafafa;">😕 Not available for the selected group size</div>
    </ng-template>
  </div>
  `
})
export class RoomListComponent implements OnInit {
  rooms: any[] = [];
  constructor(private roomsService: RoomsService, private router: Router) {}
  ngOnInit(): void { this.load(); }

  capacityFilter: 'all'|'quiet'|'group'|'large' = 'all';
  selectedCategory: 'quiet'|'group'|'large'|null = null;

  selectCategory(c: 'quiet'|'group'|'large') { this.selectedCategory = c; }
  applySelection() {
    this.capacityFilter = this.selectedCategory ?? 'all';
    const available = this.filteredRooms();
    if (available && available.length) {
      // navigate to booking page for the first available room
      const first = available[0];
      if (first && first._id) {
        this.router.navigate(['/book'], { queryParams: { roomId: first._id } });
      }
    }
  }
  clearSelection() { this.selectedCategory = null; this.capacityFilter = 'all'; }

  load() { this.roomsService.list().subscribe(res => this.rooms = res); }

  filteredRooms() {
    switch (this.capacityFilter) {
      case 'quiet': return this.rooms.filter(r => r.capacity >= 1 && r.capacity <= 2);
      case 'group': return this.rooms.filter(r => r.capacity >= 4 && r.capacity <= 8);
      case 'large': return this.rooms.filter(r => r.capacity >= 8 && r.capacity <= 10);
      default: return this.rooms;
    }
  }
}


