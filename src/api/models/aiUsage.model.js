// src/api/models/aiUsage.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AIUsage = sequelize.define('AIUsage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    operation: {
        type: DataTypes.ENUM('extract_business_info', 'suggest_subreddits', 'validate_lead', 'generate_response'),
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    promptTokens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    completionTokens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    totalTokens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    cost: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false,
        defaultValue: 0
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'ai_usage',
    timestamps: true
});

module.exports = AIUsage;