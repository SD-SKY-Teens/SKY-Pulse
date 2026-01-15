// Hours Tracker JavaScript
// localStorage keys
const STUDENTS_KEY = 'hoursTracker_students';
const EVENTS_KEY = 'hoursTracker_events';

// Session constant: 1 session = 0.5 hours
const HOURS_PER_SESSION = 0.5;

// Initialize data structures
let students = [];
let events = [];

// Custom Popup System
function showCustomPopup(options) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('customPopupOverlay');
        const popup = document.getElementById('customPopup');
        const icon = document.getElementById('popupIcon');
        const title = document.getElementById('popupTitle');
        const message = document.getElementById('popupMessage');
        const inputContainer = document.getElementById('popupInputContainer');
        const buttonsContainer = document.getElementById('popupButtons');

        // Set icon
        icon.textContent = options.icon || '💭';

        // Set title
        title.textContent = options.title || '';

        // Set message
        message.textContent = options.message || '';

        // Clear previous input
        inputContainer.innerHTML = '';

        // Add input if needed
        if (options.input) {
            const input = document.createElement('input');
            input.type = options.inputType || 'text';
            input.className = 'custom-popup-input';
            input.placeholder = options.placeholder || '';
            input.value = options.defaultValue || '';
            input.id = 'customPopupInput';
            inputContainer.appendChild(input);

            // Focus input after a short delay
            setTimeout(() => input.focus(), 100);
        }

        // Clear previous buttons
        buttonsContainer.innerHTML = '';

        // Add buttons
        options.buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `custom-popup-btn ${button.primary ? 'custom-popup-btn-primary' : 'custom-popup-btn-secondary'}`;
            btn.textContent = button.text;
            btn.onclick = () => {
                overlay.style.display = 'none';
                if (options.input) {
                    const inputValue = document.getElementById('customPopupInput').value;
                    resolve(button.value === true ? inputValue : button.value);
                } else {
                    resolve(button.value);
                }
            };
            buttonsContainer.appendChild(btn);
        });

        // Show popup
        overlay.style.display = 'block';

        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                resolve(false);
            }
        };
    });
}

// Custom Alert
async function customAlert(message, title = 'Notice', icon = '✨') {
    await showCustomPopup({
        icon: icon,
        title: title,
        message: message,
        buttons: [
            { text: 'OK', value: true, primary: true }
        ]
    });
}

// Custom Confirm
async function customConfirm(message, title = 'Confirm', icon = '❓') {
    return await showCustomPopup({
        icon: icon,
        title: title,
        message: message,
        buttons: [
            { text: 'Cancel', value: false, primary: false },
            { text: 'Confirm', value: true, primary: true }
        ]
    });
}

// Custom Prompt
async function customPrompt(message, title = 'Input', defaultValue = '', placeholder = '', icon = '✏️') {
    return await showCustomPopup({
        icon: icon,
        title: title,
        message: message,
        input: true,
        inputType: 'text',
        defaultValue: defaultValue,
        placeholder: placeholder,
        buttons: [
            { text: 'Cancel', value: null, primary: false },
            { text: 'OK', value: true, primary: true }
        ]
    });
}

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
    const container = document.getElementById('studentGrid');
    const filteredStudents = getFilteredStudents();

    if (filteredStudents.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-secondary);">No students found. Add your first student to get started!</p>';
        return;
    }

    // Create table structure
    container.innerHTML = `
        <div class="students-table-container">
            <table class="students-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Total Hours</th>
                        <th>Sessions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="studentsTableBody">
                </tbody>
            </table>
        </div>
    `;

    const tbody = document.getElementById('studentsTableBody');
    filteredStudents.forEach(student => {
        const row = createStudentRow(student);
        tbody.appendChild(row);
    });
}

// Create a student table row element
function createStudentRow(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="student-name-cell">${escapeHtml(student.name)}</td>
        <td class="student-email-cell">${student.email ? escapeHtml(student.email) : '<em style="opacity: 0.5;">No email</em>'}</td>
        <td class="hours-cell">${student.totalHours.toFixed(1)} hrs</td>
        <td class="sessions-cell">${student.sessions} sessions</td>
        <td class="actions-cell">
            <div class="btn-group" style="justify-content: flex-end;">
                <button class="btn-sm btn-add" onclick="addSession(${student.id})" title="Add Session">+ Session</button>
                <button class="btn-sm btn-remove" onclick="removeSession(${student.id})" ${student.sessions === 0 ? 'disabled' : ''} title="Remove Session">- Session</button>
                <button class="btn-sm" style="background: #ed8936; color: white;" onclick="editStudent(${student.id})" title="Edit Student">Edit</button>
                <button class="btn-sm" style="background: #e53e3e; color: white;" onclick="deleteStudent(${student.id})" title="Delete Student">Delete</button>
            </div>
        </td>
    `;
    return row;
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

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').value = today;
}

function closeAddEventModal() {
    document.getElementById('addEventModal').style.display = 'none';
}

function closeViewEventsModal() {
    document.getElementById('viewEventsModal').style.display = 'none';
}

// Add new student
async function addStudent(event) {
    event.preventDefault();

    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();

    if (!name) {
        await customAlert('Please enter a student name', 'Missing Information', '⚠️');
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
async function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newName = await customPrompt('Enter new name:', 'Edit Student', student.name, 'Student name', '👤');
    if (newName && newName.trim()) {
        student.name = newName.trim();

        const newEmail = await customPrompt('Enter new email (optional):', 'Edit Email', student.email || '', 'Email address', '📧');
        student.email = newEmail ? newEmail.trim() : '';

        saveData();
        renderStudents();
    }
}

// Delete student
async function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const confirmed = await customConfirm(`Are you sure you want to delete ${student.name}? This will remove all their hours and cannot be undone.`, 'Delete Student', '🗑️');
    if (confirmed) {
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
async function addEvent(event) {
    event.preventDefault();

    const name = document.getElementById('eventName').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const hours = parseFloat(document.getElementById('eventHours').value);
    const eventDate = document.getElementById('eventDate').value;

    if (!name || !hours || !eventDate) {
        await customAlert('Please fill in all required fields', 'Missing Information', '⚠️');
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
        await customAlert('Please select at least one student', 'No Students Selected', '⚠️');
        return;
    }

    // Create event with the specified date and registration timestamp
    // Use the date string directly to avoid timezone conversion issues
    const newEvent = {
        id: Date.now(),
        name: name,
        description: description,
        hours: hours,
        students: selectedStudents,
        date: eventDate + 'T00:00:00.000Z', // Store as UTC midnight on the selected date
        registeredDate: new Date().toISOString()
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

    await customAlert(`Event "${name}" created successfully! ${hours} hours awarded to ${selectedStudents.length} student(s).`, 'Success', '🎉');
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

            const eventDateStr = new Date(event.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const registeredDateStr = event.registeredDate
                ? new Date(event.registeredDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : 'N/A';

            eventDiv.innerHTML = `
                <div class="event-header">
                    <div class="event-name">${escapeHtml(event.name)}</div>
                    <div class="event-hours">${event.hours} hrs</div>
                </div>
                ${event.description ? `<p style="margin: 10px 0;">${escapeHtml(event.description)}</p>` : ''}
                <div style="font-size: 0.9em; color: #718096; margin-top: 10px;">
                    <strong>Event Date:</strong> ${eventDateStr}<br>
                    <strong>Registered:</strong> ${registeredDateStr}<br>
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
async function deleteEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const confirmed = await customConfirm(`Are you sure you want to delete this event? This will revoke ${event.hours} hours from ${event.students.length} student(s).`, 'Delete Event', '🗑️');
    if (confirmed) {
        // Revoke hours from students who received them from this event
        event.students.forEach(eventStudent => {
            const student = students.find(s => s.id === eventStudent.id);
            if (student) {
                // Convert hours to sessions and remove them
                const sessionsToRemove = Math.round(event.hours / HOURS_PER_SESSION);
                student.sessions = Math.max(0, student.sessions - sessionsToRemove);
                student.totalHours = student.sessions * HOURS_PER_SESSION;
            }
        });

        // Remove the event
        events = events.filter(e => e.id !== eventId);
        saveData();
        renderStudents();
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
async function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (!data.students || !Array.isArray(data.students)) {
                    throw new Error('Invalid data format');
                }

                // Calculate merge statistics
                const importedStudents = data.students || [];
                const importedEvents = data.events || [];

                let newStudents = 0;
                let updatedStudents = 0;
                let newEvents = 0;
                let updatedEvents = 0;

                // Check for duplicates
                importedStudents.forEach(importStudent => {
                    const exists = students.find(s => s.id === importStudent.id);
                    if (exists) {
                        updatedStudents++;
                    } else {
                        newStudents++;
                    }
                });

                importedEvents.forEach(importEvent => {
                    const exists = events.find(e => e.id === importEvent.id);
                    if (exists) {
                        updatedEvents++;
                    } else {
                        newEvents++;
                    }
                });

                // Create confirmation message
                let message = `Import ${importedStudents.length} students and ${importedEvents.length} events?\n\n`;
                if (newStudents > 0) message += `• ${newStudents} new student(s)\n`;
                if (updatedStudents > 0) message += `• ${updatedStudents} student(s) will be updated\n`;
                if (newEvents > 0) message += `• ${newEvents} new event(s)\n`;
                if (updatedEvents > 0) message += `• ${updatedEvents} event(s) will be updated\n`;
                message += `\nExisting duplicates will be replaced with imported versions.`;

                const confirmed = await customConfirm(message, 'Import Data', '📥');
                if (confirmed) {
                    // Merge students - replace duplicates, add new ones
                    const studentMap = new Map();

                    // Add existing students first
                    students.forEach(student => {
                        studentMap.set(student.id, student);
                    });

                    // Import students (will replace duplicates)
                    importedStudents.forEach(student => {
                        studentMap.set(student.id, student);
                    });

                    students = Array.from(studentMap.values());

                    // Merge events - replace duplicates, add new ones
                    const eventMap = new Map();

                    // Add existing events first
                    events.forEach(event => {
                        eventMap.set(event.id, event);
                    });

                    // Import events (will replace duplicates)
                    importedEvents.forEach(event => {
                        eventMap.set(event.id, event);
                    });

                    events = Array.from(eventMap.values());

                    saveData();
                    renderStudents();
                    updateStatistics();

                    let resultMessage = 'Data imported successfully!\n\n';
                    if (newStudents > 0) resultMessage += `✓ Added ${newStudents} new student(s)\n`;
                    if (updatedStudents > 0) resultMessage += `✓ Updated ${updatedStudents} student(s)\n`;
                    if (newEvents > 0) resultMessage += `✓ Added ${newEvents} new event(s)\n`;
                    if (updatedEvents > 0) resultMessage += `✓ Updated ${updatedEvents} event(s)`;

                    await customAlert(resultMessage, 'Import Complete', '✅');
                }
            } catch (error) {
                await customAlert('Error importing data: ' + error.message, 'Import Error', '❌');
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
