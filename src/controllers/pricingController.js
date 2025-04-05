const Pricing = require('../models/pricingModel');
const Ticket = require('../models/ticketModel');
const { emitRecommendationUpdate } = require('../utils/socketEmitter');

const pricingController = {
    analyzePricing: async (req, res) => {
        try {
            const { eventId } = req.params;
            
            const tickets = await Ticket.findAll({
                where: { eventId },
                attributes: ['id', 'price', 'totalQuantity', 'soldQuantity']
            });

            if (!tickets.length) {
                return res.status(404).json({ error: 'No tickets found for this event' });
            }

            const recommendations = [];

            for (const ticket of tickets) {
                const salesRate = (ticket.soldQuantity / ticket.totalQuantity) * 100;
                const currentPrice = ticket.price;
                let suggestedPrice, changeType, changePercentage, reason;

                if (salesRate < 30) {
                    // Low sales - suggest discount
                    changePercentage = Math.min(30, Math.round((30 - salesRate) / 2));
                    suggestedPrice = currentPrice * (1 - changePercentage / 100);
                    changeType = 'DECREASE';
                    reason = `Low sales rate (${salesRate.toFixed(1)}%). Suggesting ${changePercentage}% discount to boost sales.`;
                } else if (salesRate > 80) {
                    // High demand - suggest price increase
                    changePercentage = Math.min(20, Math.round((salesRate - 80) / 2));
                    suggestedPrice = currentPrice * (1 + changePercentage / 100);
                    changeType = 'INCREASE';
                    reason = `High demand (${salesRate.toFixed(1)}% sold). Suggesting ${changePercentage}% price increase.`;
                } else {
                    // Stable sales - maintain price
                    suggestedPrice = currentPrice;
                    changeType = 'MAINTAIN';
                    changePercentage = 0;
                    reason = `Stable sales rate (${salesRate.toFixed(1)}%). Current pricing is optimal.`;
                }

                // Create pricing recommendation
                const pricing = await Pricing.create({
                    eventId,
                    ticketId: ticket.id,
                    currentPrice,
                    suggestedPrice,
                    changeType,
                    changePercentage,
                    reason,
                    metrics: {
                        salesRate,
                        totalTickets: ticket.totalQuantity,
                        soldTickets: ticket.soldQuantity
                    }
                });

                recommendations.push(pricing);

                // Emit real-time update
                emitRecommendationUpdate(req.user.id, {
                    type: 'PRICING',
                    eventId,
                    ticketId: ticket.id,
                    currentPrice,
                    suggestedPrice,
                    changeType,
                    changePercentage,
                    reason
                });
            }

            res.json(recommendations);
        } catch (error) {
            console.error('Pricing analysis error:', error);
            res.status(500).json({ error: 'Failed to analyze pricing' });
        }
    },

    getPricingHistory: async (req, res) => {
        try {
            const { eventId } = req.params;
            
            const history = await Pricing.findAll({
                where: { eventId },
                order: [['createdAt', 'DESC']]
            });

            res.json(history);
        } catch (error) {
            console.error('Error fetching pricing history:', error);
            res.status(500).json({ error: 'Failed to fetch pricing history' });
        }
    }
};

module.exports = pricingController; 