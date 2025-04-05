const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recommendation = sequelize.define('Recommendation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    eventId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 1
        }
    },
    type: {
        type: DataTypes.ENUM('PERSONALIZED', 'TRENDING', 'SIMILAR'),
        defaultValue: 'PERSONALIZED'
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'CLICKED', 'CONVERTED', 'EXPIRED'),
        defaultValue: 'ACTIVE'
    }
}, {
    tableName: 'recommendations',
    timestamps: true,
    indexes: [
        { fields: ['userId'] },
        { fields: ['eventId'] },
        { fields: ['type'] }
    ]
});

module.exports = Recommendation;