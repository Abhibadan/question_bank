const { request } = require("express");
const User=require("../models/user.model");
const UserAuth=require("../helpers/UserAuth");


const getUser=async(req,res)=>{
    return res.status(200).json({
        message:"User fetched successfully",
        data:req.user
    })
}

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