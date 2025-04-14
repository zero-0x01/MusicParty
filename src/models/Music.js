// src/models/Music.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Music = sequelize.define('Music', {
    spotifyId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    album: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration_ms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    preview_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
     addedBy: {
        type: DataTypes.UUID, // Assuming addedBy is a foreign key to User's id
        allowNull: true,
        references: {
            model: User, // Reference to User model
            key: 'userId', // Reference to User's primary key
        },
    },
});

Music.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
module.exports = Music;

