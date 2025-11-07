const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authUtils');
const User = require('../models/User');

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ msg: 'Name and email are required' });
        }

        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email is already in use' });
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;