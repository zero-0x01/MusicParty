// models/Queue.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Music = require('./Music');
const User = require('./User');

const Queue = sequelize.define('Queue', {
    status: {
        type: DataTypes.ENUM('playing', 'queued', 'finished'), 
        defaultValue: 'queued',
    },
    addedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'userId', 
        },},
    musicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
         },
});

// Define the association separately
Queue.belongsTo(User, { foreignKey: 'addedBy', targetKey: 'userId' });
Queue.belongsTo(Music, { foreignKey: 'musicId', targetKey: 'id' });

module.exports = Queue;

