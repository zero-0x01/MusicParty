// src/controllers/userController.js
const User = require('../models/User');
const Queue = require('../models/Queue');
const { Buffer } = require('buffer');
const { Op } = require('sequelize');
const Music = require('../models/Music');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
   try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }, // Exclude password from query
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    const { cafeAddress, cafeWebsite } = req.body;

    try {
        let user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update fields only if provided in the request body
        if (cafeAddress !== undefined) {
            user.cafeAddress = cafeAddress;
        }
        if (cafeWebsite !== undefined) {
            user.cafeWebsite = cafeWebsite;
        }

        await user.save();

        // Send back only the updated fields
        res.json({
            id: user.id,
            cafeWebsite: user.cafeWebsite,
            cafeAddress: user.cafeAddress,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update default playlist
// @route   PUT /api/user/playlist
// @access  Private
exports.updateDefaultPlaylist = async (req, res) => {
    const { defaultPlaylist } = req.body;

    try {
        let user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.defaultPlaylist = defaultPlaylist;
        await user.save();

        res.json({
            userId: user.id,
            defaultPlaylist: user.defaultPlaylist
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Remove song from default playlist
// @route   DELETE /api/user/playlist/:songId
// @access  Private
exports.removeSongFromPlaylist = async (req, res) => {
    const { songId } = req.params;

    try {
        let user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Parse defaultPlaylist JSON string to array of objects
        let defaultPlaylist = JSON.parse(user.defaultPlaylist || '[]');

        // Filter out the song from the default playlist based on songId
        defaultPlaylist = defaultPlaylist.filter(song => song.spotifyId !== songId);

        // Update user's defaultPlaylist as JSON string
        user.defaultPlaylist = JSON.stringify(defaultPlaylist);
        await user.save();

        // Return simplified response with only user ID and updated playlist
        res.json({
            userId: user.id,
            defaultPlaylist: defaultPlaylist
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getCafeInfo = async (req, res) => {
    const { userId } = req.params;
    const decodedUserId = Buffer.from(userId, 'base64').toString('utf-8');

    try {
        const user = await User.findOne({ where: { userId: decodedUserId } });

        if (!user) {
            return res.status(404).json({ msg: 'Cafe not found' });
        }

        //const queue = await Queue.findAll({
          //  where: { addedBy: user.id, status: { [Op.ne]: 'finished' } },
            //order: [['createdAt', 'ASC']],
            //include: [
              //  {
                //    model: Music,
                  //  attributes: ['id', 'spotifyId', 'title', 'artist', 'album', 'duration_ms', 'preview_url'],
                //},
           // ],
        //});

        //const currentlyPlaying = queue.find(item => item.status === 'playing') || null;

        res.json({
            cafeName: user.cafeName,
            cafeAddress: user.cafeAddress,
            cafeWebsite: user.cafeWebsite,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

