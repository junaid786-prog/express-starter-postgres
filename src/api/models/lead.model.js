// src/api/models/lead.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Lead = sequelize.define('Lead', {
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
    postId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('post', 'comment'),
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('new', 'read', 'responded', 'deleted'),
        defaultValue: 'new'
    },
    priorityScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50
    },
    aiResponse: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    aiAnalysis: {
        type: DataTypes.JSON,
        allowNull: true
    },
    isAdminGenerated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    statusChangedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    postDate: {
        type: DataTypes.DATE,
        allowNull: false
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
    tableName: 'leads',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['status']
        },
        {
            fields: ['postId']
        },
        {
            unique: true,
            fields: ['userId', 'postId']
        }
    ]
});

module.exports = Lead;