const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { initializeSocket } = require('./config/socket');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const qrcodeRoutes = require('./routes/qrcodeRoutes'); 
const audienceRoutes = require('./routes/audienceRoutes');
const sequelize = require('./config/database');
const Audience = require('./models/audienceModel');
const Ticket = require('./models/ticketModel');
const Payment = require('./models/paymentModel');
const User = require('./models/authModel');


// Define relationships more explicitly
User.hasMany(Ticket, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Ticket.belongsTo(User, {
    foreignKey: 'userId'
});

Ticket.hasOne(Payment, {
    foreignKey: 'ticketId',
    onDelete: 'CASCADE'
});

Payment.belongsTo(Ticket, {
    foreignKey: 'ticketId'
});

Ticket.hasMany(Audience, {
    foreignKey: 'ticketId',
    onDelete: 'CASCADE',
    as: 'audienceMetrics'
});

Audience.belongsTo(Ticket, {
    foreignKey: 'ticketId',
    as: 'ticket'
});

const initDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ All models synchronized');
        
        // Log available tables
        const [results] = await sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
        console.log('📋 Available tables:', results.map(r => r.table_name));
    } catch (error) {
        console.error('❌ Error syncing models:', error);
    }
};

initDatabase();
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/qrcode', qrcodeRoutes);
app.use('/api/audience', audienceRoutes);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'test.html'));
});

// Error handling
// ...existing code...

// Better error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        path: req.path,
        method: req.method,
        body: req.body,
        stack: err.stack
    });

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            path: req.path,
            timestamp: new Date().toISOString()
        }
    });
});

const PORT = process.env.PORT || 3000;

// Improve server startup logging
httpServer.listen(PORT, () => {
    console.log('🚀 Server Status:');
    console.log(`- HTTP server: http://localhost:${PORT}`);
    console.log('- Socket.io: Ready for connections');
    console.log('- Available routes:');
    console.log('  └── GET  /');
    console.log('  └── POST /api/auth/login');
    console.log('  └── POST /api/auth/register');
    console.log('  └── POST /api/tickets');
    console.log('  └── PUT  /api/tickets/:id');
    console.log('  └── GET  /api/tickets/stats/:eventId');
});