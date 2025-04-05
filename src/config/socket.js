const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
        pingTimeout: 60000,
        connectTimeout: 60000
    });

    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);

        socket.on('joinEvent', (eventId) => {
            socket.join(`event-${eventId}`);
            console.log(`📡 Client ${socket.id} joined event ${eventId}`);
        });

        socket.on('disconnect', (reason) => {
            console.log(`❌ Client ${socket.id} disconnected:`, reason);
        });

        socket.on('error', (error) => {
            console.error(`🚨 Socket Error for ${socket.id}:`, error);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { initializeSocket, getIO };