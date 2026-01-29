const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided. Please login first.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

exports.authorize = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: You do not have permission to access this resource'
        });
    }
    next();
};