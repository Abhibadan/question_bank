const Router=require('express').Router();
const {getCategories,createCategory}=require('../controllers/category.controller');
const categoryValidations=require('../validation/category.validation');
const validatePipeline = require('../middlewears/validateRequest.middlewear');


Router.get('/',getCategories);
Router.post('/',validatePipeline(categoryValidations.createCategory),createCategory);

module.exports = Router;
