const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { auditLog } = require('../middleware/auditLogger');

router.get('/login', authController.showLoginPage);
router.get('/register', authController.showRegisterPage);
router.post('/register', authLimiter, auditLog('REGISTER_ATTEMPT'), authController.register);
router.post('/login', authLimiter, auditLog('LOGIN_ATTEMPT'), authController.login);
router.get('/logout', isAuthenticated, auditLog('LOGOUT'), authController.logout);

module.exports = router;