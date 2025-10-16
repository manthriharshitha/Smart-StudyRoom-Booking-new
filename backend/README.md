Study Room Booking System - Backend (Express + MongoDB)

Prerequisites
- Node.js 18+
- MongoDB 6+

Setup
1. Copy environment file:
   - Create `.env` in `backend/` with:
     - `PORT=4000`
     - `MONGO_URI=mongodb://localhost:27017/study_room_booking`
     - `JWT_SECRET=change_me`
     - `CLIENT_ORIGIN=http://localhost:4200`
2. Install dependencies:
   - `cd backend`
   - `npm install`
3. Run server:
   - `npm run dev`

API Overview
- `GET /api/health` health check
- Auth (`/api/auth`): `POST /signup`, `POST /login`
- Rooms (`/api/rooms`): `GET /`, `GET /:id`, `POST /` [admin], `PUT /:id` [admin], `DELETE /:id` [admin]
- Bookings (`/api/bookings`): `GET /`, `GET /:id`, `POST /availability`, `POST /`, `PUT /:id`, `DELETE /:id`
- Admin (`/api/admin`): `GET /analytics`, `GET /export` (CSV)

JWT
- Send `Authorization: Bearer <token>` header for all protected routes.

Conflict Detection
- Booking creation/update validates overlapping intervals per room and rejects conflicts with HTTP 409.


