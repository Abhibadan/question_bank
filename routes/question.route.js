const Router=require('express').Router();
const {getQuestions,storeQuestion}=require('../controllers/question.controller');
const upload = require('multer')();
// using multer to access the file only once no need to store it 
// thats why not using existing upload object


Router.get('/',getQuestions);
Router.post('/',upload.single('questions'),storeQuestion);

module.exports = Router;
