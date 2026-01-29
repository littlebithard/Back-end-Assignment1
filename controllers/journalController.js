const Journal = require('../models/Journal');

exports.getAll = async (req, res, next) => {
    try {
        const journals = await Journal.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: journals.length,
            data: journals
        });
    } catch (error) {
        next(error);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const journal = await Journal.findById(req.params.id);

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: 'Journal not found'
            });
        }

        res.json({
            success: true,
            data: journal
        });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const journal = new Journal(req.body);
        await journal.save();

        res.status(201).json({
            success: true,
            message: 'Journal created successfully',
            data: journal
        });
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const journal = await Journal.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: 'Journal not found'
            });
        }

        res.json({
            success: true,
            message: 'Journal updated successfully',
            data: journal
        });
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const journal = await Journal.findByIdAndDelete(req.params.id);

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: 'Journal not found'
            });
        }

        res.json({
            success: true,
            message: 'Journal deleted successfully',
            data: journal
        });
    } catch (error) {
        next(error);
    }
};