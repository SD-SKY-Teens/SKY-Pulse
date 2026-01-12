---
layout: default
title: Hours Tracker
permalink: /hours-tracker/
---

<script src="{{ '/assets/js/auth.js' | relative_url }}"></script>

<style>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .dark-mode .login-container {
    background: rgba(30, 30, 30, 0.95);
    color: #e0e0e0;
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .login-header h2 {
    margin: 0 0 10px 0;
    color: #667eea;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group-login {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .form-group-login label {
    font-weight: bold;
    font-size: 0.9em;
  }

  .form-group-login input {
    padding: 12px;
    border: 2px solid #cbd5e0;
    border-radius: 4px;
    font-size: 1em;
  }

  .form-group-login input:focus {
    outline: none;
    border-color: #667eea;
  }

  .login-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .login-btn:hover {
    opacity: 0.9;
  }

  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    background: #fed7d7;
    color: #c53030;
    padding: 10px;
    border-radius: 4px;
    text-align: center;
    font-size: 0.9em;
  }

  .dark-mode .error-message {
    background: #742a2a;
    color: #fc8181;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .dark-mode .admin-header {
    background: rgba(30, 30, 30, 0.95);
  }

  .admin-info {
    font-size: 0.9em;
  }

  .admin-info strong {
    color: #667eea;
  }

  .logout-btn {
    background: #e53e3e;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
  }

  .logout-btn:hover {
    opacity: 0.8;
  }

<style>
  .hours-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .dark-mode .card {
    background: rgba(30, 30, 30, 0.95);
    color: #e0e0e0;
  }

  .student-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .student-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .student-card:hover {
    transform: translateY(-5px);
  }

  .student-name {
    font-size: 1.3em;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .hours-display {
    font-size: 2em;
    font-weight: bold;
    margin: 15px 0;
  }

  .sessions-display {
    font-size: 1.1em;
    opacity: 0.9;
    margin-bottom: 15px;
  }

  .btn-group {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .btn-sm {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: opacity 0.2s;
  }

  .btn-sm:hover {
    opacity: 0.8;
  }

  .btn-add {
    background: #48bb78;
    color: white;
  }

  .btn-remove {
    background: #f56565;
    color: white;
  }

  .btn-primary {
    background: #4299e1;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    margin: 10px 5px;
  }

  .btn-secondary {
    background: #718096;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    margin: 10px 5px;
  }

  .form-group {
    margin: 15px 0;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    font-size: 1em;
  }

  .form-group textarea {
    min-height: 100px;
    resize: vertical;
  }

  .modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .dark-mode .modal-content {
    background-color: #2d3748;
    color: #e0e0e0;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover {
    color: #000;
  }

  .dark-mode .close:hover {
    color: #fff;
  }

  .stats-bar {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 20px 0;
  }

  .stat-item {
    text-align: center;
    padding: 15px;
  }

  .stat-number {
    font-size: 2em;
    font-weight: bold;
    color: #667eea;
  }

  .stat-label {
    font-size: 0.9em;
    color: #718096;
    margin-top: 5px;
  }

  .event-list {
    margin-top: 20px;
  }

  .event-item {
    background: #f7fafc;
    padding: 15px;
    margin: 10px 0;
    border-radius: 6px;
    border-left: 4px solid #667eea;
  }

  .dark-mode .event-item {
    background: #2d3748;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .event-name {
    font-weight: bold;
    font-size: 1.1em;
  }

  .event-hours {
    background: #667eea;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.9em;
  }

  .search-box {
    width: 100%;
    padding: 12px;
    margin: 20px 0;
    border: 2px solid #cbd5e0;
    border-radius: 4px;
    font-size: 1em;
  }

  .checkbox-group {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #cbd5e0;
    border-radius: 4px;
    padding: 10px;
  }

  .checkbox-item {
    padding: 8px;
    margin: 5px 0;
  }

  .checkbox-item label {
    margin-left: 8px;
    cursor: pointer;
  }
</style>

<!-- Login Screen (shown when not authenticated) -->
<div id="loginScreen" class="login-container" style="display: none;">
  <div class="login-header">
    <h2>🔐 Admin Login</h2>
    <p style="color: #718096; margin: 0;">Hours Tracker Access</p>
  </div>
  <form class="login-form" onsubmit="handleLogin(event)">
    <div class="form-group-login">
      <label for="username">Username</label>
      <input type="text" id="username" required autocomplete="username">
    </div>
    <div class="form-group-login">
      <label for="password">Password</label>
      <input type="password" id="password" required autocomplete="current-password">
    </div>
    <div id="loginError" class="error-message" style="display: none;"></div>
    <button type="submit" class="login-btn">Login</button>
  </form>
  <p style="text-align: center; margin-top: 20px; font-size: 0.85em; color: #718096;">
    <small>Contact your administrator for login credentials</small>
  </p>
</div>

<!-- Main Dashboard (shown when authenticated) -->
<div id="dashboardScreen" style="display: none;">
  <div class="admin-header">
    <div class="admin-info">
      Logged in as: <strong id="adminName"></strong>
    </div>
    <button class="logout-btn" onclick="handleLogout()">🚪 Logout</button>
  </div>

  <div class="hours-container">
    <h2>📊 Hours Tracking System</h2>

  <!-- Statistics Overview -->
  <div class="card">
    <h3>Overview</h3>
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-number" id="totalStudents">0</div>
        <div class="stat-label">Total Students</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="totalHours">0</div>
        <div class="stat-label">Total Hours</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="totalSessions">0</div>
        <div class="stat-label">Total Sessions</div>
      </div>
      <div class="stat-item">
        <div class="stat-number" id="totalEvents">0</div>
        <div class="stat-label">Special Events</div>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="card" style="text-align: center;">
    <button class="btn-primary" onclick="openAddStudentModal()">➕ Add Student</button>
    <button class="btn-primary" onclick="openAddEventModal()">🎉 Add Special Event</button>
    <button class="btn-secondary" onclick="viewEvents()">📋 View Events</button>
    <button class="btn-secondary" onclick="exportData()">💾 Export Data</button>
    <button class="btn-secondary" onclick="importData()">📥 Import Data</button>
  </div>

  <!-- Search -->
  <input type="text" class="search-box" id="searchBox" placeholder="🔍 Search students by name..." onkeyup="filterStudents()">

  <!-- Students Grid -->
  <div class="student-grid" id="studentGrid">
    <!-- Students will be dynamically loaded here -->
  </div>
</div>

<!-- Add Student Modal -->
<div id="addStudentModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeAddStudentModal()">&times;</span>
    <h2>Add New Student</h2>
    <form id="addStudentForm" onsubmit="addStudent(event)">
      <div class="form-group">
        <label for="studentName">Name *</label>
        <input type="text" id="studentName" required>
      </div>
      <div class="form-group">
        <label for="studentEmail">Email</label>
        <input type="email" id="studentEmail">
      </div>
      <button type="submit" class="btn-primary">Add Student</button>
      <button type="button" class="btn-secondary" onclick="closeAddStudentModal()">Cancel</button>
    </form>
  </div>
</div>

<!-- Add Event Modal -->
<div id="addEventModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeAddEventModal()">&times;</span>
    <h2>Add Special Event</h2>
    <form id="addEventForm" onsubmit="addEvent(event)">
      <div class="form-group">
        <label for="eventName">Event Name *</label>
        <input type="text" id="eventName" required>
      </div>
      <div class="form-group">
        <label for="eventDescription">Description</label>
        <textarea id="eventDescription"></textarea>
      </div>
      <div class="form-group">
        <label for="eventHours">Hours Awarded *</label>
        <input type="number" id="eventHours" step="0.5" min="0.5" required>
      </div>
      <div class="form-group">
        <label>Select Students *</label>
        <div class="checkbox-group" id="studentCheckboxList">
          <!-- Will be populated dynamically -->
        </div>
      </div>
      <button type="submit" class="btn-primary">Create Event</button>
      <button type="button" class="btn-secondary" onclick="closeAddEventModal()">Cancel</button>
    </form>
  </div>
</div>

<!-- View Events Modal -->
<div id="viewEventsModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeViewEventsModal()">&times;</span>
    <h2>Special Events History</h2>
    <div id="eventsList" class="event-list">
      <!-- Events will be displayed here -->
    </div>
  </div>
</div>

</div>
<!-- End Dashboard Screen -->

<script src="{{ '/assets/js/hours-tracker.js' | relative_url }}"></script>

<script>
// Handle login
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    if (login(username, password)) {
        errorDiv.style.display = 'none';
        showDashboard();
    } else {
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.display = 'block';
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        logout();
        showLogin();
    }
}

// Show dashboard
function showDashboard() {
    const session = getCurrentSession();
    if (session) {
        document.getElementById('adminName').textContent = session.name || session.username;
    }
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';

    // Initialize the hours tracker
    if (typeof init === 'function') {
        init();
    }
}

// Show login
function showLogin() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        showDashboard();
    } else {
        showLogin();
    }
});
</script>
