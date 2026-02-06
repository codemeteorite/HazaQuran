const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// User Profile & Preferences
router.get('/profile', auth, userController.getProfile);
router.post('/goals', auth, userController.updateGoals);
router.post('/like/:surahId', auth, userController.toggleLikeSurah);

// Activity & Tracking
router.post('/activity/sync', auth, activityController.syncActivity);
router.get('/leaderboard', activityController.getLeaderboard);

module.exports = router;
