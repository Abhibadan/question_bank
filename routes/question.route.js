const Router=require('express').Router();
const {getQuestions,assignQuestionCategory,storeQuestion}=require('../controllers/question.controller');
const upload = require('multer')();
// using multer to access the file only once no need to store it 
// thats why not using existing upload object

const questionValidator = require('../validation/question.validation');
const validatePipeline = require('../middlewears/validateRequest.middlewear');

Router.get('/',getQuestions);
Router.post('/',upload.single('questions'),storeQuestion);
Router.put('/:questionId',validatePipeline(questionValidator.assignCategory),assignQuestionCategory);

module.exports = Router;
