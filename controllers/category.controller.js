const Category = require("../models/category.model");


/**
 * Fetches all categories from the database and returns them in the response.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<Object>} - A JSON object containing the fetched categories.
 */
const getCategories = async(req,res)=>{
    const categories=await Category.find({}).collation({ locale: 'en', strength: 2 }).sort({ name: 1 });
    return res.status(200).json({
        message:"Categories fetched successfully",
        data:categories
    })
}


/**
 * Creates a new category in the database.
 * @param {Object} req - The HTTP request object containing the category name in the request body.
 * @param {string} req.body.name - The name of the category to be created.
 * @param {Object} res - The HTTP response object to return the created category or an error message.
 * @returns {Promise<Object>} - A JSON object containing the created category or an error message.
 */
const createCategory=async(req,res)=>{
    const {name}=req.body;
    try{
        if (await Category.findOne({ name: { $regex: new RegExp(name), $options: 'i' } })) {
            return res.status(409).json({ "message": "Category already exists" });
        }
        const category=new Category({name});
        await category.save();
        return res.status(201).json({
            message:"Category created successfully",
            data:category
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong",
        })
    }
    
}

module.exports={
    getCategories,
    createCategory
}