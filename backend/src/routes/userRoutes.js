const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Create or update user
router.post('/', userController.createOrUpdateUser);

// Get user progress
router.get('/progress/:email', userController.getUserProgress);

module.exports = router; 