const { validationResult } = require('express-validator');
const spotifyApi = require('../services/spotifyService');
const { searchTracks } = require('../services/spotifyService');
const Music = require('../models/Music');
const Queue = require('../models/Queue');
const User = require('../models/User');
const config = require('../config/config');

exports.searchMusic = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { searchQuery } = req.body;
    try {
        const data = await searchTracks(searchQuery);

        // Check if data exists and has the expected structure
        if (!data  || data.length === 0) {
            return res.status(404).json({ message: 'No tracks found for the search query' });
        }

        const tracks = [];
        for (const track of data) {
            tracks.push({
                spotifyId: track.id,
                title: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name,
                duration_ms: track.duration_ms,
                preview_url: track.preview_url,
            });
        }

        res.status(200).json(tracks);
    } catch (error) {
        console.error('Error searching Spotify tracks:', error);
        res.status(500).json({ message: 'Error searching Spotify tracks' });
    }
};



exports.addMusicToQueue = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { spotifyId, title, artist, album, duration_ms, preview_url } = req.body;
    let userId;

    // Check for JWT token in headers (for authenticated users)
    const token = req.header('Authorization');
    if (token) {
        try {
            // Verify JWT token and extract user ID
            const decoded = jwt.verify(token.split(' ')[1], config.jwtSecret); // Use jwtSecret from config
            userId = decoded.userId; // Assuming your JWT payload has the userId
        } catch (error) {
            console.error('Error verifying JWT token:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        // For unauthenticated users (from QR code or other means)
        try {
            const decodedId = atob(req.body.base64Id); // Decode base64 encoded ID
            userId = decodedId;// Use the decoded ID as userId
        } catch (error) {
            console.error('Error decoding ID from QR code:', error);
            return res.status(400).json({ message: 'Invalid QR code or ID format' });
        }
    }

    try {
        const newMusic = await Music.create({
            spotifyId,
            title,
            artist,
            album,
            duration_ms,
            preview_url,
            addedBy: userId, // Associate the music with the userId
        });

        const newQueueItem = await Queue.create({
            musicId: newMusic.id,
            spotifyId,
            title,
            artist,
            album,
            duration_ms,
            preview_url,
            addedBy: userId, // Associate the queue item with the userId
        });

        res.status(201).json(newQueueItem);
    } catch (error) {
        console.error('Error adding music to queue:', error);
        res.status(500).json({ message: 'Error adding music to queue' });
    }
};

exports.showQueue = async (req, res) => {
    const { userId } = req.params;
    const decodeId = atob(userId);
    try {
        const queryOptions = {
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: Music,
                    attributes: ['spotifyId', 'title', 'artist', 'album', 'duration_ms', 'preview_url'],
                },
                {
                    model: User,
                    attributes: ['cafeName'],
                },
            ],
        };

        if (userId) {
            queryOptions.where = { addedBy: decodeId };
        }

        const queue = await Queue.findAll(queryOptions);

        const formattedQueue = queue.map(item => ({
            id: item.id,
            status: item.status,
            music: item.Music,
            createdBy: item.User ? item.User.cafeName : 'Unknown',
            createdAt: item.createdAt,
        }));

        res.status(200).json(formattedQueue);
    } catch (error) {
        console.error('Error fetching queue:', error);
        res.status(500).json({ message: 'Error fetching queue' });
    }
};

exports.currentlyPlaying = async (req, res) => {
    const { userId } = req.params;
    const decodeId = atob(userId);
    try {
        const currentTrack = await Queue.findOne({
            where: { addedBy: decodeId, status: 'playing' },
            include: [
                {
                    model: Music,
                    attributes: ['id', 'spotifyId', 'title', 'artist', 'album', 'duration_ms', 'preview_url'],
                },
                {
                    model: User,
                    attributes: ['cafeName'],
                },
            ],
        });

        if (!currentTrack) {
            return res.status(200).json({ message: 'No music currently playing' });
        }

        const response = {
            id: currentTrack.id,
            status: currentTrack.status,
            music: currentTrack.Music,
            createdBy: currentTrack.User ? currentTrack.User.cafeName : 'Unknown',
            createdAt: currentTrack.createdAt,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching currently playing music:', error);
        res.status(500).json({ message: 'Error fetching currently playing music' });
    }
};
exports.deleteMusic = async (req, res) => {
    const { musicId } = req.params;
    try {
        const deletedQueueItem = await Queue.findOne({ where: { id: musicId } });

        if (!deletedQueueItem) {
            return res.status(404).json({ message: 'Music track not found in queue' });
        }

        await Queue.destroy({ where: { id: musicId } }); // Delete from queue
        await Music.destroy({ where: { id: deletedQueueItem.musicId } }); // Delete corresponding music

        res.status(200).json({ message: 'Music track deleted successfully' });
    } catch (error) {
        console.error('Error deleting music track:', error);
        res.status(500).json({ message: 'Error deleting music track' });
    }
};
