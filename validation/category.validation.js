const { body } = require('express-validator');
const categoryValidations = {
    createCategory: [
        body('name')
            .notEmpty()
            .withMessage('Category name is required')
            .isString()
            .withMessage('Category name must be a string')
            .isLength({ min: 3, max: 20 })
            .withMessage('Category name must be between 3 and 20 characters long'),
    ],
};

module.exports = categoryValidations;
