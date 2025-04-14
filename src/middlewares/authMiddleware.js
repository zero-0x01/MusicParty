const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), jwtSecret);
        req.user = decoded; // Attach decoded user information to req.user
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticateUser };

