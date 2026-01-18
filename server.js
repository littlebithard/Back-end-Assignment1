require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

app.use('/api/books', bookRoutes);

app.get('/api', (req, res) => {
    res.json({
        message: 'Books Library API',
        version: '1.0.0',
        endpoints: {
            books: {
                getAll: 'GET /api/books',
                getOne: 'GET /api/books/:id',
                create: 'POST /api/books',
                update: 'PUT /api/books/:id',
                delete: 'DELETE /api/books/:id'
            }
        }
    });
});

//Note 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

//Note Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});