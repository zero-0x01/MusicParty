// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, updateDefaultPlaylist, removeSongFromPlaylist, getCafeInfo } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile',authenticateUser, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile',authenticateUser, updateUserProfile);

// @route   PUT /api/user/playlist
// @desc    Update default playlist
// @access  Private
router.put('/playlist',authenticateUser, updateDefaultPlaylist);

// @route   DELETE /api/user/playlist/:songId
// @desc    Remove song from default playlist
// @access  Private
router.delete('/playlist/:songId',authenticateUser, removeSongFromPlaylist);

// @route   GET /api/user/landing/:userId
// @desc    Get cafe info
// @access  Public
router.get('/landing/:userId', getCafeInfo);

module.exports = router;

