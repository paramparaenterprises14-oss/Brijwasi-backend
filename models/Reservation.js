const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  userId: {
    type: String,
    required: false,
  },
  customerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: false,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  guestCount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Seated', 'Cancelled', 'No-Show'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);