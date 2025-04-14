MusicParty Backend - README
===========================

This is the backend API for the MusicParty project. It is built using Node.js, Express, and Sequelize (with a MySQL database). The backend supports user authentication, music queue management, and more.

Purpose
-------
Allows users in a cafe or restaurant to scan a QR code and interact with a shared music queue through a RESTful API.

Tech Stack
----------
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- dotenv
- CORS

Directory Overview
------------------
src/
├── app.js                → Main application file
├── config/
│   └── database.js       → Sequelize DB config
├── models/
│   └── User.js           → Sequelize User model
├── routes/
│   ├── authRoutes.js     → Handles login, register
│   ├── userRoutes.js     → Handles user-specific endpoints
│   └── musicRoutes.js    → Handles music queue and interaction
├── middlewares/
│   └── authMiddleware.js → Token authentication logic

Environment Variables
---------------------
Create a `.env` file in the root directory with:
- DB_NAME=
- DB_USER=
- DB_PASSWORD=
- DB_HOST=
- JWT_SECRET=
- PORT=

API Endpoints
-------------
- POST   /api/auth/login       → User login
- POST   /api/auth/register    → User registration
- GET    /api/user/profile     → Get user profile (auth required)
- GET    /api/music/queue      → Get current music queue
- POST   /api/music/add        → Add a song to the queue

Usage
-----
1. Install dependencies:
   npm install

2. Create `.env` file and configure DB credentials

3. Start development server:
   npm run dev

4. The server runs on the port specified in your `.env` (default: 3000)

Database
--------
The backend uses Sequelize to manage MySQL database models and relations. Tables are automatically synced on server start.

Contribution
------------
Pull requests and suggestions are welcome.

License
-------
MIT License

