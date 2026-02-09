let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

const BOOKS_API = '/api/books';
const AUTHORS_API = '/api/authors';
const USERS_API = '/api/users';

// --- UI Utilities ---

function showMessage(text, type = 'success') {
    const container = document.getElementById('message');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    container.appendChild(div);
    setTimeout(() => div.remove(), 5000);
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${tabName}Tab`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

// --- Auth Flow ---

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

    if (currentUser.role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    }

    loadBooks();
    loadAuthors();
    populateAuthorDropdowns();
}

function logout() {
    localStorage.clear();
    location.reload();
}

// --- API Operations ---

async function fetchAPI(url, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    try {
        const response = await fetch(url, { ...options, headers });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'API Error');
        return result;
    } catch (error) {
        showMessage(error.message, 'error');
        throw error;
    }
}

// --- Books & Journals ---

async function loadBooks() {
    const container = document.getElementById('booksContainer');
    try {
        const result = await fetchAPI(BOOKS_API);
        if (result.data.length === 0) {
            container.innerHTML = '<p class="info" style="grid-column: 1/-1; text-align: center;">No entries found in the collection.</p>';
            return;
        }

        container.innerHTML = result.data.map(item => `
            <div class="item-card">
                <span class="type-badge">${item.type}</span>
                <div class="item-title">${item.title}</div>
                <div class="item-info"><strong>Author:</strong> ${item.author?.name || 'Unknown'}</div>
                <div class="item-info"><strong>Genre:</strong> ${item.genre}</div>
                <div class="item-info"><strong>Price:</strong> ${item.price?.toFixed(2) || '0.00'}</div>
                <div class="item-info"><strong>Year:</strong> ${item.publishedYear || 'N/A'}</div>
                <p class="item-info" style="margin-top: 12px; font-style: italic;">${item.description || 'No description provided.'}</p>
                ${currentUser.role === 'admin' ? `
                    <div style="margin-top: 20px; text-align: right;">
                        <button class="btn btn-logout" onclick="deleteItem('${item._id}')">Delete</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (e) { }
}

async function populateAuthorDropdowns() {
    const dropdown = document.getElementById('authorSelect');
    if (!dropdown) return;

    try {
        const result = await fetchAPI(AUTHORS_API);
        dropdown.innerHTML = '<option value="" disabled selected>Select an author</option>' +
            result.data.map(a => `<option value="${a._id}">${a.name}</option>`).join('');
    } catch (e) { }
}

// --- Authors ---

async function loadAuthors() {
    const container = document.getElementById('authorsContainer');
    try {
        const result = await fetchAPI(AUTHORS_API);
        if (result.data.length === 0) {
            container.innerHTML = '<p class="info" style="grid-column: 1/-1; text-align: center;">No authors registered.</p>';
            return;
        }

        container.innerHTML = result.data.map(author => `
            <div class="item-card">
                <div class="item-title">${author.name}</div>
                <div class="item-info"><strong>Nationality:</strong> ${author.nationality || 'N/A'}</div>
                <div class="item-info"><strong>Works in system:</strong> ${author.bookCount || 0}</div>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="viewAuthorProfile('${author._id}')" style="flex: 1;">View Profile</button>
                    ${currentUser.role === 'admin' ? `
                        <button class="btn btn-logout" onclick="deleteAuthor('${author._id}')">&times;</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (e) { }
}

async function viewAuthorProfile(id) {
    const profileDiv = document.getElementById('authorProfile');
    const modal = document.getElementById('authorProfileSection');

    try {
        const result = await fetchAPI(`${AUTHORS_API}/${id}`);
        const { author, books } = result.data;

        profileDiv.innerHTML = `
            <div style="margin-bottom: 30px;">
                <p><strong>Nationality:</strong> ${author.nationality || 'N/A'}</p>
                <p><strong>Bio:</strong> ${author.bio || 'None'}</p>
                ${author.website ? `<p><strong>Website:</strong> <a href="${author.website}" target="_blank">${author.website}</a></p>` : ''}
            </div>
            <h3>Books by ${author.name}</h3>
            <div class="items-grid" style="margin-top: 15px;">
                ${books.map(b => `
                    <div class="item-card" style="padding: 15px;">
                        <span class="type-badge" style="top:10px; right:10px;">${b.type}</span>
                        <div style="font-weight: 700;">${b.title}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${b.genre} (${b.publishedYear})</div>
                    </div>
                `).join('') || '<p>No books found.</p>'}
            </div>
        `;
        modal.classList.remove('hidden');
    } catch (e) { }
}

function hideAuthorProfile() {
    document.getElementById('authorProfileSection').classList.add('hidden');
}

// --- Form Listeners ---

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const result = await fetchAPI(`${USERS_API}/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        authToken = result.token;
        currentUser = result.user;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainContent();
    } catch (e) { }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('role').value
    };

    try {
        await fetchAPI(`${USERS_API}/register`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        showMessage('Registration successful! Please login.');
        e.target.reset();
    } catch (e) { }
});

document.getElementById('bookForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        type: document.getElementById('type').value,
        author: document.getElementById('authorSelect').value,
        genre: document.getElementById('genre').value,
        price: parseFloat(document.getElementById('price').value) || 0,
        publishedYear: parseInt(document.getElementById('publishedYear').value),
        description: document.getElementById('description').value
    };

    try {
        await fetchAPI(BOOKS_API, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        showMessage('Entry added to collection!');
        e.target.reset();
        loadBooks();
    } catch (e) { }
});

document.getElementById('authorForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('authorName').value,
        nationality: document.getElementById('authorNationality').value,
        dateOfBirth: document.getElementById('authorDob').value,
        website: document.getElementById('authorWebsite').value,
        bio: document.getElementById('authorBio').value
    };

    try {
        await fetchAPI(AUTHORS_API, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        showMessage('Author added successfully!');
        e.target.reset();
        loadAuthors();
        populateAuthorDropdowns();
    } catch (e) { }
});

// --- Delete Operations ---

async function deleteItem(id) {
    if (!confirm('Are you sure?')) return;
    try {
        await fetchAPI(`${BOOKS_API}/${id}`, { method: 'DELETE' });
        showMessage('Removed from collection');
        loadBooks();
    } catch (e) { }
}

async function deleteAuthor(id) {
    if (!confirm('Are you sure? This will not delete their books, but they will show as "Unknown".')) return;
    try {
        await fetchAPI(`${AUTHORS_API}/${id}`, { method: 'DELETE' });
        showMessage('Author removed');
        loadAuthors();
        populateAuthorDropdowns();
    } catch (e) { }
}

// Bootstrap
checkAuth();
