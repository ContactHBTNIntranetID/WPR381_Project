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
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
};

const eventValidationRules = () => {
    return [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('date').isISO8601().withMessage('Valid date is required'),
        body('totalCapacity').isInt({ min: 1 }).withMessage('Valid capacity required'),
        body('price').isFloat({ min: 0 }).withMessage('Valid price required')
    ];
};

module.exports = { validate, userValidationRules, eventValidationRules };