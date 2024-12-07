const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message:errors.array()[0].msg });
    }
    
    next();
};
const validatePipeline = (validations) => [validations, validateRequest];

module.exports = validatePipeline;