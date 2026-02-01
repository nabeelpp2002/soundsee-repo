const cloudinary = require('cloudinary').v2;

// Cloudinary is configured via CLOUDINARY_URL environment variable
// Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME

// Verify configuration
if (!process.env.CLOUDINARY_URL) {
    console.warn('CLOUDINARY_URL not set in environment variables');
}

module.exports = cloudinary;
