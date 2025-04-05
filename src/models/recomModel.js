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
        type: DataTypes.ENUM('PERSONALIZED', 'TRENDING', 'SIMILAR', 'PRICING'),
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

// Force sync for development
const initRecommendation = async () => {
    try {
        await Recommendation.sync({ force: true });
        console.log('✅ Recommendation table created');
    } catch (error) {
        console.error('❌ Recommendation table creation failed:', error);
    }
};

// Create sample recommendations
const createSampleRecommendations = async (userId) => {
    try {
        const recommendations = [
            {
                userId,
                eventId: 'event_1',
                score: 0.95,
                type: 'PERSONALIZED',
                metadata: { category: 'music', popularity: 'high' }
            },
            {
                userId,
                eventId: 'event_2',
                score: 0.85,
                type: 'PERSONALIZED',
                metadata: { category: 'sports', popularity: 'medium' }
            },
            {
                userId,
                eventId: 'event_3',
                score: 0.75,
                type: 'PERSONALIZED',
                metadata: { category: 'art', popularity: 'low' }
            }
        ];

        await Recommendation.bulkCreate(recommendations);
        console.log('✅ Sample recommendations created');
    } catch (error) {
        console.error('❌ Failed to create sample recommendations:', error);
    }
};

initRecommendation();

module.exports = { Recommendation, createSampleRecommendations };