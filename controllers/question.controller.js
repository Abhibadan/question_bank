const fs = require('fs');
const mongoose = require('mongoose');
const streamifier = require('streamifier');
const csvParser = require('csv-parser');
const Question = require('../models/question.model');
const Category = require('../models/category.model');



const getQuestions = async(req,res)=>{
    const page=Number(req.query.page) ||1;
    const limit=5;
    const skip=(page-1)*limit;
    const search=req.query.search||"";
    const category=req.query.category||"";

    let pipeline=[
        {
            $lookup: {
                from: "categories",
                localField: "categories", 
                foreignField: "_id", 
                as: "categoryDetails", 
            },
        },
        {
            $match: {
                $or: [
                    { question: { $regex: search, $options: "i" } }, 
                    { "categoryDetails.name": { $regex: search, $options: "i" } }, 
                ],
            },
        },
    ]
    if(category=="unassigned"){
        pipeline.push({
            $match: {
                categories: { $size: 0 }, 
            },
        });
    }else if (category !== "") {
        pipeline.push({
            $match: {
                "categoryDetails._id": mongoose.Types.ObjectId.createFromHexString(category)
            }
        });
    }

    pipeline.push(
        {
            $sort: {
                '_id': -1
            }
        },
        {
            $facet: {
                totalCount: [
                    { $count: "count" },
                ],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            question: 1,
                            categoryDetails: 1,
                        },
                    },
                ],
            },
        }
    )
    const questions = await Question.aggregate(pipeline);
    const{totalCount,data}=questions[0];
    if(totalCount.length===0){
        return res.status(404).json({message: "No questions found"});
    }else{
        return res.status(200).json({
            message: "Questions fetched successfully",
            data: {
                questions: data,
                totalCount: totalCount[0].count,
                currentPage: page,
                pageSize: limit,
                totalPages: Math.ceil(totalCount[0].count / limit),
            },
        })
    }
}


const storeQuestion = (req, res) => {
    const file = req.file;
    
    if (!file) {
        return res.status(400).send('No file uploaded');
    }
    const bufferStream = streamifier.createReadStream(file.buffer);
    // let questions=[];
    bufferStream
        .pipe(csvParser())  // Pipe the stream into the CSV parser
        .on('data', async (row) => {
            const cleanQuestion= ![undefined,null].includes(row.Question)?row.Question.trim():"";
            const cleanCategory= ![undefined,null].includes(row.Category)?row.Category.trim():"";

            if(cleanQuestion!="" && cleanCategory!=""){
                console.log(cleanQuestion,cleanCategory);
                try {
                    const category = await Category.findOne({ name: { $regex: new RegExp(cleanCategory), $options: 'i' } });
                    console.log(category);
                    if (category) {
                        const result=await Question.updateOne({ question: cleanQuestion},{
                            $addToSet: { categories: category._id },
                        },{upsert: true});
                        console.log(result);
                    }
                } catch (error) {
                    console.error(error.message);
                }
            }
        })
        .on('end', () => {
            res.status(200).json({message:'Unique Questions saved successfully'});
        })
        .on('error', (err) => {
            res.status(500).json({message:'Error processing CSV file'});
        });
};

const assignQuestionCategory = async(req, res) => {
    const { questionId } = req.params;
    const { category_id } = req.body;
    try {
        const question = await Question.findByIdAndUpdate(mongoose.Types.ObjectId.createFromHexString(questionId),
         { $addToSet:{ categories: mongoose.Types.ObjectId.createFromHexString(category_id) } }, { new: true });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        return res.status(200).json({ message: 'Question assigned to category successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
module.exports = {
    storeQuestion,
    getQuestions,
    assignQuestionCategory
}