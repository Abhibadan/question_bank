const questionSchema = new mongoose.Schema({
    text: { 
        type: String, 
        required: true 
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

module.exports = mongoose.model('Question', questionSchema);
