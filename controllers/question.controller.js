const Question = require('../models/question.model');
const streamifier = require('streamifier');
const csvParser = require('csv-parser');
const fs = require('fs');


const getQuestions = async(req,res)=>{
    const page=req.query.page ||1;
    const limit=3;
    const skip=(page-1)*limit;
    const search=req.query.search||"";
    const categories=req.query.category||"";
    const questions = await Question.aggregate([
        {
            $match: {
                question: { $regex: search, $options: "i" }, 
            },
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
                            categories: 1,
                        },
                    },
                ],
            },
        },
    ]);
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
            const cleanQuestion= row.Question!==null?row.Question.trim():"";
            if(cleanQuestion!=""){
                try {
                    const question = new Question({ question: cleanQuestion });
                    await question.save();
                    // questions.push(question);
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


module.exports = {
    storeQuestion,
    getQuestions
}