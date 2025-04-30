// src/api/models/subreddit.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Subreddit = sequelize.define('Subreddit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    subscribers: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    publicDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    isNSFW: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastScraped: {
        type: DataTypes.DATE,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    tableName: 'subreddits',
    timestamps: true
});

module.exports = Subreddit;