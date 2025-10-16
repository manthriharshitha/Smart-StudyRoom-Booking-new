const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

async function analytics(req, res) {
  const totalBookings = await Booking.countDocuments({});
  const cancelled = await Booking.countDocuments({ status: 'cancelled' });
  const booked = await Booking.countDocuments({ status: 'booked' });
  const rooms = await Room.countDocuments({});
  const users = await User.countDocuments({});
  const peak = await Booking.aggregate([
    {
      $group: {
        _id: { hour: { $hour: '$startTime' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);
  return res.json({ totalBookings, booked, cancelled, rooms, users, peakHours: peak });
}

async function exportCsv(req, res) {
  const { stringify } = require('csv-stringify');
  const cursor = Booking.find({}).populate('roomId').populate('userId').cursor();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="bookings.csv"');
  const stringifier = stringify({ header: true, columns: ['user', 'email', 'role', 'room', 'startTime', 'endTime', 'status'] });
  stringifier.pipe(res);
  for await (const b of cursor) {
    stringifier.write([
      b.userId?.name,
      b.userId?.email,
      b.userId?.role,
      b.roomId?.roomName,
      b.startTime.toISOString(),
      b.endTime.toISOString(),
      b.status,
    ]);
  }
  stringifier.end();
}

module.exports = { analytics, exportCsv };


