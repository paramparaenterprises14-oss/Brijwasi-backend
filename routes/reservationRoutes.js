
const express = require('express');
const router = express.Router();
const {
  checkAvailability,
  createReservation,
  getAllReservations,
  updateReservationStatus,
  getMyReservations,
} = require('../controller/reservationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/check', checkAvailability);
router.post('/', createReservation);
router.get('/my', protect, getMyReservations);
router.get('/', protect, adminOnly, getAllReservations);
router.put('/:id/status', protect, adminOnly, updateReservationStatus);

module.exports = router;