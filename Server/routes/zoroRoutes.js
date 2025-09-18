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

module.exports = router;