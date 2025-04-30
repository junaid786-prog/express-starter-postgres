// src/config/config.js
require('dotenv').config();

// Define subscription plans
const SUBSCRIPTION_PLANS = {
    FREE_TRIAL: {
        id: 1,
        name: 'Free Trial',
        maxSubreddits: 3,
        maxLeadsPerDay: 5,
        durationDays: 3
    },
    LOWER_TIER: {
        id: 2,
        name: 'Basic Plan',
        maxSubreddits: 3,
        maxLeadsPerDay: 10,
        stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
        stripeProductId: process.env.STRIPE_BASIC_PRODUCT_ID
    },
    MEDIUM_TIER: {
        id: 3,
        name: 'Premium Plan',
        maxSubreddits: 6,
        maxLeadsPerDay: 25,
        stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
        stripeProductId: process.env.STRIPE_PREMIUM_PRODUCT_ID
    }
};

// Define user roles
const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

// Define API statuses
const API_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAIL: 'fail'
};

// Main configuration object
const CONFIG = {
    // Server
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DIALECT: process.env.DB_DIALECT || 'postgres',
    DB_SSL: process.env.DB_SSL === 'true',
    DB_SYNC: process.env.DB_SYNC === 'true',

    // Auth
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "eewtwe",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    // Reddit API
    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
    REDDIT_USERNAME: process.env.REDDIT_USERNAME,
    REDDIT_PASSWORD: process.env.REDDIT_PASSWORD,
    REDDIT_USER_AGENT: process.env.REDDIT_USER_AGENT || 'leaddit:v1.0.0 (by /u/leaddit)',

    // AI Services
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AI_MODEL: process.env.AI_MODEL || 'gpt-4-turbo',

    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Email
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@leaddit.com',

    // Company
    COMPANY_NAME: process.env.COMPANY_NAME || 'Leaddit',
    COMPANY_LOGO: process.env.COMPANY_LOGO || 'https://leaddit.com/logo.png',

    // Constants and Enums
    SUBSCRIPTION_PLANS,
    USER_ROLES,
    API_STATUS,

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

module.exports = CONFIG;