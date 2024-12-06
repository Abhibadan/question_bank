const Router=require('express').Router();

const {register,login}=require('../controllers/register.controller')

Router.get('/',(req,res)=>{
    return res.render("registration")
})

Router.post('/register',register)
Router.post('/login',login)

module.exports=Router;