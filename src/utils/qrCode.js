const QRCode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');

async function generateQRCode(data, userId) {
    try {
        //const base64Data = Buffer.from(data).toString('base64');
        const qrCodeImage = await QRCode.toFile(`/home/aw/Documents/Projects/Tmp/MusicParty/musicparty-backend/storage/${userId}.png`, data);
        return `${userId}.png`; // Return the filename or storage URL
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err; // Handle the error appropriately
    }
}

module.exports = {
    generateQRCode,
};

