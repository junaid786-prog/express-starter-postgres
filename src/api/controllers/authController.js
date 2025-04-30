const authService = require('../services/authService');
const APIResponse = require('../../utils/APIResponse');
const APIError = require('../../utils/APIError');
const catchAsync = require('../../utils/catchAsync');
const logger = require('../../config/logger');


const handleClerkWebhook = catchAsync(async (req, res, next) => {
    try {
        const { type, data } = req.body;

        switch (type) {
            case 'user.created':
            case 'user.updated':
                const user = await authService.createOrUpdateUser(data);
                return res.status(200).json(APIResponse.success({ user }, 'User processed successfully'));

            case 'user.deleted':
                const deleted = await authService.deleteUser(data.id);
                return res.status(200).json(APIResponse.success({ deleted }, 'User deletion processed'));

            default:
                return res.status(200).json(APIResponse.success(null, 'Event ignored'));
        }
    } catch (error) {
        logger.error('Clerk webhook error:', error);
        return res.status(500).json(APIResponse.error('Webhook processing failed'));
    }
});


const getCurrentUser = catchAsync(async (req, res, next) => {
    const user = req.user;
    const userDetails = await authService.getUserDetails(user.clerkId);

    return res.status(200).json(APIResponse.success(
        userDetails,
        'User details retrieved successfully'
    ));
});


const updateBusinessInfo = catchAsync(async (req, res, next) => {
    const { businessName, businessDescription, businessWebsite, businessTags, leadType } = req.body;

    const updatedUser = await authService.updateBusinessInfo(req.user.id, {
        businessName,
        businessDescription,
        businessWebsite,
        businessTags,
        leadType
    });

    return res.status(200).json(APIResponse.success(
        updatedUser,
        'Business information updated successfully'
    ));
});


const updateNotificationSettings = catchAsync(async (req, res, next) => {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
        return next(new APIError('Enabled must be a boolean value', 400));
    }

    const updatedUser = await authService.updateNotificationSettings(req.user.id, enabled);

    return res.status(200).json(APIResponse.success(
        updatedUser,
        `Email notifications ${enabled ? 'enabled' : 'disabled'} successfully`
    ));
});

/**
 * Promote another user to admin — only accessible by admins.
 */
const makeAdmin = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const updatedUser = await authService.makeAdmin(userId);

    return res.status(200).json(APIResponse.success(
        updatedUser,
        'User promoted to admin successfully'
    ));
});

module.exports = {
    handleClerkWebhook,
    getCurrentUser,
    updateBusinessInfo,
    updateNotificationSettings,
    makeAdmin
};
