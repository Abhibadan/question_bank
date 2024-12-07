const Category = require("../models/Category");

const getCategories = async(req,res)=>{
    const categories=await Category.find({});
    return res.status(200).json({
        message:"Categories fetched successfully",
        data:categories
    })
}

const createCategory=async(req,res)=>{
    const {name}=req.body;
    const category=new Category({name});
    await category.save();
    return res.status(201).json({
        message:"Category created successfully",
        data:category
    })
}

module.exports={
    getCategories,
    createCategory
}