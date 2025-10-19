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
      <div style="display:flex;flex-direction:column;gap:10px;">
      <button type="button" (click)="selectCategory('quiet')" 
              [style.border]="selectedCategory==='quiet' ? '2px solid #4338ca' : '1px solid #e5e7eb'"
      style="text-align:left;border-radius:16px;padding:28px;background:#eef2ff;color:#111827;cursor:pointer;">
  <div style="font-size:1.75rem;font-weight:900;color:#114ea6;">🤫 Quiet Zone</div>
  <div style="opacity:.9;margin-top:10px;font-size:1.2rem;color:#0f172a;">Perfect for 1–2 people</div>
      </button>
      <div style="margin-left:6px;font-size:0.95rem;color:#0f172a;font-weight:600;">Showing up to 5 Quiet Zone rooms</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;">
      <button type="button" (click)="selectCategory('group')"
              [style.border]="selectedCategory==='group' ? '2px solid #047857' : '1px solid #e5e7eb'"
      style="text-align:left;border-radius:16px;padding:28px;background:#ecfdf5;color:#064e3b;cursor:pointer;">
  <div style="font-size:1.75rem;font-weight:900;color:#114ea6;">👥 Group Study</div>
  <div style="opacity:.9;margin-top:10px;font-size:1.2rem;color:#0f172a;">Great for 3–7 people</div>
      </button>
      <div style="margin-left:6px;font-size:0.95rem;color:#064e3b;font-weight:600;">Showing up to 5 Group Study rooms</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:10px;">
      <button type="button" (click)="selectCategory('large')"
              [style.border]="selectedCategory==='large' ? '2px solid #b45309' : '1px solid #e5e7eb'"
      style="text-align:left;border-radius:16px;padding:28px;background:#fffbeb;color:#7c2d12;cursor:pointer;">
  <div style="font-size:1.75rem;font-weight:900;color:#114ea6;">🏫 Large Group</div>
  <div style="opacity:.9;margin-top:10px;font-size:1.2rem;color:#0f172a;">Ideal for 8+ people</div>
      </button>
      <div style="margin-left:6px;font-size:0.95rem;color:#7c2d12;font-weight:600;">Showing up to 5 Large Group rooms</div>
      </div>
    </div>

    <div style="display:flex;gap:16px;align-items:center;margin-bottom:24px;">
  <label style="font-weight:700">Number of persons:</label>
  <select [(ngModel)]="desiredSize" (ngModelChange)="setDisplayedRooms(selectedCategory ?? capacityFilter, desiredSize)" style="padding:8px;border-radius:8px;border:1px solid #e5e7eb;">
    <option *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]" [value]="n">{{n}}</option>
  </select>
  <button (click)="applySelection()" style="background:#114ea6;color:#fff;border:none;border-radius:14px;padding:12px 16px;font-weight:800;font-size:1.05rem;cursor:pointer;box-shadow:0 6px 18px rgba(17,78,166,0.18);">Show available rooms</button>
  <button (click)="clearSelection()" style="background:#f3f4f6;color:#111827;border:1px solid #e5e7eb;border-radius:14px;padding:12px 16px;font-size:1.0rem;cursor:pointer;">Clear</button>
    </div>

    <ng-container *ngIf="displayedRooms.length; else none">
      <div *ngIf="fallbackNote" style="margin-bottom:12px;padding:10px;border-radius:8px;background:#fff8e1;border:1px solid #f5e1a4;color:#7c5a00;font-weight:600;">{{fallbackNote}}</div>
      <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:28px;">
        <li *ngFor="let r of displayedRooms" [style.border]="r._id===suggestedRoomId ? '2px solid #114ea6' : '1px solid #e5e7eb'" style="border-radius:14px;padding:26px;background:#fff;box-shadow:0 6px 18px rgba(3,7,18,0.03);position:relative;">
          <div *ngIf="r._id===suggestedRoomId" style="position:absolute;top:12px;right:12px;background:#114ea6;color:#fff;padding:6px 8px;border-radius:8px;font-weight:700;font-size:0.85rem;">Suggested</div>
          <div style="font-weight:900;font-size:1.45rem;margin-bottom:10px;color:#114ea6;">{{r.roomName}}</div>
          <div style="opacity:.9;font-size:1.18rem;margin-bottom:8px;color:#0f172a;">Capacity: {{r.capacity}}</div>
          <div style="opacity:.9;font-size:1.18rem;color:#0f172a;">Location: {{r.location}}</div>
          <div style="margin-top:12px;display:flex;gap:8px;">
            <button (click)="bookRoom(r._id)" style="background:#0f172a;color:#fff;border:none;padding:10px 12px;border-radius:8px;font-weight:700;cursor:pointer;">Book</button>
          </div>
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
  displayedRooms: any[] = [];
  fallbackNote: string | null = null;
  // id of the suggested room (first best match)
  suggestedRoomId: string | null = null;
  // number of persons the user wants to fit
  desiredSize: number = 1;
  constructor(private roomsService: RoomsService, private router: Router) {}
  ngOnInit(): void { this.load(); }

  capacityFilter: 'all'|'quiet'|'group'|'large' = 'all';
  selectedCategory: 'quiet'|'group'|'large'|null = null;

  // select a category and immediately update the active filter so
  // the UI (and the Show button) consistently operate on the same selection
  selectCategory(c: 'quiet'|'group'|'large') {
    this.selectedCategory = c;
    this.capacityFilter = c;
    this.setDisplayedRooms(c, this.desiredSize);
  }
  applySelection() {
    this.capacityFilter = this.selectedCategory ?? 'all';
    // ensure displayedRooms is current
    this.setDisplayedRooms(this.selectedCategory ?? 'all', this.desiredSize);
    const available = this.displayedRooms;
    if (available && available.length) {
      // navigate to booking page for the first available room
      const first = available[0];
      if (first && first._id) {
        this.router.navigate(['/book'], { queryParams: { roomId: first._id } });
      }
    }
  }
  bookRoom(id: string) { if (id) this.router.navigate(['/book'], { queryParams: { roomId: id } }); }
  clearSelection() { this.selectedCategory = null; this.capacityFilter = 'all'; this.setDisplayedRooms('all', this.desiredSize); this.fallbackNote = null; }

  load() { this.roomsService.list().subscribe(res => { this.rooms = res; /* initialize displayed list using current filter */ this.setDisplayedRooms(this.selectedCategory ?? this.capacityFilter ?? 'all', this.desiredSize); }); }

  // New: compute displayedRooms with graceful fallback when exact matches are empty
  setDisplayedRooms(filter: 'all'|'quiet'|'group'|'large', size: number = 1) {
    this.fallbackNote = null;
    if (!this.rooms || !this.rooms.length) {
      this.displayedRooms = [];
      return;
    }

    const byRange = (min: number, max?: number, enforceGreaterThanOne = false) => {
      const effectiveMin = enforceGreaterThanOne ? Math.max(2, min) : min;
      return this.rooms.filter(r => (typeof max === 'number'
        ? (r.capacity >= effectiveMin && r.capacity <= max && r.capacity >= size)
        : (r.capacity >= effectiveMin && r.capacity >= size)));
    };

    let results: any[] = [];
    if (filter === 'all') {
      results = this.rooms;
    } else if (filter === 'quiet') {
      // enforce capacity > 1 baseline for categories
      results = byRange(1, 2, true);
      if (!results.length) results = byRange(1, 3, true);
      if (!results.length) results = byRange(1, 4, true);
      if (!results.length) results = this.rooms; // last fallback
      if (results.length && results.some(r => r.capacity > 2)) this.fallbackNote = 'No exact quiet rooms found — showing nearest available rooms.';
    } else if (filter === 'group') {
      results = byRange(3, 7, true);
      if (!results.length) results = byRange(3, 8, true);
      if (!results.length) results = byRange(2, 8, true);
      if (!results.length) results = this.rooms;
      if (results.length && results.some(r => r.capacity < 3 || r.capacity > 7)) this.fallbackNote = 'No exact group-size rooms found — showing nearest available rooms.';
    } else if (filter === 'large') {
      results = byRange(8, undefined, true);
      if (!results.length) results = byRange(7, undefined, true);
      if (!results.length) results = byRange(6, undefined, true);
      if (!results.length) results = this.rooms;
      if (results.length && results.some(r => r.capacity < 8)) this.fallbackNote = 'No exact large rooms found — showing nearest available rooms.';
    }

    // ensure we show up to 5 rooms per category; prefer rooms that fit the requested size
    const final: any[] = [];
    const addUnique = (arr: any[]) => {
      for (const r of arr) {
        if (final.length >= 5) break;
        if (!final.find(x => x._id === r._id)) final.push(r);
      }
    };
    // add matching results first
    addUnique(results);
    if (final.length < 5) {
      // fill with other rooms that still meet the size
      addUnique(this.rooms.filter(r => r.capacity >= size));
    }
    if (final.length < 5) {
      // as last resort, add any remaining rooms
      addUnique(this.rooms);
    }
    this.displayedRooms = final;
    // suggested is first in final
    this.suggestedRoomId = (final && final.length) ? final[0]._id : null;
  }

  // keep old API for templates or code that might call it
  filteredRooms() { return this.displayedRooms.length ? this.displayedRooms : this.rooms; }
}


