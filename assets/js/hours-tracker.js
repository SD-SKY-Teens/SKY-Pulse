// Hours Tracker JavaScript - API Version
// Connects to Flask backend for global data access
// Note: API_BASE_URL and TOKEN_KEY are defined in auth.js which must be loaded first

// Session constant: 1 session = 0.5 hours
const HOURS_PER_SESSION = 0.5;

// In-memory data cache
let students = [];
let events = [];

// Get stored auth token
function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Set auth token
function setAuthToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

// Clear auth token
function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// API request helper with authentication
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                clearAuthToken();
                showLogin();
            }
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

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
        icon.textContent = options.icon || '';

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
async function customAlert(message, title = 'Notice', icon = '') {
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
async function customConfirm(message, title = 'Confirm', icon = '') {
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
async function customPrompt(message, title = 'Input', defaultValue = '', placeholder = '', icon = '') {
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

// Parse date string (YYYY-MM-DD) as local timezone, not UTC
function parseLocalDate(dateStr) {
    if (!dateStr) return new Date();
    if (dateStr.includes('T')) {
        dateStr = dateStr.split('T')[0];
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// Format date for display in local timezone
function formatEventDate(dateStr) {
    const date = parseLocalDate(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Load data from API
async function loadData() {
    try {
        const [studentsData, eventsData] = await Promise.all([
            apiRequest('/students'),
            apiRequest('/events')
        ]);
        students = studentsData;
        events = eventsData;
    } catch (error) {
        console.error('Failed to load data:', error);
        await customAlert('Failed to load data from server. Please try again.', 'Error', '!');
    }
}

// Initialize the page
async function init() {
    await loadData();
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

    // Create table structure with bulk actions bar
    container.innerHTML = `
        <div class="bulk-actions-bar" id="bulkActionsBar" style="display: none;">
            <span id="selectedCount">0 selected</span>
            <button class="btn-sm" style="background: #e53e3e; color: white;" onclick="bulkDeleteStudents()">Delete Selected</button>
            <button class="btn-sm" onclick="clearSelection()">Clear Selection</button>
        </div>
        <div class="students-table-container">
            <table class="students-table">
                <thead>
                    <tr>
                        <th style="width: 40px;"><input type="checkbox" id="selectAllCheckbox" onchange="toggleSelectAll(this.checked)" title="Select All"></th>
                        <th>Name</th>
                        <th>Student Key</th>
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
        <td class="checkbox-cell"><input type="checkbox" class="student-checkbox" data-student-id="${student.id}" onchange="updateBulkSelection()"></td>
        <td class="student-name-cell">${escapeHtml(student.name)}</td>
        <td class="student-key-cell"><code style="background: var(--bg-serene); padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">${escapeHtml(student.student_key)}</code></td>
        <td class="student-email-cell">${student.email ? escapeHtml(student.email) : '<em style="opacity: 0.5;">No email</em>'}</td>
        <td class="hours-cell">${(student.total_hours || 0).toFixed(1)} hrs</td>
        <td class="sessions-cell">${student.sessions || 0} sessions</td>
        <td class="actions-cell">
            <div class="btn-group" style="justify-content: flex-end;">
                <button class="btn-sm btn-add" onclick="addSession(${student.id})" title="Add Session">+ Session</button>
                <button class="btn-sm btn-remove" onclick="removeSession(${student.id})" ${(student.sessions || 0) === 0 ? 'disabled' : ''} title="Remove Session">- Session</button>
                <button class="btn-sm" style="background: #ed8936; color: white;" onclick="editStudent(${student.id})" title="Edit Student">Edit</button>
                <button class="btn-sm" style="background: #e53e3e; color: white;" onclick="deleteStudent(${student.id})" title="Delete Student">Delete</button>
            </div>
        </td>
    `;
    return row;
}

// Add a session to a student
async function addSession(studentId) {
    try {
        await apiRequest(`/students/${studentId}/sessions`, {
            method: 'POST',
            body: JSON.stringify({ action: 'add' })
        });
        await loadData();
        renderStudents();
        updateStatistics();
    } catch (error) {
        await customAlert('Failed to add session: ' + error.message, 'Error', '!');
    }
}

// Remove a session from a student
async function removeSession(studentId) {
    try {
        await apiRequest(`/students/${studentId}/sessions`, {
            method: 'POST',
            body: JSON.stringify({ action: 'remove' })
        });
        await loadData();
        renderStudents();
        updateStatistics();
    } catch (error) {
        await customAlert('Failed to remove session: ' + error.message, 'Error', '!');
    }
}

// Update statistics display
function updateStatistics() {
    const totalStudents = students.length;
    const totalSessions = students.reduce((sum, s) => sum + (s.sessions || 0), 0);
    const totalHours = students.reduce((sum, s) => sum + (s.total_hours || 0), 0);
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
        await customAlert('Please enter a student name', 'Missing Information', '!');
        return;
    }

    try {
        await apiRequest('/students', {
            method: 'POST',
            body: JSON.stringify({ name, email })
        });

        await loadData();
        renderStudents();
        updateStatistics();
        closeAddStudentModal();
    } catch (error) {
        await customAlert('Failed to add student: ' + error.message, 'Error', '!');
    }
}

// Edit student
async function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newName = await customPrompt('Enter new name:', 'Edit Student', student.name, 'Student name', '');
    if (newName && newName.trim()) {
        const newEmail = await customPrompt('Enter new email (optional):', 'Edit Email', student.email || '', 'Email address', '');

        try {
            await apiRequest(`/students/${studentId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: newName.trim(),
                    email: newEmail ? newEmail.trim() : ''
                })
            });

            await loadData();
            renderStudents();
        } catch (error) {
            await customAlert('Failed to update student: ' + error.message, 'Error', '!');
        }
    }
}

// Delete student
async function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const confirmed = await customConfirm(`Are you sure you want to delete ${student.name}? This will remove all their hours and cannot be undone.`, 'Delete Student', '');
    if (confirmed) {
        try {
            await apiRequest(`/students/${studentId}`, { method: 'DELETE' });
            await loadData();
            renderStudents();
            updateStatistics();
        } catch (error) {
            await customAlert('Failed to delete student: ' + error.message, 'Error', '!');
        }
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
            <label for="student_${student.id}">${escapeHtml(student.name)} (${(student.total_hours || 0).toFixed(1)} hrs)</label>
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
        await customAlert('Please fill in all required fields', 'Missing Information', '!');
        return;
    }

    // Get selected students
    const studentIds = [];
    students.forEach(student => {
        const checkbox = document.getElementById(`student_${student.id}`);
        if (checkbox && checkbox.checked) {
            studentIds.push(student.id);
        }
    });

    if (studentIds.length === 0) {
        await customAlert('Please select at least one student', 'No Students Selected', '!');
        return;
    }

    try {
        await apiRequest('/events', {
            method: 'POST',
            body: JSON.stringify({
                name,
                description,
                hours,
                event_date: eventDate,
                student_ids: studentIds
            })
        });

        await loadData();
        renderStudents();
        updateStatistics();
        closeAddEventModal();

        await customAlert(`Event "${name}" created successfully! ${hours} hours awarded to ${studentIds.length} student(s).`, 'Success', '');
    } catch (error) {
        await customAlert('Failed to create event: ' + error.message, 'Error', '!');
    }
}

// View events
function viewEvents() {
    const container = document.getElementById('eventsList');
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No events recorded yet.</p>';
    } else {
        // Sort events by date (newest first)
        const sortedEvents = [...events].sort((a, b) => parseLocalDate(b.event_date) - parseLocalDate(a.event_date));

        sortedEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-item';

            const eventDateStr = formatEventDate(event.event_date);

            const registeredDateStr = event.registered_date
                ? new Date(event.registered_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : 'N/A';

            const studentNames = event.students ? event.students.map(s => escapeHtml(s.name)).join(', ') : 'None';

            eventDiv.innerHTML = `
                <div class="event-header">
                    <div class="event-name">${escapeHtml(event.name)}</div>
                    <div class="event-hours">${event.hours} hrs</div>
                </div>
                ${event.description ? `<p style="margin: 10px 0;">${escapeHtml(event.description)}</p>` : ''}
                <div style="font-size: 0.9em; color: #718096; margin-top: 10px;">
                    <strong>Event Date:</strong> ${eventDateStr}<br>
                    <strong>Registered:</strong> ${registeredDateStr}<br>
                    <strong>Students (${event.students ? event.students.length : 0}):</strong> ${studentNames}
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

    const studentCount = event.students ? event.students.length : 0;
    const confirmed = await customConfirm(`Are you sure you want to delete this event? This will revoke ${event.hours} hours from ${studentCount} student(s).`, 'Delete Event', '');

    if (confirmed) {
        try {
            await apiRequest(`/events/${eventId}`, { method: 'DELETE' });
            await loadData();
            renderStudents();
            viewEvents();
            updateStatistics();
        } catch (error) {
            await customAlert('Failed to delete event: ' + error.message, 'Error', '!');
        }
    }
}

// Export data
async function exportData() {
    try {
        const data = await apiRequest('/export');

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `hours-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
    } catch (error) {
        await customAlert('Failed to export data: ' + error.message, 'Error', '!');
    }
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

                const confirmed = await customConfirm(
                    `Import ${data.students.length} students and ${data.events ? data.events.length : 0} events? Existing data with matching keys will be updated.`,
                    'Import Data',
                    ''
                );

                if (confirmed) {
                    const result = await apiRequest('/import', {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });

                    await loadData();
                    renderStudents();
                    updateStatistics();

                    await customAlert(result.message, 'Import Complete', '');
                }
            } catch (error) {
                await customAlert('Error importing data: ' + error.message, 'Import Error', '!');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// Bulk selection functions
function getSelectedStudentIds() {
    const checkboxes = document.querySelectorAll('.student-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.dataset.studentId));
}

function updateBulkSelection() {
    const selectedIds = getSelectedStudentIds();
    const bulkBar = document.getElementById('bulkActionsBar');
    const selectedCount = document.getElementById('selectedCount');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const allCheckboxes = document.querySelectorAll('.student-checkbox');

    if (selectedIds.length > 0) {
        bulkBar.style.display = 'flex';
        selectedCount.textContent = `${selectedIds.length} selected`;
    } else {
        bulkBar.style.display = 'none';
    }

    // Update select all checkbox state
    if (allCheckboxes.length > 0) {
        selectAllCheckbox.checked = selectedIds.length === allCheckboxes.length;
        selectAllCheckbox.indeterminate = selectedIds.length > 0 && selectedIds.length < allCheckboxes.length;
    }
}

function toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(cb => cb.checked = checked);
    updateBulkSelection();
}

function clearSelection() {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
    updateBulkSelection();
}

async function bulkDeleteStudents() {
    const selectedIds = getSelectedStudentIds();
    if (selectedIds.length === 0) return;

    const confirmed = await customConfirm(
        `Are you sure you want to delete ${selectedIds.length} student(s)? This will remove all their hours and cannot be undone.`,
        'Bulk Delete',
        ''
    );

    if (confirmed) {
        try {
            await apiRequest('/students/bulk-delete', {
                method: 'POST',
                body: JSON.stringify({ ids: selectedIds })
            });

            await loadData();
            renderStudents();
            updateStatistics();
            await customAlert(`${selectedIds.length} student(s) deleted successfully.`, 'Deleted', '');
        } catch (error) {
            await customAlert('Failed to delete students: ' + error.message, 'Error', '!');
        }
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
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

// Initialize on page load - handled by hours-tracker.md
