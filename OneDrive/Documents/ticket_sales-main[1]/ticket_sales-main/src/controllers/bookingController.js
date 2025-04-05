const { Op } = require('sequelize');
const Booking = require('../models/bookingModel');
const sequelize = require('../config/database');
const { emitBookingUpdate } = require('../utils/socketEmitter');

const bookingController = {
    createBooking: async (req, res) => {
        try {
            const { user_age, eventId } = req.body;
            const booking = await Booking.create({
                user_age,
                eventId
            });

            // Emit socket event for real-time updates
            emitBookingUpdate(eventId, {
                action: 'CREATE',
                booking
            });

            res.status(201).json(booking);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    getComprehensiveAnalytics: async (req, res) => {
      try {
          const [ageGroups, timeStats] = await Promise.all([
              bookingController.getAgeGroupAnalytics(req, res),
              bookingController.getBookingTimeAnalytics(req, res)
          ]);

          res.json({
              age_demographics: ageGroups,
              timing_analytics: timeStats
          });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
    },
    getAgeGroupAnalytics: async (req, res) => {
        try {
            const bookings = await Booking.findAll({
                attributes: [
                    [sequelize.literal(`
                        CASE 
                            WHEN user_age BETWEEN 18 AND 25 THEN '18-25'
                            WHEN user_age BETWEEN 26 AND 35 THEN '26-35'
                            WHEN user_age BETWEEN 36 AND 45 THEN '36-45'
                            WHEN user_age BETWEEN 46 AND 55 THEN '46-55'
                            ELSE '55+'
                        END
                    `), 'age_group'],
                    [sequelize.fn('COUNT', '*'), 'booking_count']
                ],
                group: ['age_group'],
                order: [[sequelize.literal('booking_count'), 'DESC']]
            });

            res.json(bookings);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getBookingTimeAnalytics: async (req, res) => {
        try {
            const hourlyStats = await Booking.findAll({
                attributes: [
                    [sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "booking_timestamp"')), 'hour'],
                    [sequelize.fn('COUNT', '*'), 'booking_count']
                ],
                group: ['hour'],
                order: [[sequelize.literal('booking_count'), 'DESC']]
            });

            const weekdayStats = await Booking.findAll({
                attributes: [
                    [sequelize.fn('EXTRACT', sequelize.literal('DOW FROM "booking_timestamp"')), 'day_of_week'],
                    [sequelize.fn('COUNT', '*'), 'booking_count']
                ],
                group: ['day_of_week'],
                order: [[sequelize.literal('booking_count'), 'DESC']]
            });

            res.json({
                peak_hours: hourlyStats,
                peak_days: weekdayStats
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = bookingController;