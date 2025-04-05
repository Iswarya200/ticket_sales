const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    eventId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('AVAILABLE', 'SOLD', 'CANCELLED'),
        defaultValue: 'AVAILABLE'
    },
    customerData: {
        type: DataTypes.JSONB,
        defaultValue: {}
    }
}, {
    tableName: 'tickets'
});

module.exports = Ticket;