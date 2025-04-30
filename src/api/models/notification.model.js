// src/api/models/notification.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('lead', 'subscription', 'system'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('unread', 'read'),
        defaultValue: 'unread'
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    readAt: {
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
    tableName: 'notifications',
    timestamps: true
});

module.exports = Notification;