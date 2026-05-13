const User = require('../models/User');

exports.showLoginPage = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard/user');
    }
    res.render('auth/login', { 
        title: 'Login',
        user: req.user,
        error: null 
    });
};

exports.showRegisterPage = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard/user');
    }
    res.render('auth/register', { 
        title: 'Register',
        user: req.user,
        error: null 
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        // Validation
        if (password !== confirmPassword) {
            return res.render('auth/register', {
                title: 'Register',
                error: 'Passwords do not match',
                user: null
            });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Register',
                error: 'Email already registered',
                user: null
            });
        }
        
        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password
        });
        
        // Auto login after registration
        req.session.userId = user._id;
        req.session.userRole = user.role;
        
        res.redirect('/dashboard/user');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', {
            title: 'Register',
            error: error.message || 'Registration failed',
            user: null
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid credentials',
                user: null
            });
        }
        
        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid credentials',
                user: null
            });
        }
        
        // Check if user is active
        if (!user.isActive) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Account is deactivated',
                user: null
            });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        // Regenerate session ID to prevent session fixation attacks
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regeneration error:', err);
                return res.render('auth/login', {
                    title: 'Login',
                    error: 'Login failed. Please try again.',
                    user: null
                });
            }

            req.session.userId = user._id;
            req.session.userRole = user.role;

            if (user.role === 'admin') {
                res.redirect('/dashboard/admin');
            } else {
                res.redirect('/dashboard/user');
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login',
            error: 'Login failed. Please try again.',
            user: null
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/auth/login');
    });
};