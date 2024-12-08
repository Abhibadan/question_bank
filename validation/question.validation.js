const {body}=require('express-validator');


const questionValidator = {
    assignCategory:[
        body('category_id')
        .notEmpty()
        .withMessage('Category id is required')
        .isMongoId()
        .withMessage('Category id must be a mongongodb id'),
    ]
}

module.exports = questionValidator;