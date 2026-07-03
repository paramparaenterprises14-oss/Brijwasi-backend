const Reservation = require('../models/Reservation');

// Helper: aaj ki date "YYYY-MM-DD" format me
const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// Today's analytics
const getTodayAnalytics = async (req, res) => {
  try {
    const today = getTodayDateString();

    const todayBookings = await Reservation.find({
      date: today,
      status: { $ne: 'Cancelled' },
    });

    const totalBookings = todayBookings.length;
    const expectedGuests = todayBookings.reduce((sum, b) => sum + b.guestCount, 0);

    // Most popular time slot nikalo
    const slotCounts = {};
    todayBookings.forEach((b) => {
      slotCounts[b.timeSlot] = (slotCounts[b.timeSlot] || 0) + 1;
    });

    let mostPopularSlot = null;
    let maxCount = 0;
    for (const slot in slotCounts) {
      if (slotCounts[slot] > maxCount) {
        maxCount = slotCounts[slot];
        mostPopularSlot = slot;
      }
    }

    // Occupancy rate (assume max capacity = 30 guests per slot, aur maan lo 5 slots/din)
    const MAX_CAPACITY_PER_DAY = 30 * 5;
    const occupancyRate = ((expectedGuests / MAX_CAPACITY_PER_DAY) * 100).toFixed(1);

    res.json({
      success: true,
      data: {
        totalBookings,
        expectedGuests,
        mostPopularSlot,
        occupancyRate: `${occupancyRate}%`,
      },
      message: "Today's analytics fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

// Weekly analytics (bookings per hour, current week ke liye)
const getWeeklyAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDates.push(d.toISOString().split('T')[0]);
    }

    const weekBookings = await Reservation.find({
      date: { $in: weekDates },
      status: { $ne: 'Cancelled' },
    });

    // Time slot ke hisaab se group karo
    const hourlyData = {};
    weekBookings.forEach((b) => {
      hourlyData[b.timeSlot] = (hourlyData[b.timeSlot] || 0) + 1;
    });

    const chartData = Object.keys(hourlyData).map((slot) => ({
      timeSlot: slot,
      bookings: hourlyData[slot],
    }));

    res.json({
      success: true,
      data: chartData,
      message: 'Weekly analytics fetched successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

module.exports = { getTodayAnalytics, getWeeklyAnalytics };