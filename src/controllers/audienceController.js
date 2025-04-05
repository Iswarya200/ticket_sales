const { 
    emitAudienceUpdate, 
    emitSalesAlert, 
    emitError 
} = require('../utils/socketEmitter');
const Audience = require('../models/Audience');

const updateAudienceMetrics = async (req, res) => {
    try {
        const { eventId, metrics } = req.body;
        
        // Update audience metrics in database
        const updatedMetrics = await Audience.update(metrics, {
            where: { eventId },
            returning: true
        });

        // Emit audience update
        emitAudienceUpdate(eventId, {
            metrics: updatedMetrics,
            timestamp: new Date()
        });

        // Check for interesting patterns
        const pattern = await analyzeAudiencePattern(eventId);
        if (pattern.significant) {
            emitSalesAlert(eventId, {
                type: 'AUDIENCE_INSIGHT',
                message: pattern.message,
                data: pattern.data,
                timestamp: new Date()
            });
        }

        res.status(200).json(updatedMetrics);
    } catch (error) {
        emitError(req.body.eventId, error);
        res.status(500).json({ error: error.message });
    }
};

const getAudienceInsights = async (req, res) => {
    try {
        const { eventId } = req.params;
        const insights = await generateAudienceInsights(eventId);

        emitAudienceUpdate(eventId, {
            type: 'INSIGHTS',
            data: insights,
            timestamp: new Date()
        });

        res.status(200).json(insights);
    } catch (error) {
        emitError(req.params.eventId, error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    updateAudienceMetrics,
    getAudienceInsights
};