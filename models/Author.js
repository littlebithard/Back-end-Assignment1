const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true,
        minlength: [1, 'Author name must be at least 1 character'],
        maxlength: [200, 'Author name cannot exceed 200 characters']
    },
    bio: {
        type: String,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    nationality: {
        type: String,
        trim: true,
        maxlength: [100, 'Nationality cannot exceed 100 characters']
    },
    dateOfBirth: {
        type: Date
    },
    website: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Author', authorSchema);

