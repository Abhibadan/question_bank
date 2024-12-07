const Router=require('express').Router();

const {getUser,editProfile,editProfilePicture}=require('../controllers/user.controller');
const userValidations=require('../validation/user.validation');
const validatePipeline = require('../middlewears/validateRequest.middlewear');
const upload = require('../middlewears/upload');


Router.get('/',getUser)
Router.put('/edit-profile',validatePipeline(userValidations.editProfile),editProfile)
Router.put('/edit-profile-picture',upload.single('profilePicture'),editProfilePicture)

module.exports = Router;
