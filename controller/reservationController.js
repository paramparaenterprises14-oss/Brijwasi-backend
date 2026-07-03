
const Reservation = require('../models/Reservation');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// Generate a unique booking ID (e.g. FD-7392)
const generateBookingId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FD-${randomNum}`;
};

// Check if a time slot is available
const checkAvailability = async (req, res) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({ success: false, data: null, message: 'Date and time are required' });
    }

    const existingBookings = await Reservation.find({
      date,
      timeSlot: time,
      status: { $ne: 'Cancelled' },
    });

    const totalGuests = existingBookings.reduce((sum, booking) => sum + booking.guestCount, 0);
    const isFullyBooked = totalGuests >= 30;

    res.json({
      success: true,
      data: { totalGuests, isFullyBooked },
      message: isFullyBooked ? 'Slot is fully booked' : 'Slot is available',
    });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const { customerName, email, phone, date, timeSlot, guestCount } = req.body;

    const existingBookings = await Reservation.find({
      date,
      timeSlot,
      status: { $ne: 'Cancelled' },
    });

    const totalGuests = existingBookings.reduce((sum, booking) => sum + booking.guestCount, 0);

    if (totalGuests + guestCount > 30) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'This slot is fully booked, please try a different time',
      });
    }

    const bookingId = generateBookingId();

    const newReservation = await Reservation.create({
      bookingId,
      customerName,
      email,
      phone,
      date,
      timeSlot,
      guestCount,
    });

    const io = req.app.get('io');
    io.emit('admin:new-reservation', newReservation);

    if (email) {
      sendEmail(
        email,
        'Booking Confirmation - The Brijwasi',
        `Hi ${customerName}, your booking (${bookingId}) for ${guestCount} guests on ${date} at ${timeSlot} is confirmed. Status: Pending.`
      ).catch((err) => console.error('Email send failed:', err.message));
    }

    res.status(201).json({ success: true, data: newReservation, message: 'Booking confirmed!' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

// Get all reservations (admin)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reservations, message: 'Reservations fetched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

// Get bookings for the logged-in user (matched by their account email)
const getMyReservations = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, data: null, message: 'User not found' });
    }

    const reservations = await Reservation.find({ email: user.email }).sort({ createdAt: -1 });

    res.json({ success: true, data: reservations, message: 'Your bookings fetched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

// Update reservation status (Accept/Reject/Seated)
const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Seated', 'Cancelled', 'No-Show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid status' });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ success: false, data: null, message: 'Reservation not found' });
    }

    const io = req.app.get('io');
    io.emit('customer:status-update', updatedReservation);

    res.json({ success: true, data: updatedReservation, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

module.exports = {
  checkAvailability,
  createReservation,
  getAllReservations,
  updateReservationStatus,
  getMyReservations,
};