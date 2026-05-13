const { body, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            success: false,
            errors: errors.array()
        });
    };
};

const userValidationRules = () => {
    return [
        body('name')
            .trim()
            .escape()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/[0-9]/).withMessage('Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
    ];
};

const eventValidationRules = () => {
    return [
        body('title')
            .trim()
            .escape()
            .notEmpty().withMessage('Title is required')
            .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
        body('description')
            .trim()
            .escape()
            .notEmpty().withMessage('Description is required')
            .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
        body('date')
            .isISO8601().withMessage('Valid date is required'),
        body('totalCapacity')
            .isInt({ min: 1 }).withMessage('Valid capacity required'),
        body('price')
            .isFloat({ min: 0 }).withMessage('Valid price required')
    ];
};

const enquiryValidationRules = () => {
    return [
        body('name')
            .trim()
            .escape()
            .notEmpty().withMessage('Name is required')
            .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail().withMessage('Valid email is required'),
        body('subject')
            .trim()
            .escape()
            .notEmpty().withMessage('Subject is required')
            .isLength({ max: 150 }).withMessage('Subject cannot exceed 150 characters'),
        body('message')
            .trim()
            .escape()
            .notEmpty().withMessage('Message is required')
            .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
    ];
};

module.exports = { validate, userValidationRules, eventValidationRules, enquiryValidationRules };