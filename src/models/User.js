// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID, // Assuming userId is UUID (adjust as per your setup)
        defaultValue: DataTypes.UUIDV4, // Generate UUID automatically
        allowNull: false,
        unique: true,
    },
    qrCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    defaultPlaylist: {
        type: DataTypes.JSON, // Store as JSON
        defaultValue: [],
    },
    cafeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cafeAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cafeWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = User;

