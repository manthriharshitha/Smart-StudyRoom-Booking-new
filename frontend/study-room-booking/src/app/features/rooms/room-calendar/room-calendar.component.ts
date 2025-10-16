import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HttpClientModule } from '@angular/common/http';
import { BookingsService } from '../../../core/bookings.service';

@Component({
  selector: 'app-room-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, HttpClientModule],
  template: `<div style="max-width:1000px;margin:24px auto; font-size:16px;">
    <div style="font-size:1rem;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(3,7,18,0.06);">
      <full-calendar [options]="calendarOptions"></full-calendar>
    </div>
  </div>`
})
export class RoomCalendarComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    events: (info, success, failure) => {
      this.bookings.list({ start: info.startStr, end: info.endStr }).subscribe({
        next: (items) => success(items.map((b: any) => ({
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


