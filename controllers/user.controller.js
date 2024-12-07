const { request } = require("express");
const User=require("../models/user.model");
const getUser=async(req,res)=>{
    console.log(req.user);
    return res.status(200).json({
        message:"User fetched successfully",
        data:req.user
    })
    // try {
    //     const user=await User.find();
    //     return res.status(200).json({
    //         message:"user fetched successfully",
    //         data:user
    //     })
    // } catch (error) {
    //     return res.status(500).json({
    //         message:"Internal server error",
    //         error:error.message
    //     })
    // }
}

const register=(req,res)=>{
    const {email,password}=req.body;
    console.log(email,password);
}
module.exports={
    getUser
}