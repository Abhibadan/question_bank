const {body}=require('express-validator');


const questionValidator = {
    assignCategory:[
        body('category_id')
        .notEmpty()
        .withMessage('Category id is required')
        .isString()
        .withMessage('Category id must be a string'),
    ]
}

module.exports = questionValidator;