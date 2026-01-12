// Hours Tracker JavaScript
// localStorage keys
const STUDENTS_KEY = 'hoursTracker_students';
const EVENTS_KEY = 'hoursTracker_events';

// Session constant: 1 session = 0.5 hours
const HOURS_PER_SESSION = 0.5;

// Initialize data structures
let students = [];
let events = [];

// Load data from localStorage
function loadData() {
    const studentsData = localStorage.getItem(STUDENTS_KEY);
    const eventsData = localStorage.getItem(EVENTS_KEY);

    students = studentsData ? JSON.parse(studentsData) : [];
    events = eventsData ? JSON.parse(eventsData) : [];
}

// Save data to localStorage
function saveData() {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

// Initialize the page
function init() {
    loadData();
    renderStudents();
    updateStatistics();
}

// Render all students
function renderStudents() {
    const grid = document.getElementById('studentGrid');
    grid.innerHTML = '';

    const filteredStudents = getFilteredStudents();

    if (filteredStudents.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No students found. Add your first student to get started!</p>';
        return;
    }

    filteredStudents.forEach(student => {
        const card = createStudentCard(student);
        grid.appendChild(card);
    });
}

// Create a student card element
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
        <div class="student-name">${escapeHtml(student.name)}</div>
        ${student.email ? `<div style="font-size: 0.9em; opacity: 0.8;">${escapeHtml(student.email)}</div>` : ''}
        <div class="hours-display">${student.totalHours.toFixed(1)} hrs</div>
        <div class="sessions-display">${student.sessions} sessions</div>
        <div class="btn-group">
            <button class="btn-sm btn-add" onclick="addSession(${student.id})">+ Session</button>
            <button class="btn-sm btn-remove" onclick="removeSession(${student.id})" ${student.sessions === 0 ? 'disabled' : ''}>- Session</button>
        </div>
        <div class="btn-group">
            <button class="btn-sm" style="background: #ed8936; color: white; flex: 1;" onclick="editStudent(${student.id})">Edit</button>
            <button class="btn-sm" style="background: #e53e3e; color: white; flex: 1;" onclick="deleteStudent(${student.id})">Delete</button>
        </div>
    `;
    return card;
}

// Add a session to a student
function addSession(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        student.sessions += 1;
        student.totalHours = student.sessions * HOURS_PER_SESSION;
        saveData();
        renderStudents();
        updateStatistics();
    }
}

// Remove a session from a student
function removeSession(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student && student.sessions > 0) {
        student.sessions -= 1;
        student.totalHours = student.sessions * HOURS_PER_SESSION;
        saveData();
        renderStudents();
        updateStatistics();
    }
}

// Update statistics display
function updateStatistics() {
    const totalStudents = students.length;
    const totalSessions = students.reduce((sum, s) => sum + s.sessions, 0);
    const totalHours = students.reduce((sum, s) => sum + s.totalHours, 0);
    const totalEvents = events.length;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('totalEvents').textContent = totalEvents;
}

// Filter students based on search
function filterStudents() {
    renderStudents();
}

function getFilteredStudents() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    return students.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        (student.email && student.email.toLowerCase().includes(searchTerm))
    );
}

// Modal management
function openAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'block';
    document.getElementById('addStudentForm').reset();
}

function closeAddStudentModal() {
    document.getElementById('addStudentModal').style.display = 'none';
}

function openAddEventModal() {
    populateStudentCheckboxes();
    document.getElementById('addEventModal').style.display = 'block';
    document.getElementById('addEventForm').reset();
}

function closeAddEventModal() {
    document.getElementById('addEventModal').style.display = 'none';
}

function closeViewEventsModal() {
    document.getElementById('viewEventsModal').style.display = 'none';
}

// Add new student
function addStudent(event) {
    event.preventDefault();

    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();

    if (!name) {
        alert('Please enter a student name');
        return;
    }

    const newStudent = {
        id: Date.now(),
        name: name,
        email: email,
        sessions: 0,
        totalHours: 0
    };

    students.push(newStudent);
    saveData();
    renderStudents();
    updateStatistics();
    closeAddStudentModal();
}

// Edit student
function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newName = prompt('Enter new name:', student.name);
    if (newName && newName.trim()) {
        student.name = newName.trim();

        const newEmail = prompt('Enter new email (optional):', student.email || '');
        student.email = newEmail ? newEmail.trim() : '';

        saveData();
        renderStudents();
    }
}

// Delete student
function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (confirm(`Are you sure you want to delete ${student.name}? This will remove all their hours and cannot be undone.`)) {
        students = students.filter(s => s.id !== studentId);
        saveData();
        renderStudents();
        updateStatistics();
    }
}

// Populate student checkboxes for event creation
function populateStudentCheckboxes() {
    const container = document.getElementById('studentCheckboxList');
    container.innerHTML = '';

    if (students.length === 0) {
        container.innerHTML = '<p style="padding: 10px;">No students available. Add students first.</p>';
        return;
    }

    students.forEach(student => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="student_${student.id}" value="${student.id}">
            <label for="student_${student.id}">${escapeHtml(student.name)} (${student.totalHours.toFixed(1)} hrs)</label>
        `;
        container.appendChild(div);
    });
}

// Add special event
function addEvent(event) {
    event.preventDefault();

    const name = document.getElementById('eventName').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const hours = parseFloat(document.getElementById('eventHours').value);

    if (!name || !hours) {
        alert('Please fill in all required fields');
        return;
    }

    // Get selected students
    const selectedStudents = [];
    students.forEach(student => {
        const checkbox = document.getElementById(`student_${student.id}`);
        if (checkbox && checkbox.checked) {
            selectedStudents.push({
                id: student.id,
                name: student.name
            });
        }
    });

    if (selectedStudents.length === 0) {
        alert('Please select at least one student');
        return;
    }

    // Create event
    const newEvent = {
        id: Date.now(),
        name: name,
        description: description,
        hours: hours,
        students: selectedStudents,
        date: new Date().toISOString()
    };

    events.push(newEvent);

    // Award hours to selected students
    selectedStudents.forEach(selectedStudent => {
        const student = students.find(s => s.id === selectedStudent.id);
        if (student) {
            // Convert hours to sessions and add them
            const sessionsToAdd = Math.round(hours / HOURS_PER_SESSION);
            student.sessions += sessionsToAdd;
            student.totalHours = student.sessions * HOURS_PER_SESSION;
        }
    });

    saveData();
    renderStudents();
    updateStatistics();
    closeAddEventModal();

    alert(`Event "${name}" created successfully! ${hours} hours awarded to ${selectedStudents.length} student(s).`);
}

// View events
function viewEvents() {
    const container = document.getElementById('eventsList');
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No events recorded yet.</p>';
    } else {
        // Sort events by date (newest first)
        const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-item';

            const dateStr = new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            eventDiv.innerHTML = `
                <div class="event-header">
                    <div class="event-name">${escapeHtml(event.name)}</div>
                    <div class="event-hours">${event.hours} hrs</div>
                </div>
                ${event.description ? `<p style="margin: 10px 0;">${escapeHtml(event.description)}</p>` : ''}
                <div style="font-size: 0.9em; color: #718096; margin-top: 10px;">
                    <strong>Date:</strong> ${dateStr}<br>
                    <strong>Students (${event.students.length}):</strong> ${event.students.map(s => escapeHtml(s.name)).join(', ')}
                </div>
                <button class="btn-sm" style="background: #e53e3e; color: white; margin-top: 10px;" onclick="deleteEvent(${event.id})">Delete Event</button>
            `;
            container.appendChild(eventDiv);
        });
    }

    document.getElementById('viewEventsModal').style.display = 'block';
}

// Delete event
function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event? Note: This will NOT remove hours already awarded to students.')) {
        events = events.filter(e => e.id !== eventId);
        saveData();
        viewEvents();
        updateStatistics();
    }
}

// Export data
function exportData() {
    const data = {
        students: students,
        events: events,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `hours-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (!data.students || !Array.isArray(data.students)) {
                    throw new Error('Invalid data format');
                }

                if (confirm('Import data? This will replace all current data. Make sure you have exported your current data first!')) {
                    students = data.students || [];
                    events = data.events || [];
                    saveData();
                    renderStudents();
                    updateStatistics();
                    alert('Data imported successfully!');
                }
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
