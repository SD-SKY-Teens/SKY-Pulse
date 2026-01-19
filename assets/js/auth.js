// Authentication System for Hours Tracker - API Version
// Connects to Flask backend for authentication

const TOKEN_KEY = 'ht_auth_token';
const SESSION_KEY = 'ht_session_data';

// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://sky-backend-three.vercel.app/api';

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const session = localStorage.getItem(SESSION_KEY);

    if (!token || !session) return false;

    try {
        const sessionData = JSON.parse(session);
        const expiresAt = new Date(sessionData.expires_at);

        // Check if token has expired
        if (new Date() > expiresAt) {
            logout();
            return false;
        }

        return true;
    } catch (e) {
        return false;
    }
}

// Login function - calls API
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Login failed:', data.error);
            return false;
        }

        // Store token and session data
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            username: data.username,
            name: data.username,
            expires_at: data.expires_at
        }));

        return true;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

// Logout function
async function logout() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
}

// Get current session
function getCurrentSession() {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Verify token with server
async function verifyToken() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}
