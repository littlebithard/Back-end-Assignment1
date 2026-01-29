const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    publisher: {
        type: String,
        required: [true, 'Publisher is required'],
        trim: true
    },
    issue: {
        type: String,
        required: [true, 'Issue is required']
    },
    price: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        default: 0
    },
    publishedDate: {
        type: Date
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Journal', journalSchema);