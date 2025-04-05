const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Audience = sequelize.define('Audience', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    eventId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metrics: {
        type: DataTypes.JSONB,  // Using JSONB for PostgreSQL
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'audiences',  // Explicitly set table name
    timestamps: true
});

// Sync the model with database
const syncAudience = async () => {
    try {
        await Audience.sync({ alter: true });
        console.log('✅ Audience table synchronized successfully');
    } catch (error) {
        console.error('❌ Error syncing Audience table:', error);
    }
};

syncAudience();

module.exports = Audience;