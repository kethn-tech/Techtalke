const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const settingController = require('../controllers/SettingController');
const eventController = require('../controllers/EventController');
const verifyToken = require('../middlewares/AuthMiddleware');

// Dashboard stats
router.get('/dashboard-stats', verifyToken, adminController.getDashboardStats);

// User management routes
router.get('/users', verifyToken, adminController.getAllUsers);
router.post('/users', verifyToken, adminController.createUser);
router.put('/users/update-role', verifyToken, adminController.updateUserRole);
router.delete('/users/:userId', verifyToken, adminController.deleteUser);

// Message management routes
router.get('/messages', verifyToken, adminController.getRecentMessages);
router.delete('/messages/:messageId', verifyToken, adminController.deleteMessage);

// System settings routes
router.get('/settings', verifyToken, settingController.getSettings);
router.put('/settings', verifyToken, settingController.updateSettings);

// Calendar event routes
router.get('/events', verifyToken, eventController.getEvents);
router.post('/events', verifyToken, eventController.createEvent);
router.delete('/events/:id', verifyToken, eventController.deleteEvent);

module.exports = router;