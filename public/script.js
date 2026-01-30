let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

const BOOKS_API = '/api/books';
const JOURNALS_API = '/api/journals';
const USERS_API = '/api/users';

// Show message
function showMessage(text, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
    setTimeout(() => messageDiv.innerHTML = '', 5000);
}

// Check authentication on load
function checkAuth() {
    if (authToken && currentUser) {
        showMainContent();
    } else {
        showAuthSection();
    }
}

function showAuthSection() {
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

function showMainContent() {
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userRole').textContent = currentUser.role;

    // List of all ID's that should only be visible to Admins
    const adminSectionIds = [
        'addBookSection',
        'deleteBookSection',
        'addJournalSection',
        'deleteJournalSection'
    ];

    // Toggle logic
    adminSectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (currentUser.role === 'admin') {
            // If Admin, SHOW the section
            element.classList.remove('hidden');
        } else {
            // If NOT Admin (User), HIDE the section
            element.classList.add('hidden');
        }
    });

    loadBooks();
    loadJournals();
}

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('role').value
    };

    try {
        const response = await fetch(`${USERS_API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            showMessage('Registration successful! Please login.', 'success');
            document.getElementById('registerForm').reset();
        } else {
            showMessage(result.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage('Registration failed', 'error');
        console.error('Error:', error);
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch(`${USERS_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.success) {
            authToken = result.token;
            currentUser = result.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Login successful!', 'success');
            document.getElementById('loginForm').reset();
            showMainContent();
        } else {
            showMessage(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Login failed', 'error');
        console.error('Error:', error);
    }
});

// Logout
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // Re-hide admin sections immediately to prevent flickering on next login
    const adminSectionIds = ['addBookSection', 'deleteBookSection', 'addJournalSection', 'deleteJournalSection'];
    adminSectionIds.forEach(id => document.getElementById(id).classList.add('hidden'));

    showMessage('Logged out successfully', 'info');
    showAuthSection();
}

// Load Books
async function loadBooks() {
    const container = document.getElementById('booksContainer');
    try {
        const response = await fetch(BOOKS_API);
        const result = await response.json();

        if (result.success) {
            if (result.data.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666;">No books found.</p>';
                return;
            }
            container.innerHTML = result.data.map(book => `
                        <div class="item-card">
                            <div class="item-title">${book.title}</div>
                            <div class="item-info"><strong>Author:</strong> ${book.author}</div>
                            ${book.genre ? `<div class="item-info"><strong>Genre:</strong> ${book.genre}</div>` : ''}
                            ${book.price ? `<div class="item-info"><strong>Price:</strong> $${book.price}</div>` : ''}
                            ${book.publishedYear ? `<div class="item-info"><strong>Year:</strong> ${book.publishedYear}</div>` : ''}
                            ${book.description ? `<div class="item-info" style="margin-top: 10px;">${book.description}</div>` : ''}
                            ${currentUser && currentUser.role === 'admin' ? `<button class="btn btn-logout" onclick="deleteBookById('${book._id}')">Delete</button>` : ''}
                        </div>
                    `).join('');
        } else {
            container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Error loading books</p>';
        }
    } catch (error) {
        container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Failed to load books</p>';
        console.error('Error:', error);
    }
}


// Add Book
document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        genre: document.getElementById('genre').value,
        price: document.getElementById('price').value || undefined,
        publishedYear: document.getElementById('publishedYear').value || undefined,
        description: document.getElementById('description').value || undefined
    };
    try {
        const response = await fetch(BOOKS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showMessage('Book added successfully!', 'success');
            document.getElementById('bookForm').reset();
            loadBooks();
        } else {
            showMessage(result.message || 'Error adding book', 'error');
        }
    } catch (error) {
        showMessage('Failed to add book', 'error');
        console.error('Error:', error);
    }
});

// Delete Book by button
window.deleteBookById = async function (id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
        const response = await fetch(`${BOOKS_API}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const result = await response.json();
        if (result.success) {
            showMessage('Book deleted successfully!', 'success');
            loadBooks();
        } else {
            showMessage(result.message || 'Error deleting book', 'error');
        }
    } catch (error) {
        showMessage('Failed to delete book', 'error');
        console.error('Error:', error);
    }
}

document.getElementById('deleteBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookId = document.getElementById('deleteBookId').value;

    try {
        const response = await fetch(`${BOOKS_API}/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const result = await response.json();

        if (result.success) {
            showMessage('Book deleted successfully!', 'success');
            document.getElementById('deleteBookForm').reset();
            loadBooks();
        } else {
            showMessage(result.message || 'Error deleting book', 'error');
        }
    } catch (error) {
        showMessage('Failed to delete book', 'error');
        console.error('Error:', error);
    }
});

// Load Journals
async function loadJournals() {
    const container = document.getElementById('journalsContainer');
    try {
        const response = await fetch(JOURNALS_API);
        const result = await response.json();

        if (result.success) {
            if (result.data.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666;">No journals found.</p>';
                return;
            }
            container.innerHTML = result.data.map(journal => `
                        <div class="item-card">
                            <div class="item-title">${journal.title}</div>
                            <div class="item-info"><strong>Publisher:</strong> ${journal.publisher}</div>
                            <div class="item-info"><strong>Issue:</strong> ${journal.issue}</div>
                            ${journal.price ? `<div class="item-info"><strong>Price:</strong> $${journal.price}</div>` : ''}
                            ${journal.publishedDate ? `<div class="item-info"><strong>Date:</strong> ${new Date(journal.publishedDate).toLocaleDateString()}</div>` : ''}
                            ${journal.description ? `<div class="item-info" style="margin-top: 10px;">${journal.description}</div>` : ''}
                            ${currentUser && currentUser.role === 'admin' ? `<button class="btn btn-logout" onclick="deleteJournalById('${journal._id}')">Delete</button>` : ''}
                        </div>
                    `).join('');
        } else {
            container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Error loading journals</p>';
        }
    } catch (error) {
        container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Failed to load journals</p>';
        console.error('Error:', error);
    }
}


// Add Journal
document.getElementById('journalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('jtitle').value,
        publisher: document.getElementById('publisher').value,
        issue: document.getElementById('issue').value,
        price: document.getElementById('jprice').value || undefined,
        publishedDate: document.getElementById('publishedYear').value || undefined,
        description: document.getElementById('jdescription').value || undefined
    };
    try {
        const response = await fetch(JOURNALS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            showMessage('Journal added successfully!', 'success');
            document.getElementById('journalForm').reset();
            loadJournals();
        } else {
            showMessage(result.message || 'Error adding journal', 'error');
        }
    } catch (error) {
        showMessage('Failed to add journal', 'error');
        console.error('Error:', error);
    }
});

// Delete Journal by button
window.deleteJournalById = async function (id) {
    if (!confirm('Are you sure you want to delete this journal?')) return;
    try {
        const response = await fetch(`${JOURNALS_API}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const result = await response.json();
        if (result.success) {
            showMessage('Journal deleted successfully!', 'success');
            loadJournals();
        } else {
            showMessage(result.message || 'Error deleting journal', 'error');
        }
    } catch (error) {
        showMessage('Failed to delete journal', 'error');
        console.error('Error:', error);
    }
}

document.getElementById('deleteJournalForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const journalId = document.getElementById('deleteJournalId').value;

    try {
        const response = await fetch(`${JOURNALS_API}/${journalId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const result = await response.json();

        if (result.success) {
            showMessage('Journal deleted successfully!', 'success');
            document.getElementById('deleteJournalForm').reset();
            loadJournals();
        } else {
            showMessage(result.message || 'Error deleting journal', 'error');
        }
    } catch (error) {
        showMessage('Failed to delete journal', 'error');
        console.error('Error:', error);
    }
});

// Initialize on page load
checkAuth();