// src/api/models/subscription.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  planName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stripePriceId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stripeProductId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxSubreddits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxLeadsPerDay: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: 'subscriptions',
  timestamps: true
});

module.exports = Subscription;