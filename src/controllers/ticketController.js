const { 
    emitTicketUpdate, 
    emitSalesAlert, 
    emitRevenueUpdate, 
    emitAudienceUpdate,
    emitError 
} = require('../utils/socketEmitter');
const Ticket = require('../models/Ticket');

const createTicket = async (req, res) => {
    try {
        const ticket = await Ticket.create(req.body);
        
        // Emit ticket update
        emitTicketUpdate(ticket.eventId, {
            action: 'CREATE',
            ticket,
            totalSold: await Ticket.count({ where: { eventId: ticket.eventId } })
        });

        // Emit revenue update
        emitRevenueUpdate(ticket.eventId, {
            revenue: ticket.price,
            timestamp: new Date()
        });

        // Emit audience update
        emitAudienceUpdate(ticket.eventId, {
            newPurchase: ticket.customerData,
            timestamp: new Date()
        });

        res.status(201).json(ticket);
    } catch (error) {
        emitError(req.body.eventId, error);
        res.status(500).json({ error: error.message });
    }
};

const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.update(req.body, { 
            where: { id },
            returning: true
        });

        // Emit ticket status update
        emitTicketUpdate(ticket.eventId, {
            action: 'UPDATE',
            ticket,
            updateType: req.body.status
        });

        // Check sales performance
        const salesMetrics = await analyzeSalesPerformance(ticket.eventId);
        if (salesMetrics.needsAlert) {
            emitSalesAlert(ticket.eventId, {
                message: salesMetrics.alertMessage,
                data: salesMetrics,
                timestamp: new Date()
            });
        }

        res.status(200).json(ticket);
    } catch (error) {
        emitError(req.params.eventId, error);
        res.status(500).json({ error: error.message });
    }
};

const getTicketStats = async (req, res) => {
    try {
        const { eventId } = req.params;
        const stats = await calculateTicketStats(eventId);

        emitTicketUpdate(eventId, {
            action: 'STATS_UPDATE',
            stats,
            timestamp: new Date()
        });

        res.status(200).json(stats);
    } catch (error) {
        emitError(req.params.eventId, error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTicket,
    updateTicketStatus,
    getTicketStats
};