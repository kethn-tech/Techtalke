const express = require('express');
const router = express.Router();
const auth = require('../middlewares/AuthMiddleware');
const upload = require('../middlewares/vaultUpload');
const ZoroController = require('../controllers/ZoroController');

// Upload one or multiple files
router.post('/upload', auth, upload.array('files', 5), ZoroController.uploadFiles);

// List current user's files
router.get('/', auth, ZoroController.getUserFiles);

// Get download url
router.get('/:id/download', auth, ZoroController.downloadFile);

// Delete file
router.delete('/:id', auth, ZoroController.deleteFile);

// Share file with another user
router.post('/:id/share', auth, ZoroController.shareFile);

// Get shared files (files shared with current user)
router.get('/shared/received', auth, ZoroController.getSharedFiles);

// Accept shared file
router.post('/shared/:id/accept', auth, ZoroController.acceptSharedFile);

// Decline shared file
router.post('/shared/:id/decline', auth, ZoroController.declineSharedFile);

// Get notifications
router.get('/notifications', auth, ZoroController.getNotifications);

// Mark notification as read
router.patch('/notifications/:id/read', auth, ZoroController.markNotificationRead);

// Mark all notifications as read
router.patch('/notifications/mark-all-read', auth, ZoroController.markAllNotificationsRead);

module.exports = router;