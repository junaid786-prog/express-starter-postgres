// src/api/models/userSubscription.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const UserSubscription = sequelize.define('UserSubscription', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    subscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stripeSubscriptionId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('trial', 'active', 'canceled', 'expired'),
        defaultValue: 'trial'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    trialEndDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    canceledAt: {
        type: DataTypes.DATE,
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
    tableName: 'user_subscriptions',
    timestamps: true
});

module.exports = UserSubscription;