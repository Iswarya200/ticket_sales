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
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    ticketId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'tickets',
            key: 'id'
        }
    },
    metrics: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
        validate: {
            isValidMetrics(value) {
                if (!value.totalAttendees || !value.currentlyPresent) {
                    throw new Error('Metrics must include totalAttendees and currentlyPresent');
                }
            }
        }
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'audiences',
    timestamps: true,
    indexes: [
        { fields: ['eventId'] },
        { fields: ['ticketId'] }
    ]
});

// Force sync for development
const initAudience = async () => {
    try {
        await Audience.sync({ force: true });
        console.log('✅ Audience table created');
    } catch (error) {
        console.error('❌ Audience table creation failed:', error);
    }
};

initAudience();

module.exports = Audience;