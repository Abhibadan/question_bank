const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    question: { 
        type: String, 
        unique: true,
        required: true 
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

module.exports = mongoose.model('Question', questionSchema);
