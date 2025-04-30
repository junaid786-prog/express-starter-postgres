const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    clerkId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    stripeCustomerId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    planStatus: {
        type: DataTypes.ENUM('trial', 'active', 'canceled', 'expired'),
        defaultValue: 'trial'
    },
    trialEndDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    businessName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    businessDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    businessWebsite: {
        type: DataTypes.STRING,
        allowNull: true
    },
    businessTags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    leadType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emailNotificationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    dailyLeadLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 5
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
    tableName: 'users',
    timestamps: true
});

module.exports = User;