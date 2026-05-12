const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please login.'
        });
    }
    
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user || !user.isActive) {
            req.session.destroy();
            return res.status(401).json({
                success: false,
                message: 'User account not found or inactive'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

const optionalAuth = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('-password');
            if (user && user.isActive) {
                req.user = user;
            }
        } catch (error) {
            console.error('Optional auth error:', error);
        }
    }
    next();
};

module.exports = { isAuthenticated, optionalAuth };