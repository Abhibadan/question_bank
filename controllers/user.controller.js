const { request } = require("express");
const User=require("../models/user.model");
const UserAuth=require("../helpers/UserAuth");


/**
 * Fetches the current user and returns a JSON response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} - A JSON response containing the user data.
 */
const getUser=async(req,res)=>{
    return res.status(200).json({
        message:"User fetched successfully",
        data:req.user
    })
}

/**
 * Updates the profile of the current user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The current authenticated user.
 * @param {string} [req.body.name] - The new name for the user.
 * @param {string} [req.body.password] - The new password for the user.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} - A JSON response indicating the success of the profile update.
 */
const editProfile=async (req,res)=>{
    const user=req.user;
    const {name,password}=req.body;
    if(name) user.name=name;
    if(password){
        if(await UserAuth.comparePassword(password,user.password)){
            return res.status(400).json({
                message:"Password should not same with old password"
            });
        }
        user.password=await UserAuth.hashPassword(password);
    } 
    await user.save();
    return res.status(200).json({message:"Profile updated successfully"});
}

/**
 * Updates the profile picture of the current user. took image file in body as profilePicture 
 * and save it in public/images/profilePicture
 * then pass the path of the image in profilePicture field to this controller function
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.user - The current authenticated user.
 * @param {string} req.file.path - The path of the uploaded profile picture file.
 * @param {Object} res - The Express response object.
 * @returns {Promise<Object>} - A JSON response indicating the success of the profile picture update.
 */
const editProfilePicture = async (req, res) => {
    const user = req.user;

    try {
        // console.log(req.file.path);
        user.profilePicture = req.file.path.replace(/^public/, '');
        await user.save();
        return res.status(200).json({ message: "Profile picture updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports={
    getUser,
    editProfile,
    editProfilePicture
}