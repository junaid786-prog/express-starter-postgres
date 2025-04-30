const { getAuth } = require('@clerk/express');
const APIError = require('../../utils/APIError');
const CONFIG = require('../../config/config');
const { User } = require('../models');
const logger = require('../../config/logger');

const protect = async (req, res, next) => {
    try {
        const auth = getAuth(req);

        if (!auth || !auth.userId) {
            return next(new APIError('Authentication required. Please log in.', 401));
        }

        // Fetch user from your database using Clerk ID
        const user = await User.findOne({ where: { clerkId: auth.userId } });

        if (!user) {
            return next(new APIError('User not found in database', 404));
        }

        req.user = user; // Attach DB user to request
        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        return next(new APIError('Authentication failed', 500));
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new APIError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

const requireActiveSubscription = async (req, res, next) => {
    try {
        const { user } = req;

        if (user.planStatus !== 'active' && user.planStatus !== 'trial') {
            return next(new APIError('Active subscription required for this action', 403));
        }

        if (user.planStatus === 'trial' && user.trialEndDate && new Date(user.trialEndDate) < new Date()) {
            user.planStatus = 'expired';
            await user.save();

            return next(new APIError('Your trial period has expired', 403));
        }

        next();
    } catch (error) {
        logger.error('Subscription check failed:', error);
        return next(new APIError('Failed to verify subscription status', 500));
    }
};

module.exports = {
    protect,
    restrictTo,
    requireActiveSubscription,
};
