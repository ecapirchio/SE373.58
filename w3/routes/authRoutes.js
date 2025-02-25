const express = require('express');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const router = express.Router();

const session = require('express-session');

// Middleware to store session
router.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Show Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: 'All fields are required!' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        // Store user session
        req.session.user = user;
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'Error logging in' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


// Show Registration Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle User Registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render('register', { error: 'All fields are required!' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('register', { error: 'Username or Email already exists' });
        }

        // Save new user
        const user = new User({ username, email, password });
        await user.save();

        res.redirect('/login'); // Redirect to login page after registration
    } catch (error) {
        console.error(error);
        res.render('register', { error: 'Error registering user' });
    }
});

module.exports = router;
