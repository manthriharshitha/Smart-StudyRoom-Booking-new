Study Room Booking System (MEAN, MVC)

This project implements a university Study Room Booking System built with the MEAN stack (MongoDB, Express.js, Angular 17, Node.js). It prevents double bookings with robust conflict detection and includes admin analytics and CSV export.

Monorepo Layout
```
backend/           # Express.js REST API (MVC)
frontend/          # Angular 17 app (instructions + snippets)
```

Quick Start
- Prereqs: Node.js 18+, npm, MongoDB 6+, Angular CLI (`npm i -g @angular/cli`)

Backend (Express + MongoDB)
1) Configure env vars (create `backend/.env`):
   - `PORT=4000`
   - `MONGO_URI=mongodb://localhost:27017/study_room_booking`
   - `JWT_SECRET=change_me`
   - `CLIENT_ORIGIN=http://localhost:4200`
2) Install & run:
```
cd backend
npm install
npm run dev
```
3) Test API:
   - Health: `GET http://localhost:4000/api/health`
   - Auth: `POST /api/auth/signup`, `POST /api/auth/login`
   - Rooms: `GET/POST/PUT/DELETE /api/rooms`
   - Bookings: `GET /api/bookings`, `POST /api/bookings/availability`, `POST /api/bookings`
   - Admin: `GET /api/admin/analytics`, `GET /api/admin/export`

Frontend (Angular 17 + Angular Material + FullCalendar)
1) Create Angular app (recommended):
```
cd frontend
ng new study-room-booking --routing --style=scss
cd study-room-booking
npm install @angular/material @angular/cdk @angular/animations
npm install @fullcalendar/angular @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```
2) Enable animations (in `main.ts` or app config) and import Material modules you need.
3) Create core pieces:
```
ng g s core/auth
ng g s core/rooms
ng g s core/bookings
ng g g core/auth --flat --name=auth
ng g interceptor core/auth-token
ng g c features/auth/login
ng g c features/auth/signup
ng g c features/rooms/room-list
ng g c features/rooms/room-calendar
ng g c features/bookings/booking-form
ng g c features/bookings/booking-history
ng g c features/admin/admin-dashboard
```
4) Start Angular dev server:
```
ng serve --open
```

Key Features
- JWT authentication (students/admin), route guard
- Rooms CRUD (admin only)
- Booking CRUD with conflict detection (prevents overlapping time ranges)
- Calendar view of bookings (FullCalendar)
- Notifications (snackbar/success messages; backend stub for emails)
- Admin analytics + CSV export

Angular Code Snippets
- See `frontend/README.md` and `frontend/snippets/*` for ready-to-copy services, components, routing, and guards.

Notes
- Replace the notification stub in `backend/src/utils/notifier.js` with a real email provider if needed (e.g., nodemailer, SES).
- Ensure your Angular app points to the backend base URL `http://localhost:4000` and sends the JWT via `Authorization: Bearer <token>`.


