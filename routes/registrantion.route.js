const Router=require('express').Router();

const {register,login}=require('../controllers/register.controller')
const userValidations = require('../validation/user.validation');
const validatePipeline = require('../middlewears/validateRequest.middlewear');

Router.get('/',(req,res)=>{
    return res.render("registration")
})

Router.post('/register',validatePipeline(userValidations.register),register)
Router.post('/login',validatePipeline(userValidations.login),login)

module.exports=Router;