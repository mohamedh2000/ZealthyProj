const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get current configuration
router.get('/config', adminController.getConfig);

// Update configuration
router.post('/config', adminController.updateConfig);

module.exports = router; 