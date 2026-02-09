require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => {
    res.json({
        message: 'Library API',
        version: '3.0.0',
        endpoints: {
            books: {
                getAll: 'GET /api/books',
                getOne: 'GET /api/books/:id',
                create: 'POST /api/books (Admin only)',
                update: 'PUT /api/books/:id (Admin only)',
                delete: 'DELETE /api/books/:id (Admin only)'
            },
            authors: {
                getAll: 'GET /api/authors',
                getOneWithBooks: 'GET /api/authors/:id',
                create: 'POST /api/authors (Admin only)',
                update: 'PUT /api/authors/:id (Admin only)',
                delete: 'DELETE /api/authors/:id (Admin only)'
            },
            users: {
                register: 'POST /api/users/register',
                login: 'POST /api/users/login'
            }
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
