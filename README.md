# Library Management System

## Features

- **Unified Collection**: Managed Books and Journals in a single polymorphic schema.
- **Relational Integrity**: Links between Authors and their publications.
- **Premium UI**: Modern glassmorphism design with responsive tabbed navigation.
- **Security**: JWT-based authentication and Role-Based Access Control (RBAC).
- **Automated Relations**: Dynamic author selection in admin forms.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), JavaScript (ES6+)
- **Auth**: JSON Web Tokens (JWT) & Bcrypt

---

## Architecture (MVC)

```data
Assignment3/
├── models/                 # Data Models
│   ├── Book.js             # Unified Book/Journal Schema
│   ├── Author.js           # Author Schema
│   └── User.js             # User & Auth Schema
├── controllers/            # Business Logic
│   ├── bookController.js
│   ├── authorController.js
│   └── userController.js
├── routes/                 # API Endpoints
│   ├── books.js
│   ├── authors.js
│   └── users.js
├── middleware/             # Security & Helpers
│   ├── auth.js             # RBAC & JWT Middleware
│   └── errorHandler.js
├── public/                 # Frontend Application
│   ├── index.html          # Main UI
│   ├── styles.css          # Design System
│   └── script.js           # App Logic
└── server.js               # Server Entry Point
```

---

## Access Control

| Role | Browse Books | View Authors | Manage Data (CRUD) |
|------|--------------|--------------|--------------------|
| Guest | ✅ | ✅ | ❌ |
| User | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ |

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the App
```bash
# Development
npm run dev

# Production
npm start
```
Access at: `http://localhost:3000`

---

## API Documentation

### Authentication
- `POST /api/users/register`: Create a new account.
- `POST /api/users/login`: Authenticate and receive a JWT.

### Books & Journals
- `GET /api/books`: Fetch all entries (populated with Authors).
- `POST /api/books`: Create a new entry (Admin only).
- `DELETE /api/books/:id`: Remove an entry (Admin only).

### Authors
- `GET /api/authors`: Fetch all authors with book counts.
- `GET /api/authors/:id`: Fetch author profile and all linked books.
- `POST /api/authors`: Register a new author (Admin only).
- `DELETE /api/authors/:id`: Remove an author (Admin only).

---

## Postman Testing
A Postman collection is included in the project for automated testing.
- Import the collection.
- Use the `Login` endpoint to get a token.
- Set the `Authorization` header to `Bearer <your_token>` for protected routes.