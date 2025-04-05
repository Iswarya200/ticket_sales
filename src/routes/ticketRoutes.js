const router = require('express').Router();
const { 
    createTicket,
    updateTicketStatus,
    getTicketStats
} = require('../controllers/ticketController');

// Create new ticket
router.post('/', createTicket);

// Update ticket status
router.put('/:id', updateTicketStatus);

// Get ticket statistics for an event
router.get('/stats/:eventId', getTicketStats);

module.exports = router;