const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
//const QRCode = require('qrcode');
const { generateQRCode } = require('../utils/qrCode');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, userId: user.userId, email: user.email }, config.jwtSecret, {
        expiresIn: '1h',
    });
};



exports.register = async (req, res) => {
    const { name, email, password, cafeName } = req.body;

    try {
        let user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        
        // Create the user
        const newUser = await User.create({
            name,
            email,
            password,
            cafeName,
        });

        // Check if newUser and newUser.id are defined
        if (!newUser || !newUser.id) {
            return res.status(400).json({ message: 'Failed to create user or obtain user ID' });
        }
        
        // Example userId (assuming it's a string or number)
        const userIdn = newUser.userId.toString(); // Convert to string if necessary

        // Encode userId to Base64
        const base64UserId = Buffer.from(userIdn).toString('base64');
        // Generate QR code and get filename
        const qrCodeFilename = await generateQRCode(`http://127.0.0.1:5000/user/${base64UserId}`, newUser.id);

        // Update user with QR code URL
        
        await newUser.update({ qrCode: qrCodeFilename });
        const token = generateToken(newUser);

        res.status(201).json({ token, newUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.json({ token, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

