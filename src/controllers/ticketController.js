const { emitTicketUpdate, emitRevenueUpdate } = require('../utils/socketEmitter');

// In-memory storage
const tickets = [];

const createTicket = async (req, res) => {
    try {
        const ticket = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date()
        };
        
        tickets.push(ticket);
        
        emitTicketUpdate(ticket.eventId, {
            action: 'CREATE',
            ticket,
            totalSold: tickets.filter(t => t.eventId === ticket.eventId).length
        });

        emitRevenueUpdate(ticket.eventId, {
            revenue: ticket.price,
            timestamp: new Date()
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add these missing functions
const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = tickets.find(t => t.id === id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        Object.assign(ticket, req.body);
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTicketStats = async (req, res) => {
    try {
        const { eventId } = req.params;
        const stats = {
            total: tickets.filter(t => t.eventId === eventId).length,
            sold: tickets.filter(t => t.eventId === eventId && t.status === 'SOLD').length
        };
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTicket,
    updateTicketStatus,
    getTicketStats
};