---
layout: default
title: Student Hours View
permalink: /student-tracker/
---

<style>
  /* Meditative Minimal Theme - Student View */
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

  .student-view-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
  }

  .search-container {
    max-width: 500px;
    margin: 60px auto;
    padding: 40px;
    background: var(--bg-card);
    border-radius: 16px;
    box-shadow: 0 8px 24px var(--shadow-soft);
    border: 1px solid var(--accent-gentle);
  }

  .search-header {
    text-align: center;
    margin-bottom: 36px;
  }

  .search-header h2 {
    margin: 0 0 12px 0;
    color: var(--primary-deep);
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .search-header p {
    color: var(--text-secondary);
    font-weight: 300;
  }

  .search-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group-search {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group-search label {
    font-weight: 400;
    font-size: 0.9em;
    color: var(--text-secondary);
    letter-spacing: 0.3px;
  }

  .form-group-search input {
    padding: 14px 16px;
    border: 1px solid var(--accent-gentle);
    border-radius: 10px;
    font-size: 1em;
    background: var(--bg-serene);
    color: var(--text-primary);
    transition: all 0.2s ease;
  }

  .form-group-search input:focus {
    outline: none;
    border-color: var(--primary-calm);
    box-shadow: 0 0 0 3px rgba(168, 201, 197, 0.1);
    background: var(--bg-card);
  }

  .search-btn {
    background: var(--primary-calm);
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

  .search-btn:hover {
    background: var(--primary-deep);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-soft);
  }

  .search-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .error-message {
    background: var(--warning-soft);
    color: #8b5a3c;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    font-size: 0.9em;
    font-weight: 300;
  }

  .student-profile {
    background: var(--bg-card);
    border-radius: 16px;
    padding: 40px;
    margin: 24px 0;
    box-shadow: 0 4px 24px var(--shadow-soft);
    border: 1px solid var(--accent-gentle);
  }

  .profile-header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 2px solid var(--accent-gentle);
  }

  .profile-name {
    font-size: 2em;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .profile-email {
    color: var(--text-secondary);
    font-size: 1.1em;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    margin: 32px 0;
  }

  .stat-card {
    background: var(--bg-serene);
    padding: 28px;
    border-radius: 12px;
    text-align: center;
    transition: all 0.2s ease;
    border: 1px solid var(--accent-gentle);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px var(--shadow-soft);
  }

  .stat-icon {
    font-size: 2.5em;
    margin-bottom: 12px;
  }

  .stat-value {
    font-size: 2.8em;
    font-weight: 300;
    color: var(--primary-deep);
    margin: 12px 0;
    letter-spacing: -1px;
  }

  .stat-label {
    font-size: 0.9em;
    color: var(--text-secondary);
    font-weight: 400;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .events-section {
    margin-top: 40px;
  }

  .section-title {
    font-size: 1.5em;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--accent-gentle);
  }

  .event-item {
    background: var(--bg-serene);
    padding: 20px;
    margin: 16px 0;
    border-radius: 12px;
    border-left: 4px solid var(--primary-calm);
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
    font-size: 1.2em;
    color: var(--text-primary);
  }

  .event-hours {
    background: var(--primary-calm);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 400;
  }

  .event-description {
    color: var(--text-secondary);
    margin: 12px 0;
    line-height: 1.6;
  }

  .event-date {
    font-size: 0.85em;
    color: var(--text-light);
    font-style: italic;
  }

  .back-btn {
    background: var(--secondary-soft);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    font-size: 0.95em;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 24px;
  }

  .back-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-soft);
  }

  .no-events {
    text-align: center;
    padding: 40px;
    color: var(--text-secondary);
    font-style: italic;
  }

  .loading {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
  }
</style>

<!-- Search Screen -->
<div id="searchScreen" class="search-container">
  <div class="search-header">
    <h2>Student Hours Tracker</h2>
    <p>Enter your name and student key to view your hours</p>
  </div>
  <form class="search-form" onsubmit="searchStudent(event)">
    <div class="form-group-search">
      <label for="studentUsername">Your Name</label>
      <input type="text" id="studentUsername" required autocomplete="name" placeholder="e.g., John Doe">
    </div>
    <div class="form-group-search">
      <label for="studentKey">Student Key</label>
      <input type="text" id="studentKey" required autocomplete="off" placeholder="e.g., SKY-XXXX-XXXX" style="text-transform: uppercase;">
    </div>
    <div id="searchError" class="error-message" style="display: none;"></div>
    <button type="submit" class="search-btn" id="searchBtn">View My Hours</button>
  </form>
  <p style="text-align: center; margin-top: 20px; font-size: 0.85em; color: var(--text-secondary);">
    <small>Contact your administrator if you don't know your student key</small>
  </p>
</div>

<!-- Student Profile Screen -->
<div id="profileScreen" class="student-view-container" style="display: none;">
  <div class="student-profile">
    <div class="profile-header">
      <div class="profile-name" id="profileName"></div>
      <div class="profile-email" id="profileEmail"></div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">&#128337;</div>
        <div class="stat-value" id="profileHours">0</div>
        <div class="stat-label">Total Hours</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">&#128214;</div>
        <div class="stat-value" id="profileSessions">0</div>
        <div class="stat-label">Sessions</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">&#11088;</div>
        <div class="stat-value" id="profileEvents">0</div>
        <div class="stat-label">Events Attended</div>
      </div>
    </div>

    <div class="events-section" id="eventsSection">
      <div class="section-title">Event History</div>
      <div id="eventsList">
        <!-- Events will be populated here -->
      </div>
    </div>

    <button class="back-btn" onclick="backToSearch()">Back to Search</button>
  </div>
</div>

<script>
  // API Configuration
  const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://sky-backend-three.vercel.app/api';

  async function searchStudent(event) {
    event.preventDefault();

    const name = document.getElementById('studentUsername').value.trim();
    const studentKey = document.getElementById('studentKey').value.trim().toUpperCase();
    const errorDiv = document.getElementById('searchError');
    const searchBtn = document.getElementById('searchBtn');

    if (!name) {
      errorDiv.textContent = 'Please enter your name';
      errorDiv.style.display = 'block';
      return;
    }

    if (!studentKey) {
      errorDiv.textContent = 'Please enter your student key';
      errorDiv.style.display = 'block';
      return;
    }

    // Disable button during search
    searchBtn.disabled = true;
    searchBtn.textContent = 'Loading...';
    errorDiv.style.display = 'none';

    try {
      const response = await fetch(`${API_BASE_URL}/public/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          student_key: studentKey
        })
      });

      const data = await response.json();

      if (!response.ok) {
        errorDiv.textContent = data.error || 'Student not found. Please check your name and key.';
        errorDiv.style.display = 'block';
        return;
      }

      // Success - display student profile
      displayStudentProfile(data.student, data.events);

    } catch (error) {
      console.error('Search error:', error);
      errorDiv.textContent = 'Connection error. Please try again.';
      errorDiv.style.display = 'block';
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = 'View My Hours';
    }
  }

  function displayStudentProfile(student, events) {
    // Update profile information
    document.getElementById('profileName').textContent = student.name;
    document.getElementById('profileEmail').textContent = student.email || '';
    document.getElementById('profileHours').textContent = (student.total_hours || 0).toFixed(1);
    document.getElementById('profileSessions').textContent = student.sessions || 0;
    document.getElementById('profileEvents').textContent = events.length;

    // Display events
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';

    if (events.length === 0) {
      eventsList.innerHTML = '<div class="no-events">No events attended yet</div>';
    } else {
      // Sort events by date (newest first)
      const sortedEvents = [...events].sort((a, b) =>
        parseLocalDate(b.event_date) - parseLocalDate(a.event_date)
      );

      sortedEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';

        // Parse date in local timezone to avoid day shift
        const dateStr = parseLocalDate(event.event_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        eventDiv.innerHTML = `
          <div class="event-header">
            <div class="event-name">${escapeHtml(event.name)}</div>
            <div class="event-hours">${event.hours} hrs</div>
          </div>
          ${event.description ? `<div class="event-description">${escapeHtml(event.description)}</div>` : ''}
          <div class="event-date">${dateStr}</div>
        `;
        eventsList.appendChild(eventDiv);
      });
    }

    // Hide search screen, show profile screen
    document.getElementById('searchScreen').style.display = 'none';
    document.getElementById('profileScreen').style.display = 'block';
  }

  function backToSearch() {
    document.getElementById('searchScreen').style.display = 'block';
    document.getElementById('profileScreen').style.display = 'none';
    document.getElementById('studentUsername').value = '';
    document.getElementById('studentKey').value = '';
    document.getElementById('searchError').style.display = 'none';
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Parse date string (YYYY-MM-DD) as local timezone, not UTC
  function parseLocalDate(dateStr) {
    if (!dateStr) return new Date();
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
</script>
