const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const authRoutes = require('../../backend/src/routes/auth.routes');
const roomRoutes = require('../../backend/src/routes/room.routes');
const bookingRoutes = require('../../backend/src/routes/booking.routes');
const adminRoutes = require('../../backend/src/routes/admin.routes');

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:4200',
  'https://your-frontend-url.netlify.app', // Update with your actual frontend URL
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ name: 'Study Room Booking API', docs: '/api/health' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

// Netlify Functions handler
exports.handler = async (event, context) => {
  // Convert Netlify event to Express request
  const request = {
    method: event.httpMethod,
    url: event.path,
    headers: event.headers,
    body: event.body
  };

  const response = {
    statusCode: 200,
    headers: {},
    body: ''
  };

  // Handle the request with Express app
  return new Promise((resolve) => {
    app(request, response, () => {
      resolve({
        statusCode: response.statusCode,
        headers: response.headers,
        body: response.body
      });
    });
  });
};
