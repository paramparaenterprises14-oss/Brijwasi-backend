const express = require('express');
const router = express.Router();
const { getTodayAnalytics, getWeeklyAnalytics } = require('../controller/analyticsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/today', protect, adminOnly, getTodayAnalytics);
router.get('/weekly', protect, adminOnly, getWeeklyAnalytics);

module.exports = router;