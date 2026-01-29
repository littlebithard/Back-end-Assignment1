# Library Management API
A full-stack Library Management System built with Node.js, Express, MongoDB, and JWT authentication. This project implements the MVC (Model-View-Controller) pattern with role-based access control.

## Project Overview
This API manages a library system with two main entities:
- **Books**: Primary object for managing book inventory
- **Journals**: Secondary object for managing journal/magazine inventory

## Architecture

### MVC Pattern Implementation

```
Assignment4/
├── models/              # Data models (MongoDB schemas)
│   ├── Book.js         # Book schema definition
│   ├── Journal.js      # Journal schema definition
│   └── User.js         # User schema with authentication
├── routes/             # API route definitions
│   ├── books.js        # Book routes
│   ├── journals.js     # Journal routes
│   └── users.js        # User authentication routes
├── controllers/        # Business logic
│   ├── bookController.js
│   ├── journalController.js
│   └── userController.js
├── middleware/         # Custom middleware
│   ├── auth.js         # Authentication & authorization
│   └── errorHandler.js # Global error handling
├── config/            # Configuration files
│   └── db.js          # Database connection
├── public/            # Static files
│   └── index.html     # Frontend interface
├── server.js          # Application entry point
├── .env              # Environment variables
└── package.json      # Dependencies
```

## Authentication & Authorization

### User Roles
- **User**: Can view books and journals (read-only access)
- **Admin**: Full CRUD access to books and journals

### Security Features
1. **Password Hashing**: Uses bcrypt with 10 salt rounds
2. **JWT Tokens**: Secure token-based authentication (24-hour expiry)
3. **Role-Based Access Control (RBAC)**: Middleware-based permission system

### Access Control Matrix

| Endpoint | Public | User | Admin |
|----------|--------|------|-------|
| GET /api/books | ✅ | ✅ | ✅ |
| GET /api/journals | ✅ | ✅ | ✅ |
| POST /api/books | ❌ | ❌ | ✅ |
| PUT /api/books/:id | ❌ | ❌ | ✅ |
| DELETE /api/books/:id | ❌ | ❌ | ✅ |
| POST /api/journals | ❌ | ❌ | ✅ |
| PUT /api/journals/:id | ❌ | ❌ | ✅ |
| DELETE /api/journals/:id | ❌ | ❌ | ✅ |

## Installation & Setup
### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm

### Installation Steps
1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Edit the `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/books_library
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

4. **Run the Application**
```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## API Endpoints
### Authentication
#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "user"  // or "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Books
#### Get All Books (Public)
```http
GET /api/books
```

#### Get Single Book (Public)
```http
GET /api/books/:id
```

#### Create Book (Admin Only)
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "price": 12.99,
  "publishedYear": 1925,
  "description": "A classic American novel",
  "inStock": true
}
```

#### Update Book (Admin Only)
```http
PUT /api/books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 15.99,
  "inStock": false
}
```

#### Delete Book (Admin Only)
```http
DELETE /api/books/:id
Authorization: Bearer <token>
```

### Journals
Same CRUD operations as Books:
- `GET /api/journals`
- `GET /api/journals/:id`
- `POST /api/journals` (Admin only)
- `PUT /api/journals/:id` (Admin only)
- `DELETE /api/journals/:id` (Admin only)

**Journal Schema:**
```json
{
  "title": "Nature",
  "publisher": "Springer Nature",
  "issue": "Vol. 123, Issue 4",
  "price": 25.00,
  "publishedDate": "2024-01-15",
  "description": "Leading scientific journal",
  "inStock": true
}
```

## Error Handling
### Validation Errors (400)
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Title is required", "Price cannot be negative"]
}
```

### Authentication Errors (401)
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```

### Authorization Errors (403)
```json
{
  "success": false,
  "message": "Forbidden: You do not have permission to access this resource"
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "message": "Book not found"
}
```

### Server Errors (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Data Models

### Book Model
```javascript
{
  title: String (required, 1-200 chars),
  author: String (required),
  genre: String (enum: Fiction, Non-Fiction, Mystery, Sci-Fi, Romance, Biography, Other),
  price: Number (min: 0, default: 0),
  description: String (max: 1000 chars),
  publishedYear: Number (1000 - current year),
  inStock: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Journal Model
```javascript
{
  title: String (required),
  publisher: String (required),
  issue: String (required),
  price: Number (min: 0, default: 0),
  publishedDate: Date,
  description: String (max: 1000 chars),
  inStock: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### User Model
```javascript
{
  email: String (required, unique, valid email format),
  password: String (required, hashed, min: 6 chars),
  role: String (enum: user, admin, default: user),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Testing the API

### Using the Web Interface
1. Open http://localhost:3000 in your browser
2. Register an admin account
3. Login with credentials
4. Add books and journals using the forms

### Using Postman

1. **Register Admin User**
```
POST http://localhost:3000/api/users/register
Body: { "email": "admin@test.com", "password": "admin123", "role": "admin" }
```

2. **Login to Get Token**
```
POST http://localhost:3000/api/users/login
Body: { "email": "admin@test.com", "password": "admin123" }
```

3. **Create Book with Token**
```
POST http://localhost:3000/api/books
Headers: Authorization: Bearer <your_token>
Body: { "title": "Test Book", "author": "Test Author" }
```

## Key Features

1. **Proper MVC Architecture**: Clear separation of concerns
2. **Full CRUD Operations**: Complete Create, Read, Update, Delete for both entities
3. **Authentication**: Secure JWT-based user authentication
4. **Authorization**: Role-based access control (RBAC)
5. **Password Security**: Bcrypt hashing with salt
6. **Error Handling**: Centralized error management
7. **Input Validation**: Mongoose schema validation
8. **Logging**: Request logging middleware
9. **Clean Code**: Well-documented and organized

## Development Notes

### Why MVC?
- **Separation of Concerns**: Models, routes, and controllers handle distinct responsibilities
- **Maintainability**: Easy to locate and modify specific functionality
- **Scalability**: Simple to add new features without affecting existing code
- **Testability**: Each component can be tested independently

### Future Enhancements
- Implement search and filtering
- Add book borrowing system
- Add admin dashboard
- Add email verification