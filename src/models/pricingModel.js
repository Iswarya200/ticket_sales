const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pricing = sequelize.define('Pricing', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    eventId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    ticketId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tickets',
            key: 'id'
        }
    },
    currentPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    suggestedPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    changeType: {
        type: DataTypes.ENUM('INCREASE', 'DECREASE', 'MAINTAIN'),
        allowNull: false
    },
    changePercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING'
    },
    metrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        validate: {
            isValidMetrics(value) {
                if (!value.salesRate || !value.totalTickets || !value.soldTickets) {
                    throw new Error('Metrics must include salesRate, totalTickets, and soldTickets');
                }
            }
        }
    }
}, {
    tableName: 'pricings',
    timestamps: true,
    indexes: [
        { fields: ['eventId'] },
        { fields: ['ticketId'] },
        { fields: ['status'] }
    ]
});

// Initialize the pricing table
const initPricing = async () => {
    try {
        await Pricing.sync({ alter: true });
        console.log('✅ Pricing table created/updated');
    } catch (error) {
        console.error('❌ Pricing table creation failed:', error);
    }
};

initPricing();

module.exports = Pricing; 