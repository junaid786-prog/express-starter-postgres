const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/auth');

router.post('/clerk/webhook', express.json({ type: 'application/json' }), authController.handleClerkWebhook);

router.get('/me', protect, authController.getCurrentUser);
router.patch('/me/business', protect, authController.updateBusinessInfo);
router.patch('/me/notifications', protect, authController.updateNotificationSettings);

router.post('/make-admin/:userId', protect, restrictTo('admin'), authController.makeAdmin);

module.exports = router;
