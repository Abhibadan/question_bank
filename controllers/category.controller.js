const Category = require("../models/category.model");

const getCategories = async(req,res)=>{
    const categories=await Category.find({});
    return res.status(200).json({
        message:"Categories fetched successfully",
        data:categories
    })
}

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