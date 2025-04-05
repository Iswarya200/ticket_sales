const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const authMiddleware = require('../middleware/auth');

// Protect all pricing routes
router.use(authMiddleware);

// Get pricing recommendations for an event
router.get('/analyze/:eventId', pricingController.analyzePricing);

// Get pricing history for an event
router.get('/history/:eventId', pricingController.getPricingHistory);

// Update pricing recommendation status
router.put('/:id/status', pricingController.updatePricingStatus);

module.exports = router; 