const { 
    emitTicketUpdate, 
    emitRevenueUpdate, 
    emitSalesAlert,
    emitError 
} = require('../utils/socketEmitter');

// In-memory store for demo (replace with database in production)
let revenueStats = {
    totalRevenue: 0,
    paymentMethods: {
        credit: 0,
        debit: 0,
        upi: 0
    },
    totalRefunds: 0,
    transactions: []
};

const processPayment = async (req, res) => {
    try {
        const { eventId, amount, ticketId, paymentMethod } = req.body;

        // Payment processing logic here
        const payment = {
            id: Math.random().toString(36).substr(2, 9),
            eventId,
            type: 'PAYMENT',
            amount,
            ticketId,
            paymentMethod,
            status: 'completed',
            timestamp: new Date()
        };

        // Update revenue stats
        revenueStats.totalRevenue += amount;
        revenueStats.paymentMethods[paymentMethod]++;
        revenueStats.transactions.push(payment);

        // Emit socket events
        emitTicketUpdate(eventId, {
            type: 'PAYMENT_COMPLETED',
            ticketId,
            timestamp: new Date()
        });

        emitRevenueUpdate(eventId, {
            type: 'NEW_PAYMENT',
            payment,
            revenueStats: {
                totalRevenue: revenueStats.totalRevenue,
                paymentMethods: revenueStats.paymentMethods,
                totalRefunds: revenueStats.totalRefunds
            },
            timestamp: new Date()
        });

        if (amount > 1000) {
            emitSalesAlert(eventId, {
                type: 'HIGH_VALUE_PURCHASE',
                amount,
                timestamp: new Date()
            });
        }

        res.status(200).json({ success: true, payment, revenueStats });
    } catch (error) {
        emitError(req.body.eventId, error);
        res.status(500).json({ error: error.message });
    }
};

const handleRefund = async (req, res) => {
    try {
        const { eventId, ticketId, amount } = req.body;

        // Update refund stats
        revenueStats.totalRevenue -= amount;
        revenueStats.totalRefunds += amount;
        revenueStats.transactions.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'REFUND',
            amount: -amount,
            ticketId,
            timestamp: new Date()
        });

        emitRevenueUpdate(eventId, {
            type: 'REFUND',
            ticketId,
            amount: -amount,
            revenueStats: {
                totalRevenue: revenueStats.totalRevenue,
                paymentMethods: revenueStats.paymentMethods,
                totalRefunds: revenueStats.totalRefunds
            },
            timestamp: new Date()
        });

        res.status(200).json({ success: true, revenueStats });
    } catch (error) {
        emitError(req.body.eventId, error);
        res.status(500).json({ error: error.message });
    }
};

// ...existing code...

const getRevenueStats = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check if any transactions exist for this event
        const eventTransactions = revenueStats.transactions.filter(
            t => t.eventId === eventId
        );

        if (eventTransactions.length === 0) {
            return res.status(404).json({
                error: `No payment records found for event ID: ${eventId}`
            });
        }

        // Calculate event-specific stats
        const eventStats = {
            eventId,
            totalRevenue: eventTransactions
                .reduce((sum, t) => sum + (t.amount || 0), 0),
            paymentMethods: {
                credit: eventTransactions.filter(t => t.paymentMethod === 'credit').length,
                debit: eventTransactions.filter(t => t.paymentMethod === 'debit').length,
                upi: eventTransactions.filter(t => t.paymentMethod === 'upi').length
            },
            totalRefunds: eventTransactions
                .filter(t => t.type === 'REFUND')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0),
            transactions: eventTransactions
        };

        res.status(200).json(eventStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    processPayment,
    handleRefund,
    getRevenueStats
};