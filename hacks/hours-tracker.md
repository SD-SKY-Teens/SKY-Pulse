---
layout: default
title: Hours Tracker
permalink: /hours-tracker/
---

<script src="{{ '/assets/js/auth.js' | relative_url }}"></script>

<style>
  /* Login Screen - Meditative Minimal Theme */
  .login-container {
    max-width: 420px;
    margin: 60px auto;
    padding: 40px;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border: 1px solid #c9d4d2;
  }

  .dark-mode .login-container {
    background: rgba(42, 48, 47, 0.98);
    color: #d8e1df;
  }

  .login-header {
    text-align: center;
    margin-bottom: 36px;
  }

  .login-header h2 {
    margin: 0 0 12px 0;
    color: #7ba59f;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .login-header p {
    color: #7a8c89;
    font-weight: 300;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group-login {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group-login label {
    font-weight: 400;
    font-size: 0.9em;
    color: #7a8c89;
    letter-spacing: 0.3px;
  }

  .form-group-login input {
    padding: 14px 16px;
    border: 1px solid #c9d4d2;
    border-radius: 10px;
    font-size: 1em;
    background: #f5f7f6;
    color: #4a5d5a;
    transition: all 0.2s ease;
  }

  .form-group-login input:focus {
    outline: none;
    border-color: #a8c9c5;
    box-shadow: 0 0 0 3px rgba(168, 201, 197, 0.1);
    background: white;
  }

  .dark-mode .form-group-login input {
    background: #1a1f1e;
    color: #d8e1df;
  }

  .login-btn {
    background: #a8c9c5;
    color: white;
    padding: 14px;
    border: none;
    border-radius: 10px;
    font-size: 1em;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.3px;
  }

  .login-btn:hover {
    background: #7ba59f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .error-message {
    background: #e8c9a9;
    color: #8b5a3c;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    font-size: 0.9em;
    font-weight: 300;
  }

  .dark-mode .error-message {
    background: #5a3d28;
    color: #e8c9a9;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.98);
    padding: 20px 24px;
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    border: 1px solid #c9d4d2;
  }

  .dark-mode .admin-header {
    background: rgba(42, 48, 47, 0.98);
  }

  .admin-info {
    font-size: 0.95em;
    color: #7a8c89;
    font-weight: 300;
  }

  .admin-info strong {
    color: #7ba59f;
    font-weight: 500;
  }

  .logout-btn {
    background: #e8c9a9;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s ease;
    font-weight: 400;
  }

  .logout-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>

<style>
  /* Meditative Minimal Theme - Calming & Peaceful */
  :root {
    --primary-calm: #a8c9c5;
    --primary-deep: #7ba59f;
    --secondary-soft: #d4b8a8;
    --bg-serene: #f5f7f6;
    --bg-card: #ffffff;
    --text-primary: #4a5d5a;
    --text-secondary: #7a8c89;
    --text-light: #a5b5b2;
    --accent-gentle: #c9d4d2;
    --success-soft: #9cc4a9;
    --warning-soft: #e8c9a9;
    --shadow-subtle: rgba(0, 0, 0, 0.04);
    --shadow-soft: rgba(0, 0, 0, 0.08);
  }

  .dark-mode {
    --primary-calm: #7ba59f;
    --primary-deep: #5d8983;
    --secondary-soft: #b39985;
    --bg-serene: #1a1f1e;
    --bg-card: #2a302f;
    --text-primary: #d8e1df;
    --text-secondary: #a8b5b2;
    --text-light: #7a8c89;
    --accent-gentle: #3a4544;
    --success-soft: #7ba58d;
    --warning-soft: #c9a989;
    --shadow-subtle: rgba(0, 0, 0, 0.2);
    --shadow-soft: rgba(0, 0, 0, 0.3);
  }

  .hours-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .card {
    background: var(--bg-card);
    border-radius: 16px;
    padding: 32px;
    margin: 24px 0;
    box-shadow: 0 2px 16px var(--shadow-subtle);
    border: 1px solid var(--accent-gentle);
    transition: all 0.3s ease;
  }

  .card:hover {
    box-shadow: 0 4px 24px var(--shadow-soft);
  }

  .student-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 32px;
  }

  .student-card {
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 28px;
    border-radius: 16px;
    box-shadow: 0 2px 12px var(--shadow-subtle);
    border: 2px solid var(--accent-gentle);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .student-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-calm), var(--primary-deep));
    opacity: 0.7;
  }

  .student-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px var(--shadow-soft);
    border-color: var(--primary-calm);
  }

  .student-name {
    font-size: 1.3em;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--text-primary);
    letter-spacing: 0.3px;
  }

  .hours-display {
    font-size: 2.5em;
    font-weight: 300;
    margin: 20px 0;
    color: var(--primary-deep);
    letter-spacing: -0.5px;
  }

  .sessions-display {
    font-size: 1em;
    opacity: 0.7;
    margin-bottom: 20px;
    color: var(--text-secondary);
    font-weight: 300;
  }

  .btn-group {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }

  .btn-sm {
    padding: 10px 18px;
    border: 1px solid var(--accent-gentle);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s ease;
    font-weight: 400;
    background: var(--bg-card);
    color: var(--text-primary);
  }

  .btn-sm:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-soft);
  }

  .btn-sm:active {
    transform: translateY(0);
  }

  .btn-add {
    background: var(--success-soft);
    color: white;
    border-color: var(--success-soft);
  }

  .btn-remove {
    background: var(--warning-soft);
    color: white;
    border-color: var(--warning-soft);
  }

  .btn-primary {
    background: var(--primary-calm);
    color: white;
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.95em;
    margin: 10px 8px;
    transition: all 0.2s ease;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  .btn-primary:hover {
    background: var(--primary-deep);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px var(--shadow-soft);
  }

  .btn-secondary {
    background: var(--secondary-soft);
    color: white;
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 0.95em;
    margin: 10px 8px;
    transition: all 0.2s ease;
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  .btn-secondary:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px var(--shadow-soft);
  }

  .form-group {
    margin: 20px 0;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 400;
    color: var(--text-secondary);
    font-size: 0.9em;
    letter-spacing: 0.3px;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--accent-gentle);
    border-radius: 8px;
    font-size: 1em;
    background: var(--bg-card);
    color: var(--text-primary);
    transition: all 0.2s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--primary-calm);
    box-shadow: 0 0 0 3px rgba(168, 201, 197, 0.1);
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
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-content {
    background-color: var(--bg-card);
    margin: 5% auto;
    padding: 36px;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px var(--shadow-soft);
    border: 1px solid var(--accent-gentle);
    animation: slideUp 0.3s ease;
  }

  .close {
    color: var(--text-light);
    float: right;
    font-size: 28px;
    font-weight: 300;
    cursor: pointer;
    transition: all 0.2s ease;
    line-height: 1;
  }

  .close:hover {
    color: var(--text-primary);
    transform: rotate(90deg);
  }

  .stats-bar {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 32px 0;
    gap: 16px;
  }

  .stat-item {
    text-align: center;
    padding: 20px;
    background: var(--bg-serene);
    border-radius: 12px;
    min-width: 140px;
    transition: all 0.2s ease;
  }

  .stat-item:hover {
    transform: translateY(-2px);
    background: var(--accent-gentle);
  }

  .stat-number {
    font-size: 2.5em;
    font-weight: 300;
    color: var(--primary-deep);
    letter-spacing: -1px;
  }

  .stat-label {
    font-size: 0.85em;
    color: var(--text-secondary);
    margin-top: 8px;
    font-weight: 400;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .event-list {
    margin-top: 24px;
  }

  .event-item {
    background: var(--bg-serene);
    padding: 20px;
    margin: 16px 0;
    border-radius: 12px;
    border-left: 3px solid var(--primary-calm);
    transition: all 0.2s ease;
  }

  .event-item:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 16px var(--shadow-soft);
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .event-name {
    font-weight: 500;
    font-size: 1.1em;
    color: var(--text-primary);
  }

  .event-hours {
    background: var(--primary-calm);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: 400;
  }

  .search-box {
    width: 100%;
    padding: 14px 20px;
    margin: 24px 0;
    border: 1px solid var(--accent-gentle);
    border-radius: 12px;
    font-size: 1em;
    background: var(--bg-card);
    color: var(--text-primary);
    transition: all 0.2s ease;
  }

  .search-box:focus {
    outline: none;
    border-color: var(--primary-calm);
    box-shadow: 0 0 0 3px rgba(168, 201, 197, 0.1);
  }

  .checkbox-group {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid var(--accent-gentle);
    border-radius: 8px;
    padding: 12px;
    background: var(--bg-serene);
  }

  .checkbox-item {
    padding: 10px;
    margin: 6px 0;
    border-radius: 6px;
    transition: background 0.2s ease;
  }

  .checkbox-item:hover {
    background: var(--accent-gentle);
  }

  .checkbox-item label {
    margin-left: 10px;
    cursor: pointer;
    color: var(--text-primary);
  }

  /* Custom Popup Styles */
  .custom-popup-overlay {
    display: none;
    position: fixed;
    z-index: 2000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
  }

  .custom-popup {
    background: var(--bg-card);
    margin: 15% auto;
    padding: 32px;
    border-radius: 16px;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 8px 32px var(--shadow-soft);
    border: 1px solid var(--accent-gentle);
    animation: slideUp 0.3s ease;
    text-align: center;
  }

  .custom-popup-icon {
    font-size: 3em;
    margin-bottom: 16px;
    opacity: 0.9;
  }

  .custom-popup-title {
    font-size: 1.4em;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 12px;
    letter-spacing: 0.3px;
  }

  .custom-popup-message {
    font-size: 1em;
    color: var(--text-secondary);
    margin-bottom: 24px;
    line-height: 1.6;
    font-weight: 300;
  }

  .custom-popup-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .custom-popup-btn {
    padding: 12px 32px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.95em;
    font-weight: 400;
    transition: all 0.2s ease;
    min-width: 100px;
  }

  .custom-popup-btn-primary {
    background: var(--primary-calm);
    color: white;
  }

  .custom-popup-btn-primary:hover {
    background: var(--primary-deep);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-soft);
  }

  .custom-popup-btn-secondary {
    background: var(--secondary-soft);
    color: white;
  }

  .custom-popup-btn-secondary:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .custom-popup-input {
    width: 100%;
    padding: 12px 16px;
    margin: 16px 0;
    border: 1px solid var(--accent-gentle);
    border-radius: 8px;
    font-size: 1em;
    background: var(--bg-serene);
    color: var(--text-primary);
  }

  .custom-popup-input:focus {
    outline: none;
    border-color: var(--primary-calm);
    box-shadow: 0 0 0 3px rgba(168, 201, 197, 0.1);
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

<!-- Custom Popup Container -->
<div id="customPopupOverlay" class="custom-popup-overlay">
  <div class="custom-popup" id="customPopup">
    <div class="custom-popup-icon" id="popupIcon"></div>
    <div class="custom-popup-title" id="popupTitle"></div>
    <div class="custom-popup-message" id="popupMessage"></div>
    <div id="popupInputContainer"></div>
    <div class="custom-popup-buttons" id="popupButtons"></div>
  </div>
</div>

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
async function handleLogout() {
    const confirmed = await customConfirm('Are you sure you want to logout?', 'Logout', '🚪');
    if (confirmed) {
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
