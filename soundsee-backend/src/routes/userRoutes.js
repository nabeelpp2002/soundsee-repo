const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');

// Update user preferences
router.put('/:id/preferences', async (req, res) => {
    try {
        const { id } = req.params;
        const { preferences } = req.body;

        if (!preferences) {
            return res.status(400).json({ error: 'Preferences are required' });
        }

        const updatedUser = await userModel.updatePreferences(id, preferences);

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Preferences updated', user: updatedUser });
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile (name, email, phone)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const updatedUser = await userModel.updateProfile(id, name, email, phone);

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload profile image
router.post('/:id/upload-profile-image', upload.single('profileImage'), async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Upload to Cloudinary using buffer
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'soundsee/profiles',
                public_id: `user_${id}_${Date.now()}`,
                transformation: [
                    { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                    { quality: 'auto' }
                ]
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ error: 'Image upload failed' });
                }

                try {
                    // Update user's profile_image in database
                    const updatedUser = await userModel.updateProfileImage(id, result.secure_url);

                    if (!updatedUser) {
                        return res.status(404).json({ error: 'User not found' });
                    }

                    res.json({
                        message: 'Profile image uploaded successfully',
                        imageUrl: result.secure_url,
                        user: updatedUser
                    });
                } catch (dbError) {
                    console.error('Database update error:', dbError);
                    res.status(500).json({ error: 'Failed to update user profile' });
                }
            }
        );

        // Pipe the buffer to Cloudinary
        require('stream').Readable.from(req.file.buffer).pipe(uploadStream);

    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
