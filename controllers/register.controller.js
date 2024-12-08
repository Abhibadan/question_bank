const UserAuth =require('../helpers/UserAuth')
const User = require('../models/user.model')

/**
 * Registers a new user in the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the user's information.
 * @param {string} req.body.name - The user's name.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response containing the user's token, a success message, and a success flag.
 */
const register=async (req,res)=>{
    const {name,email,password}=req.body;
    const user= await User.findOne({'email':email});
    if(user){
        return res.status(409).json({'message':"User already exist","success":false})
    }else{
        try{
            const user=await User.create({
                name,
                email,
                profilePicture:"",
                password:await UserAuth.hashPassword(password)
            })
            const token=UserAuth.generateToken(user._id);
            return res.status(201).json({'data':{token},'message':"User registered successfully","success":true});
        }catch(err){
            return res.status(500).json({'message':"Somethig went wrong","success":false});
        }
        
    }
    
}

/**
 * Logs in a user to the system.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the user's login credentials.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON response containing the user's token, a success message, and a success flag.
 */
const login=async(req,res)=>{
    const {email,password}=req.body;
    const user= await User.findOne({'email':email});
    if(user){
        if(await UserAuth.comparePassword(password,user.password)){
            const token=UserAuth.generateToken(user._id);
            return res.status(200).json({'data':{token},'message':"User login successfully","success":true});
        }else{
            return res.status(400).json({'message':"Password isn't correct","success":false});
            
        }
    }else{
        return res.status(404).json({'message':"User not exist","success":false})
    }

}
module.exports={
    register,
    login
}