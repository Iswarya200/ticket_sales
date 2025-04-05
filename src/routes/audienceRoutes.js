const router = require('express').Router();
const { 
    updateAudienceMetrics, 
    getAudienceInsights 
} = require('../controllers/audienceController');

// Metrics endpoints
router.post('/metrics', updateAudienceMetrics);
router.get('/insights/:eventId', getAudienceInsights);

module.exports = router;