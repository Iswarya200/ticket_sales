const router = require('express').Router();
const pricingController = require('../controllers/pricingController');
const authMiddleware = require('../middleware/auth');

// Protect all pricing routes
router.use(authMiddleware);

// Get pricing recommendations for an event
router.get('/analyze/:eventId', pricingController.analyzePricing);

// Get pricing history for an event
router.get('/history/:eventId', pricingController.getPricingHistory);

module.exports = router; 