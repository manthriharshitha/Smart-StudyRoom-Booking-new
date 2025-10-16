const Room = require('../models/Room');

async function list(req, res) {
  const { q } = req.query;
  const filter = q ? { roomName: { $regex: q, $options: 'i' } } : {};
  const rooms = await Room.find(filter).sort({ roomName: 1 });
  return res.json(rooms);
}

async function getById(req, res) {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Not found' });
  return res.json(room);
}

async function create(req, res, next) {
  try {
    const { roomName, capacity, location } = req.body;
    if (!roomName || !capacity || !location) return res.status(400).json({ error: 'Missing fields' });
    const created = await Room.create({ roomName, capacity, location });
    return res.status(201).json(created);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Room name already exists' });
    }
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(updated);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Room name already exists' });
    }
    return next(err);
  }
}

async function remove(req, res) {
  const deleted = await Room.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  return res.json({ success: true });
}

module.exports = { list, getById, create, update, remove };


