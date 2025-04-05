const router = require('express').Router();
const { 
    processPayment, 
    handleRefund, 
    getRevenueStats 
} = require('../controllers/paymentController');

router.post('/process', processPayment);
router.post('/refund', handleRefund);
router.get('/stats/:eventId', getRevenueStats);

module.exports = router;