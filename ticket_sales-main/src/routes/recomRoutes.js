const router = require('express').Router();
const recommendationController = require('../controllers/recomController');
const authMiddleware = require('../middleware/auth');

// Protect all recommendation routes
router.use(authMiddleware);

// Get personalized recommendations for a user
router.get('/personalized/:userId', recommendationController.getPersonalizedRecommendations);

// Get trending events
router.get('/trending', recommendationController.getTrendingEvents);

// Get similar events
router.get('/similar/:eventId', recommendationController.getSimilarEvents);

// Track recommendation interactions
router.post('/track', recommendationController.trackRecommendationInteraction);

module.exports = router;