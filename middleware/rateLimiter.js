const rateLimit = require('express-rate-limit');

// Strict limiter for login and register — prevents brute force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,                   // max 10 attempts per window
    message: {
        success: false,
        message: 'Too many attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,  // Return rate limit info in RateLimit-* headers
    legacyHeaders: false
});

// General API limiter — prevents abuse of other endpoints
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { authLimiter, generalLimiter };
