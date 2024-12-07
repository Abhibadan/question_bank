const { body } = require('express-validator');

const userValidations = {
    login: [
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    register: [
        body('name')
            .notEmpty()
            .withMessage('Name is required'),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
    ],
    editProfile: [
        body('username')
            .optional()
            .isString()
            .withMessage('Username must be a string'),
        body('password')
            .optional()
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        body('profilePicture')
            .optional()
            .isString()
            .withMessage('Profile picture must be a valid URL'),
    ],
};

module.exports = userValidations;
