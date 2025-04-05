const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Booking routes
router.post('/', bookingController.createBooking);
router.get('/analytics/age-groups', bookingController.getAgeGroupAnalytics);
router.get('/analytics/booking-times', bookingController.getBookingTimeAnalytics);
router.get('/analytics', bookingController.getComprehensiveAnalytics);

module.exports = router; 