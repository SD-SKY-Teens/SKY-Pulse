// Authentication System for Hours Tracker
// Admin credentials are stored in localStorage with hashed passwords

const AUTH_KEY = 'hoursTracker_auth';
const ADMINS_KEY = 'hoursTracker_admins';
const SESSION_KEY = 'hoursTracker_session';

// Initialize default admin if none exists
function initializeAuth() {
    const admins = getAdmins();
    if (admins.length === 0) {
        // Create default admin account
        const defaultAdmin = {
            username: 'admin',
            password: hashPassword('admin123'), // Change this default password
            name: 'Administrator',
            createdAt: new Date().toISOString()
        };
        admins.push(defaultAdmin);
        saveAdmins(admins);
        console.log('Default admin created: username=admin, password=admin123');
    }
}

// Simple hash function (for demo - in production use proper hashing)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Get admins from localStorage
function getAdmins() {
    const data = localStorage.getItem(ADMINS_KEY);
    return data ? JSON.parse(data) : [];
}

// Save admins to localStorage
function saveAdmins(admins) {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
}

// Check if user is authenticated
function isAuthenticated() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;

    try {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();

        // Session expires after 8 hours
        if (now - sessionData.timestamp > 8 * 60 * 60 * 1000) {
            logout();
            return false;
        }

        return true;
    } catch (e) {
        return false;
    }
}

// Login function
function login(username, password) {
    const admins = getAdmins();
    const hashedPassword = hashPassword(password);

    const admin = admins.find(a =>
        a.username === username && a.password === hashedPassword
    );

    if (admin) {
        const session = {
            username: admin.username,
            name: admin.name,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return true;
    }

    return false;
}

// Logout function
function logout() {
    localStorage.removeItem(SESSION_KEY);
}

// Get current session
function getCurrentSession() {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

// Add new admin (only accessible by existing admin)
function addAdmin(username, password, name) {
    if (!isAuthenticated()) return false;

    const admins = getAdmins();

    // Check if username already exists
    if (admins.find(a => a.username === username)) {
        return false;
    }

    const newAdmin = {
        username: username,
        password: hashPassword(password),
        name: name,
        createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    saveAdmins(admins);
    return true;
}

// Change password
function changePassword(username, oldPassword, newPassword) {
    if (!isAuthenticated()) return false;

    const admins = getAdmins();
    const admin = admins.find(a =>
        a.username === username && a.password === hashPassword(oldPassword)
    );

    if (admin) {
        admin.password = hashPassword(newPassword);
        saveAdmins(admins);
        return true;
    }

    return false;
}

// Initialize auth on load
initializeAuth();
