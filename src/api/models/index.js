// src/api/models/index.js
const User = require('./user.model');
const Subscription = require('./subscription.model');
const UserSubscription = require('./userSubscription.model');
const Subreddit = require('./subreddit.model');
const UserSubreddit = require('./userSubreddit.model');
const Lead = require('./lead.model');
const AIUsage = require('./aiUsage.model');
const SystemLog = require('./systemLog.model');
const Notification = require('./notification.model');

// Define associations
// User associations
User.hasMany(UserSubscription, { foreignKey: 'userId' });
User.hasMany(UserSubreddit, { foreignKey: 'userId' });
User.hasMany(Lead, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });
User.hasMany(AIUsage, { foreignKey: 'userId' });

// Subscription associations
Subscription.hasMany(UserSubscription, { foreignKey: 'subscriptionId' });

// UserSubscription associations
UserSubscription.belongsTo(User, { foreignKey: 'userId' });
UserSubscription.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

// Subreddit associations
Subreddit.hasMany(UserSubreddit, { foreignKey: 'subredditId' });
Subreddit.hasMany(Lead, { foreignKey: 'subredditId' });

// UserSubreddit associations
UserSubreddit.belongsTo(User, { foreignKey: 'userId' });
UserSubreddit.belongsTo(Subreddit, { foreignKey: 'subredditId' });

// Lead associations
Lead.belongsTo(User, { foreignKey: 'userId' });
Lead.belongsTo(Subreddit, { foreignKey: 'subredditId' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId' });

// AIUsage associations
AIUsage.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Subscription,
    UserSubscription,
    Subreddit,
    UserSubreddit,
    Lead,
    AIUsage,
    SystemLog,
    Notification
};