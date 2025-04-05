const { emitTicketUpdate } = require('../utils/socketEmitter');

const generateQRCode = async (req, res) => {
    try {
        const { ticketId, eventId } = req.body;
        
        // QR code generation logic here
        const qrCode = {
            id: Date.now().toString(),
            ticketId,
            eventId,
            createdAt: new Date()
        };

        // Emit socket update
        emitTicketUpdate(eventId, {
            action: 'QR_GENERATED',
            ticketId,
            timestamp: new Date()
        });

        res.status(200).json(qrCode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    generateQRCode
};
