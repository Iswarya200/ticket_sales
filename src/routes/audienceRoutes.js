const router = require('express').Router();
const { updateAudienceMetrics } = require('../controllers/audienceController');

router.post('/metrics', updateAudienceMetrics);

module.exports = router;