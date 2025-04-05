const Pricing = require('../models/pricingModel');
const Ticket = require('../models/ticketModel');
const { emitRecommendationUpdate } = require('../utils/socketEmitter');

const pricingController = {
    async analyzePricing(req, res) {
        try {
            const { eventId } = req.params;
            
            // Get ticket sales data
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

    async getPricingHistory(req, res) {
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
    },

    async updatePricingStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['APPROVED', 'REJECTED'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const pricing = await Pricing.findByPk(id);
            if (!pricing) {
                return res.status(404).json({ error: 'Pricing recommendation not found' });
            }

            pricing.status = status;
            await pricing.save();

            if (status === 'APPROVED') {
                // Update ticket price if approved
                await Ticket.update(
                    { price: pricing.suggestedPrice },
                    { where: { id: pricing.ticketId } }
                );
            }

            res.json(pricing);
        } catch (error) {
            console.error('Error updating pricing status:', error);
            res.status(500).json({ error: 'Failed to update pricing status' });
        }
    }
};

module.exports = pricingController; 