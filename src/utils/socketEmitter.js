const { getIO } = require('../config/socket');

// Ticket related events
const emitTicketUpdate = (eventId, ticketData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('ticketUpdate', ticketData);
};

// Booking related events
const emitBookingUpdate = (eventId, bookingData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('bookingUpdate', bookingData);
};

// Recommendation related events
const emitRecommendationUpdate = (userId, recommendationData) => {
  const io = getIO();
  io.to(`user-${userId}`).emit('recommendationUpdate', recommendationData);
};

// Analytics related events
const emitAudienceUpdate = (eventId, analyticsData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('audienceUpdate', analyticsData);
};

// Sales related events
const emitSalesAlert = (eventId, salesData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('salesAlert', salesData);
};

// Revenue related events
const emitRevenueUpdate = (eventId, revenueData) => {
  const io = getIO();
  io.to(`event-${eventId}`).emit('revenueUpdate', revenueData);
};

// Campaign related events
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
  io.to(`event-${eventId}`).emit('error', error);
};

module.exports = {
  emitTicketUpdate,
  emitSalesAlert,
  emitAudienceUpdate,
  emitRevenueUpdate,
  emitCampaignUpdate,
  emitRecommendation,
  emitBookingUpdate,
  emitRecommendationUpdate,
  emitError,
};