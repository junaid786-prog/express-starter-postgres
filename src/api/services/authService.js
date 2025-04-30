const { Op } = require('sequelize');
const stripe = require('stripe')(require('../../config/config').STRIPE_SECRET_KEY);
const { User, UserSubscription, Subscription } = require('../models');
const CONFIG = require('../../config/config');
const APIError = require('../../utils/APIError');
const logger = require('../../config/logger');
const { sequelize } = require('../../config/database');

const createOrUpdateUser = async (clerkUser) => {
    try {
        const { id: clerkId, email_addresses, created_at } = clerkUser;

        let primaryEmail = null;
        if (email_addresses && email_addresses.length > 0) {
            const primary = email_addresses.find(email => email.primary) || email_addresses[0];
            primaryEmail = primary.email_address;
        }

        if (!primaryEmail) {
            throw new APIError('Email address required', 400);
        }

        let user = await User.findOne({
            where: {
                [Op.or]: [
                    { clerkId },
                    { email: primaryEmail }
                ]
            }
        });

        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + CONFIG.SUBSCRIPTION_PLANS.FREE_TRIAL.durationDays);

        if (user) {
            user.clerkId = clerkId;
            user.email = primaryEmail;

            if (!user.trialEndDate) {
                user.trialEndDate = trialEndDate;
                user.planStatus = 'trial';
            }

            await user.save();
        } else {
            const stripeCustomer = await stripe.customers.create({
                email: primaryEmail,
                metadata: {
                    clerkId
                }
            });

            user = await User.create({
                clerkId,
                email: primaryEmail,
                stripeCustomerId: stripeCustomer.id,
                planStatus: 'trial',
                trialEndDate,
                dailyLeadLimit: CONFIG.SUBSCRIPTION_PLANS.FREE_TRIAL.maxLeadsPerDay,
                role: CONFIG.USER_ROLES.USER
            });
        }

        return user;
    } catch (error) {
        logger.error('Create or update user error:', error);
        throw error;
    }
};

const deleteUser = async (clerkId) => {
    try {
        const user = await User.findOne({ where: { clerkId } });

        if (!user) return false;

        const transaction = await sequelize.transaction();
        try {
            await UserSubscription.destroy({ where: { userId: user.id }, transaction });
            await user.destroy({ transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        logger.error('Delete user error:', error);
        throw error;
    }
};

const getUserDetails = async (clerkId) => {
    try {
        const user = await User.findOne({
            where: { clerkId },
            include: [{
                model: UserSubscription,
                include: [{ model: Subscription }]
            }]
        });

        if (!user) throw new APIError('User not found', 404);
        return user;
    } catch (error) {
        logger.error('Get user details error:', error);
        throw error;
    }
};

const makeAdmin = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) throw new APIError('User not found', 404);

        user.role = CONFIG.USER_ROLES.ADMIN;
        await user.save();
        return user;
    } catch (error) {
        logger.error('Make admin error:', error);
        throw error;
    }
};

const updateBusinessInfo = async (userId, businessInfo) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) throw new APIError('User not found', 404);

        if (businessInfo.businessName) user.businessName = businessInfo.businessName;
        if (businessInfo.businessDescription) user.businessDescription = businessInfo.businessDescription;
        if (businessInfo.businessWebsite) user.businessWebsite = businessInfo.businessWebsite;
        if (businessInfo.businessTags) user.businessTags = businessInfo.businessTags;
        if (businessInfo.leadType) user.leadType = businessInfo.leadType;

        await user.save();
        return user;
    } catch (error) {
        logger.error('Update business info error:', error);
        throw error;
    }
};

const updateNotificationSettings = async (userId, enabled) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) throw new APIError('User not found', 404);

        user.emailNotificationsEnabled = enabled;
        await user.save();
        return user;
    } catch (error) {
        logger.error('Update notification settings error:', error);
        throw error;
    }
};

module.exports = {
    createOrUpdateUser,
    deleteUser,
    getUserDetails,
    makeAdmin,
    updateBusinessInfo,
    updateNotificationSettings
};
