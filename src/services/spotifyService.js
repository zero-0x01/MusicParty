// src/services/spotifyService.js
const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../config/config');

const spotifyApi = new SpotifyWebApi({
    clientId: config.spotifyClientId,
    clientSecret: config.spotifyClientSecret,
});

// Retrieve an access token
const getAccessToken = async () => {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body.access_token);
        console.log('Spotify API access token retrieved');
    } catch (err) {
        console.error('Error retrieving Spotify API access token:', err);
    }
};

// Initialize access token
getAccessToken();
setInterval(getAccessToken, 60 * 60 * 1000); // Refresh token every hour

// Example function t
// o
const searchTracks = async (searchQuery) => {
    try {
        const data = await spotifyApi.searchTracks(searchQuery);
        // Return only the tracks from the response
        return data.body.tracks.items;
    } catch (error) {
        console.error('Error in searchTracks:', error);
        throw error;
    }
};

module.exports = {
    searchTracks,
};

