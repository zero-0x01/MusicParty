// src/routes/musicRoutes.js

const express = require('express');
const { body, param } = require('express-validator');
const musicController = require('../controllers/musicController');
const authMiddleware = require('../middlewares/authMiddleware');
const { searchTracks } = require('../services/spotifyService');

const router = express.Router();

//router.get('/search', async (req, res) => {
  //  const { q } = req.query;

    //try {
      //  const tracks = await searchTracks(q);
        //res.json(tracks);
    //} catch (err) {
      //  console.error(err.message);
        //res.status(500).send('Server Error');
    //}
//});

// @route   POST /api/music/search
// @desc    Search for music
// @access  Public
router.post('/search',
    [
        body('searchQuery').notEmpty().withMessage('Search query is required'),
    ],
    musicController.searchMusic
);

// @route   POST /api/music/queue/add
// @desc    Add music to the queue
// @access  Public
router.post('/queue/add',
    [
        body('spotifyId').notEmpty().withMessage('Spotify ID is required'),
        body('title').notEmpty().withMessage('Title is required'),
        body('artist').notEmpty().withMessage('Artist is required'),
        body('album').notEmpty().withMessage('Album is required'),
        body('duration_ms').notEmpty().withMessage('Duration is required'),
        body('preview_url').optional(),
    ],
    musicController.addMusicToQueue
);

// @route   GET /api/music/queue/:userId
// @desc    Fetch the entire queue
// @access  Public
router.get('/queue/show/:userId',
    param('userId').notEmpty().withMessage('User ID is required'),
    musicController.showQueue
);

// @route   GET /api/music/queue/currently-playing
// @desc    Fetch currently playing music
// @access  Public
router.get('/queue/playing/:userId',
    musicController.currentlyPlaying
);

// @route   DELETE /api/music/queue/:musicId
// @desc    Delete music from the queue
// @access  Private
router.delete('/queue/:musicId',
    authMiddleware.authenticateUser,
    param('musicId').notEmpty().withMessage('Music ID is required'),
    musicController.deleteMusic
);

module.exports = router;

