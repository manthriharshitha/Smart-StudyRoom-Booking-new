const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
  },
  { timestamps: true }
);

BookingSchema.index({ roomId: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Booking', BookingSchema);


