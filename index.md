---
layout: default
title: Welcome to SKY-Pulse
permalink: /sky-pulse/
---

<style>
  /* Meditative Quick Access Buttons */
  .quick-access-buttons {
    display: flex;
    gap: 16px;
    margin: 32px 0;
    flex-wrap: wrap;
  }

  .btn-calm-primary {
    background: linear-gradient(135deg, #5b9bd5 0%, #6bb56f 100%);
    color: white;
    padding: 16px 32px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1em;
    box-shadow: 0 4px 16px rgba(91, 155, 213, 0.3);
    transition: all 0.3s ease;
    display: inline-block;
    letter-spacing: 0.3px;
    border: none;
  }

  .btn-calm-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 24px rgba(107, 181, 111, 0.4);
    background: linear-gradient(135deg, #6bb56f 0%, #5b9bd5 100%);
  }

  .btn-calm-secondary {
    background: linear-gradient(135deg, #9b7bb5 0%, #6b5ba6 100%);
    color: white;
    padding: 16px 32px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1em;
    box-shadow: 0 4px 16px rgba(155, 123, 181, 0.3);
    transition: all 0.3s ease;
    display: inline-block;
    letter-spacing: 0.3px;
    border: none;
  }

  .btn-calm-secondary:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 24px rgba(107, 91, 166, 0.4);
    background: linear-gradient(135deg, #6b5ba6 0%, #9b7bb5 100%);
  }

  .dark-mode .btn-calm-primary,
  .dark-mode .btn-calm-secondary {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .dark-mode .btn-calm-primary:hover,
  .dark-mode .btn-calm-secondary:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  }
</style>

## Welcome to SKY-Pulse Hours Tracker

Track member attendance and hours with our simple session-based logging system.

### Quick Access

<div class="quick-access-buttons">
  <a href="/SKY-Pulse/hours-tracker/" class="btn-calm-primary">📊 Admin Hours Tracker</a>
  <a href="/SKY-Pulse/student-tracker/" class="btn-calm-primary">🎓 Student Hours View</a>
  <a href="/SKY-Pulse/about/" class="btn-calm-secondary">ℹ️ View About</a>
</div>

### How It Works

**Session-Based Tracking**
- 1 session = 0.5 hours
- 2 sessions = 1 hour
- Simple addition and removal of sessions
- Automatic hour calculation

**Features**
- Add and manage students/members
- Track sessions and hours for each person
- Create special events and award bonus hours
- Export and import data for backup
- Real-time statistics dashboard
- Search and filter students

**Special Events**
- Create named events with descriptions
- Award custom hours to selected students
- Keep a history of all events
- Perfect for competitions, workshops, or special activities

### For Administrators

Anyone with admin credentials can access the hours tracker to:
- Add new students
- Log attendance sessions
- Create special events
- View comprehensive statistics
- Export data for records

### For Students

Students can view their personal hours information:
- Check total volunteer hours
- View session count
- See events attended
- Review event history with dates and descriptions
- Simply enter your name to access your data
