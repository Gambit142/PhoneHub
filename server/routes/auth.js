const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, authMiddleware } = require('../utils/authUtils');

// @route   POST api/auth/register
// @desc    Register user (always creates customer)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Simple validation
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role: 'customer' // Force customer role for all frontend registrations
        });

        await user.save();

        const token = generateToken(user);
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // More detailed validation
        if (!email || !password) {
            return res.status(400).json({
                msg: 'Please provide both email and password',
                field: !email ? 'email' : 'password'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.error('Login failed: User not found');
            return res.status(400).json({
                msg: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }

        const isMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        if (!isMatch) {
            console.error('Login failed: Password comparison failed');
            return res.status(400).json({
                msg: 'Invalid credentials',
                code: 'INVALID_CREDENTIALS'
            });
        }


        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            msg: 'Server error',
            error: err.message
        });
    }
});

// @route   GET api/auth/me
// @desc    Get logged in user (protected route)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;