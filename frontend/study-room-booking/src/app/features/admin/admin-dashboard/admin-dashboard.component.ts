import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
  <div style="max-width:900px;margin:24px auto;">
    <h2>Admin Dashboard</h2>
    <div *ngIf="stats">
      <p>Total bookings: {{stats.totalBookings}}</p>
      <p>Booked: {{stats.booked}} | Cancelled: {{stats.cancelled}}</p>
      <p>Rooms: {{stats.rooms}} | Users: {{stats.users}}</p>
      <h3>Peak Hours</h3>
      <ul>
        <li *ngFor="let p of stats.peakHours">Hour {{p._id.hour}}: {{p.count}} bookings</li>
      </ul>
      <a [href]="exportUrl" target="_blank">Export CSV</a>
    </div>
  </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: any;
  exportUrl = `${environment.apiUrl}/admin/export`;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/admin/analytics`).subscribe(res => this.stats = res);
  }
}


