const { 
    emitAudienceUpdate, 
    emitSalesAlert, 
    emitError 
} = require('../utils/socketEmitter');
const Audience = require('../models/audienceModel');

const analyzeAudiencePattern = async (eventId) => {
    const latestMetrics = await Audience.findOne({
        where: { eventId },
        order: [['timestamp', 'DESC']]
    });

    return {
        significant: latestMetrics?.metrics?.currentlyPresent > 100,
        message: 'High attendance detected',
        data: latestMetrics?.metrics
    };
};

const updateAudienceMetrics = async (req, res) => {
    try {
        const { eventId, metrics } = req.body;
        
        if (!eventId || !metrics) {
            return res.status(400).json({
                error: 'eventId and metrics are required'
            });
        }

        // Store in database
        const audienceRecord = await Audience.create({
            eventId,
            metrics: {
                totalAttendees: metrics.totalAttendees,
                currentlyPresent: metrics.currentlyPresent,
                peakAttendance: metrics.peakAttendance
            },
            timestamp: new Date()
        });

        // Emit audience update
        emitAudienceUpdate(eventId, {
            action: 'UPDATE',
            metrics: audienceRecord.metrics,  // Changed from audience.metrics to audienceRecord.metrics
            timestamp: audienceRecord.timestamp
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

        res.status(201).json(audienceRecord);  // Changed status to 201 for resource creation
    } catch (error) {
        console.error('Audience Metrics Error:', error);
        emitError(req.body.eventId, error);
        res.status(500).json({ error: error.message });
    }
};

const getAudienceInsights = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        const insights = await Audience.findAll({
            where: { eventId },
            order: [['timestamp', 'DESC']],
            limit: 10
        });

        if (!insights.length) {
            return res.status(404).json({ 
                error: `No audience data found for event ID: ${eventId}` 
            });
        }

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