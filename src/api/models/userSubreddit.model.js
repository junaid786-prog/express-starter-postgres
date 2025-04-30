// src/api/models/userSubreddit.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const UserSubreddit = sequelize.define('UserSubreddit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    subredditId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    keywords: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    excludeKeywords: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    postTypes: {
        type: DataTypes.JSON,
        defaultValue: ['post', 'comment']
    },
    status: {
        type: DataTypes.ENUM('active', 'paused'),
        defaultValue: 'active'
    },
    lastScraped: {
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
    tableName: 'user_subreddits',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'subredditId']
        }
    ]
});

module.exports = UserSubreddit;