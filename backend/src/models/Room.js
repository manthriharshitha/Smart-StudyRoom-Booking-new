const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    location: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', RoomSchema);


