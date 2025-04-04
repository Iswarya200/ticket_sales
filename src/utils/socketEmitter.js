const { getIO } = require('../config/socket');

// Ticket related events
const emitTicketUpdate = (eventId, ticketData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('ticketUpdate', ticketData);
};

const emitSalesAlert = (eventId, alertData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('salesAlert', alertData);
};

// Analytics related events
const emitAudienceUpdate = (eventId, analyticsData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('audienceUpdate', analyticsData);
};

// Dashboard related events
const emitRevenueUpdate = (eventId, revenueData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('revenueUpdate', revenueData);
};

// Marketing related events
const emitCampaignUpdate = (eventId, campaignData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('campaignUpdate', campaignData);
};

// AI recommendations
const emitRecommendation = (eventId, recommendation) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('recommendation', recommendation);
};

// Error handling
const emitError = (eventId, error) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('error', {
    message: error.message,
    timestamp: new Date()
  });
};

module.exports = {
  emitTicketUpdate,
  emitSalesAlert,
  emitAudienceUpdate,
  emitRevenueUpdate,
  emitCampaignUpdate,
  emitRecommendation,
  emitError,
};