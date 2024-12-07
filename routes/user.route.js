const Router=require('express').Router();
// const UserAuth=require('../helpers/UserAuth');
const {getUser}=require('../controllers/user.controller');

Router.get('/',getUser)

module.exports = Router;
