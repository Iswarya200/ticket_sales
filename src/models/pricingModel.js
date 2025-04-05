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
        allowNull: false
    },
    ticketId: {
        type: DataTypes.UUID,
        allowNull: false
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
    metrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
    }
}, {
    tableName: 'pricings',
    timestamps: true
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