// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const User = require('./models/User'); // Import models to ensure they're created 
const musicRoutes = require('./routes/musicRoutes');
const { authenticateUser } = require('./middlewares/authMiddleware');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes')); // Music routes
// Placeholder for other route imports
// app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/music', musicRoutes);
// Database Connection
sequelize.sync()
    .then(() => console.log('MySQL connected and tables created'))
    .catch(err => console.log(err));

module.exports = app;

