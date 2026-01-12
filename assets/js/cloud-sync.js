// Cloud Sync Module for Hours Tracker
// Syncs data between localStorage and Node.js backend

const API_BASE_URL = 'http://localhost:3000/api';
const SYNC_TOKEN_KEY = 'hoursTracker_apiToken';

// Cloud sync configuration
let cloudSyncEnabled = false;
let apiToken = localStorage.getItem(SYNC_TOKEN_KEY);

// Check if cloud sync is available
async function checkCloudAvailability() {
    try {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Login to cloud
async function loginToCloud(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        apiToken = data.token;
        localStorage.setItem(SYNC_TOKEN_KEY, apiToken);
        cloudSyncEnabled = true;

        return { success: true, admin: data.admin };
    } catch (error) {
        console.error('Cloud login error:', error);
        return { success: false, error: error.message };
    }
}

// Initialize cloud admin
async function initializeCloudAdmin() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Cloud init error:', error);
        return false;
    }
}

// Get auth headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
    };
}

// Sync students to cloud
async function syncStudentsToCloud(students) {
    if (!cloudSyncEnabled || !apiToken) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/students/sync`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ students })
        });

        return response.ok;
    } catch (error) {
        console.error('Error syncing students to cloud:', error);
        return false;
    }
}

// Sync events to cloud
async function syncEventsToCloud(events) {
    if (!cloudSyncEnabled || !apiToken) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/events/sync`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ events })
        });

        return response.ok;
    } catch (error) {
        console.error('Error syncing events to cloud:', error);
        return false;
    }
}

// Load students from cloud
async function loadStudentsFromCloud() {
    if (!cloudSyncEnabled || !apiToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load students');

        const students = await response.json();

        // Convert MongoDB _id to id for compatibility
        return students.map(s => ({
            id: s._id,
            name: s.name,
            email: s.email,
            sessions: s.sessions,
            totalHours: s.totalHours
        }));
    } catch (error) {
        console.error('Error loading students from cloud:', error);
        return null;
    }
}

// Load events from cloud
async function loadEventsFromCloud() {
    if (!cloudSyncEnabled || !apiToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load events');

        const events = await response.json();

        // Convert for compatibility
        return events.map(e => ({
            id: e._id,
            name: e.name,
            description: e.description,
            hours: e.hours,
            students: e.students.map(s => ({
                id: s.studentId,
                name: s.name
            })),
            date: e.createdAt
        }));
    } catch (error) {
        console.error('Error loading events from cloud:', error);
        return null;
    }
}

// Add student to cloud
async function addStudentToCloud(student) {
    if (!cloudSyncEnabled || !apiToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name: student.name,
                email: student.email
            })
        });

        if (!response.ok) throw new Error('Failed to add student');

        const savedStudent = await response.json();
        return {
            id: savedStudent._id,
            name: savedStudent.name,
            email: savedStudent.email,
            sessions: savedStudent.sessions,
            totalHours: savedStudent.totalHours
        };
    } catch (error) {
        console.error('Error adding student to cloud:', error);
        return null;
    }
}

// Update student sessions in cloud
async function updateStudentSessionsInCloud(studentId, sessions) {
    if (!cloudSyncEnabled || !apiToken) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ sessions })
        });

        return response.ok;
    } catch (error) {
        console.error('Error updating student in cloud:', error);
        return false;
    }
}

// Delete student from cloud
async function deleteStudentFromCloud(studentId) {
    if (!cloudSyncEnabled || !apiToken) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting student from cloud:', error);
        return false;
    }
}

// Add event to cloud
async function addEventToCloud(event) {
    if (!cloudSyncEnabled || !apiToken) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name: event.name,
                description: event.description,
                hours: event.hours,
                studentIds: event.students.map(s => s.id)
            })
        });

        if (!response.ok) throw new Error('Failed to add event');

        const savedEvent = await response.json();
        return {
            id: savedEvent._id,
            name: savedEvent.name,
            description: savedEvent.description,
            hours: savedEvent.hours,
            students: savedEvent.students,
            date: savedEvent.createdAt
        };
    } catch (error) {
        console.error('Error adding event to cloud:', error);
        return null;
    }
}

// Delete event from cloud
async function deleteEventFromCloud(eventId) {
    if (!cloudSyncEnabled || !apiToken) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting event from cloud:', error);
        return false;
    }
}

// Full sync - push local data to cloud
async function fullSyncToCloud() {
    if (!cloudSyncEnabled || !apiToken) {
        console.log('Cloud sync not enabled');
        return false;
    }

    try {
        // Load local data
        const localStudents = JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
        const localEvents = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');

        // Sync to cloud
        const studentsSuccess = await syncStudentsToCloud(localStudents);
        const eventsSuccess = await syncEventsToCloud(localEvents);

        return studentsSuccess && eventsSuccess;
    } catch (error) {
        console.error('Full sync error:', error);
        return false;
    }
}

// Full sync - pull cloud data to local
async function fullSyncFromCloud() {
    if (!cloudSyncEnabled || !apiToken) {
        console.log('Cloud sync not enabled');
        return false;
    }

    try {
        const cloudStudents = await loadStudentsFromCloud();
        const cloudEvents = await loadEventsFromCloud();

        if (cloudStudents !== null) {
            localStorage.setItem(STUDENTS_KEY, JSON.stringify(cloudStudents));
        }

        if (cloudEvents !== null) {
            localStorage.setItem(EVENTS_KEY, JSON.stringify(cloudEvents));
        }

        return cloudStudents !== null && cloudEvents !== null;
    } catch (error) {
        console.error('Full sync from cloud error:', error);
        return false;
    }
}

// Enable cloud sync
function enableCloudSync() {
    cloudSyncEnabled = true;
}

// Disable cloud sync
function disableCloudSync() {
    cloudSyncEnabled = false;
    localStorage.removeItem(SYNC_TOKEN_KEY);
    apiToken = null;
}

// Check if cloud sync is enabled
function isCloudSyncEnabled() {
    return cloudSyncEnabled && apiToken !== null;
}
