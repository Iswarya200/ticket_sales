const { Op } = require('sequelize');
const Recommendation = require('../models/recomModel');
const { emitRecommendationUpdate } = require('../utils/socketEmitter');

const recommendationController = {
    getPersonalizedRecommendations: async (req, res) => {
        try {
            const { userId } = req.params;
            const recommendations = await Recommendation.findAll({
                where: {
                    userId,
                    status: 'ACTIVE',
                    type: 'PERSONALIZED'
                },
                order: [['score', 'DESC']],
                limit: 5
            });

            emitRecommendationUpdate(userId, {
                action: 'RECOMMENDATIONS_FETCHED',
                recommendations
            });

            res.json(recommendations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTrendingEvents: async (req, res) => {
        try {
            const trending = await Recommendation.findAll({
                where: {
                    type: 'TRENDING',
                    status: 'ACTIVE'
                },
                order: [['score', 'DESC']],
                limit: 10
            });

            res.json(trending);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getSimilarEvents: async (req, res) => {
        try {
            const { eventId } = req.params;
            const similar = await Recommendation.findAll({
                where: {
                    eventId,
                    type: 'SIMILAR',
                    status: 'ACTIVE'
                },
                order: [['score', 'DESC']],
                limit: 5
            });

            res.json(similar);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    trackRecommendationInteraction: async (req, res) => {
        try {
            const { recommendationId, action } = req.body;
            const recommendation = await Recommendation.findByPk(recommendationId);

            if (!recommendation) {
                return res.status(404).json({ error: 'Recommendation not found' });
            }

            recommendation.status = action === 'CLICK' ? 'CLICKED' : 'CONVERTED';
            await recommendation.save();

            emitRecommendationUpdate(recommendation.userId, {
                action: 'INTERACTION_RECORDED',
                recommendationId,
                interactionType: action
            });

            res.json(recommendation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = recommendationController;