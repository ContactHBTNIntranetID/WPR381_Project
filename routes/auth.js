const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Show login form
router.get('/login', (req, res) => res.render('login'));

// Handle login submission
router.post('/login', authController.login);

// Show register form
router.get('/register', (req, res) => res.render('register'));

// Handle register submission
router.post('/register', authController.register);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
