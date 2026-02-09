const Author = require('../models/Author');
const Book = require('../models/Book');

exports.getAll = async (req, res, next) => {
    try {
        const authors = await Author.find().sort({ createdAt: -1 });

        const authorIds = authors.map(a => a._id);
        const counts = await Book.aggregate([
            { $match: { author: { $in: authorIds } } },
            { $group: { _id: '$author', count: { $sum: 1 } } }
        ]);
        const countMap = counts.reduce((acc, c) => {
            acc[c._id.toString()] = c.count;
            return acc;
        }, {});

        const data = authors.map(author => ({
            ...author.toObject(),
            bookCount: countMap[author._id.toString()] || 0
        }));

        res.json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        next(error);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const author = await Author.findById(req.params.id);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: 'Author not found'
            });
        }

        const books = await Book.find({ author: author._id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                author,
                books
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const author = new Author(req.body);
        await author.save();

        res.status(201).json({
            success: true,
            message: 'Author created successfully',
            data: author
        });
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const author = await Author.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!author) {
            return res.status(404).json({
                success: false,
                message: 'Author not found'
            });
        }

        res.json({
            success: true,
            message: 'Author updated successfully',
            data: author
        });
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: 'Author not found'
            });
        }

        res.json({
            success: true,
            message: 'Author deleted successfully',
            data: author
        });
    } catch (error) {
        next(error);
    }
};

