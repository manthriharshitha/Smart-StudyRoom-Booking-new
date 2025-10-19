const Booking = require('../models/Booking');
const Room = require('../models/Room');

function buildOverlapFilter(roomId, startTime, endTime) {
  return {
    roomId,
    status: 'booked',
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // any overlap
    ],
  };
}

async function list(req, res) {
  const { roomId, userId, start, end } = req.query;
  const filter = {};
  // by default show only active (booked) bookings; allow including cancelled when includeCancelled=true
  if (req.query.includeCancelled !== 'true') filter.status = 'booked';
  if (roomId) filter.roomId = roomId;
  if (userId) filter.userId = userId;
  if (start || end) {
    filter.startTime = start ? { $gte: new Date(start) } : undefined;
    filter.endTime = end ? { $lte: new Date(end) } : undefined;
  }
  const bookings = await Booking.find(filter).populate('roomId').populate('userId').sort({ startTime: 1 });
  return res.json(bookings);
}

async function getById(req, res) {
  const booking = await Booking.findById(req.params.id).populate('roomId').populate('userId');
  if (!booking) return res.status(404).json({ error: 'Not found' });
  return res.json(booking);
}

async function checkAvailability(req, res) {
  const { roomId, startTime, endTime } = req.body;
  if (!roomId || !startTime || !endTime) return res.status(400).json({ error: 'Missing fields' });
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (start >= end) return res.status(400).json({ error: 'Invalid time range' });
  const conflict = await Booking.exists(buildOverlapFilter(roomId, start, end));
  return res.json({ available: !conflict });
}

async function create(req, res) {
  const { roomId, startTime, endTime } = req.body;
  if (!roomId || !startTime || !endTime) return res.status(400).json({ error: 'Missing fields' });
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (start >= end) return res.status(400).json({ error: 'Invalid time range' });
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const hasConflict = await Booking.exists(buildOverlapFilter(roomId, start, end));
  if (hasConflict) return res.status(409).json({ error: 'Time slot already booked' });
  const booking = await Booking.create({ userId: req.user.id, roomId, startTime: start, endTime: end, status: 'booked' });
  return res.status(201).json(booking);
}

async function update(req, res) {
  const { startTime, endTime, status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Not found' });
  if (String(booking.userId) !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (startTime || endTime) {
    const start = new Date(startTime || booking.startTime);
    const end = new Date(endTime || booking.endTime);
    if (start >= end) return res.status(400).json({ error: 'Invalid time range' });
    const hasConflict = await Booking.exists({
      ...buildOverlapFilter(booking.roomId, start, end),
      _id: { $ne: booking._id },
    });
    if (hasConflict) return res.status(409).json({ error: 'Time slot already booked' });
    booking.startTime = start;
    booking.endTime = end;
  }
  if (status) booking.status = status;
  await booking.save();
  return res.json(booking);
}

async function remove(req, res) {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Not found' });
  if (String(booking.userId) !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // mark as cancelled instead of deleting so we retain an audit trail
  booking.status = 'cancelled';
  await booking.save();
  console.log(`Booking ${booking._id} cancelled by user ${req.user?.id} (role=${req.user?.role})`);
  return res.json({ success: true });
}

module.exports = { list, getById, checkAvailability, create, update, remove };


