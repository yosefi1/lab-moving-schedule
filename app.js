// Password Protection
(function() {
    if (!APP_CONFIG || !APP_CONFIG.requirePassword) {
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        return;
    }

    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    const passwordModal = document.getElementById('passwordModal');

    // Check if already authenticated (stored in session)
    const isAuthenticated = sessionStorage.getItem('labMovingAuth') === 'true';
    if (isAuthenticated) {
        passwordModal.style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        return;
    }

    passwordForm.onsubmit = (e) => {
        e.preventDefault();
        const enteredPassword = passwordInput.value;
        
        // Debug: check if config is loaded
        if (!APP_CONFIG) {
            console.error('APP_CONFIG not loaded!');
            alert('Configuration not loaded. Please refresh the page.');
            return;
        }
        
        if (enteredPassword === APP_CONFIG.password) {
            sessionStorage.setItem('labMovingAuth', 'true');
            passwordModal.style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
        } else {
            passwordError.style.display = 'block';
            passwordError.textContent = `Incorrect password. Please try again. (Expected: ${APP_CONFIG.password || 'not set'})`;
            passwordInput.value = '';
            passwordInput.focus();
        }
    };
})();

// Initialize weeks - can be changed in settings
let startWeek = 14;
let endWeek = 28;
let weeks = [];

function updateWeeks() {
    weeks = [];
    for (let i = startWeek; i <= endWeek; i++) {
        weeks.push(i === 14 ? 'ww14 (LAB is ready)' : i);
    }
    renderWeekHeaders();
    renderTasks();
}

// Initialize weeks on load
updateWeeks();

// Helper function to convert old format (startWeek + duration) to new format (selectedWeeks)
function convertTaskToNewFormat(task) {
    if (task.selectedWeeks) {
        return task; // Already in new format
    }
    // Convert old format to new
    const selectedWeeks = [];
    for (let i = task.startWeek; i < task.startWeek + (task.duration || 1); i++) {
        selectedWeeks.push(i);
    }
    return {
        ...task,
        selectedWeeks: selectedWeeks,
        startWeek: task.startWeek, // Keep for backward compatibility
        duration: task.duration
    };
}

// Sample tasks based on your Excel
let tasks = [
    {
        id: 1,
        name: 'LAB inspection (all IT ports, Electricity, Thermal tools, CDA, PCW)',
        dependencies: 'Dedicated inspection tools (IT, CDA, PCW)',
        finishBefore: null,
        selectedWeeks: [14],
        color: '#4A90E2'
    },
    {
        id: 2,
        name: 'Storage transfer (Compactus + lab shelfs)',
        dependencies: '',
        finishBefore: 3,
        selectedWeeks: [15, 16],
        color: '#50C878'
    },
    {
        id: 3,
        name: 'SIPD Picoprobing transfer and calibration',
        dependencies: 'Need Rigotek',
        finishBefore: 4,
        selectedWeeks: [15],
        color: '#FF6B6B'
    },
    {
        id: 4,
        name: 'MATRIX + MiniMax + Soldering equipment movement and installation',
        dependencies: '',
        finishBefore: null,
        selectedWeeks: [17],
        color: '#FFD93D'
    },
    {
        id: 5,
        name: 'Racks 1-5 equipment movement and bring up',
        dependencies: 'One rack per 2 working days',
        finishBefore: 6,
        selectedWeeks: [18, 19],
        color: '#9B59B6'
    },
    {
        id: 6,
        name: 'Racks 6-10 equipment movement and bring up',
        dependencies: 'One rack per 2 working days',
        finishBefore: null,
        selectedWeeks: [21, 22],
        color: '#1ABC9C'
    },
    {
        id: 7,
        name: 'Racks 11-15 equipment movement and bring up',
        dependencies: 'One rack per 2 working days',
        finishBefore: null,
        selectedWeeks: [24, 25],
        color: '#E67E22'
    },
    {
        id: 8,
        name: 'Racks 15-20 equipment movement and bring up',
        dependencies: 'One rack per 2 working days',
        finishBefore: null,
        selectedWeeks: [26, 27],
        color: '#3498DB'
    },
    {
        id: 9,
        name: 'Validation tables + DEMO + Packaging enablement',
        dependencies: '',
        finishBefore: null,
        selectedWeeks: [27, 28],
        color: '#E74C3C'
    }
].map(convertTaskToNewFormat);

let currentEditingId = null;
let unsubscribeTasks = null;
let isFirebaseReady = false;

// Render week headers
function renderWeekHeaders() {
    const header = document.getElementById('weeksHeader');
    header.innerHTML = '';
    weeks.forEach(week => {
        const weekLabel = document.createElement('div');
        weekLabel.className = 'week-label';
        weekLabel.textContent = week;
        header.appendChild(weekLabel);
    });
}

// Update sync status
function updateSyncStatus(connected) {
    const indicator = document.getElementById('syncIndicator');
    if (indicator) {
        indicator.textContent = connected ? '✅ Connected & Synced' : '🔄 Connecting...';
        indicator.style.color = connected ? '#90EE90' : '#FFD700';
    }
}

// Load tasks from Firebase (with real-time sync)
function loadTasks() {
    if (!window.db) {
        // Fallback to localStorage if Firebase not configured
        const saved = localStorage.getItem('labMovingTasks');
        if (saved) {
            const savedTasks = JSON.parse(saved);
            // Convert old format to new format
            tasks = savedTasks.map(convertTaskToNewFormat);
        }
        // If no saved tasks, keep default tasks (they should already be in tasks array)
        renderTasks();
        updateSyncStatus(false);
        return;
    }

    try {
        const tasksRef = window.db.collection('schedule').doc('tasks');
        
        // Set up real-time listener
        unsubscribeTasks = tasksRef.onSnapshot((snapshot) => {
            if (snapshot.exists) {
                const data = snapshot.data();
                const loadedTasks = (data.tasks || []).map(convertTaskToNewFormat);
                if (loadedTasks.length > 0) {
                    tasks = loadedTasks;
                }
                // If Firebase has no tasks, keep default tasks
            } else {
                // First time - initialize with default tasks if they exist
                if (tasks.length > 0) {
                    tasksRef.set({ tasks });
                }
            }
            renderTasks();
            updateSyncStatus(true);
        }, (error) => {
            console.error('Firestore error:', error);
            updateSyncStatus(false);
            // Fallback to localStorage
            const saved = localStorage.getItem('labMovingTasks');
            if (saved) {
                const savedTasks = JSON.parse(saved).map(convertTaskToNewFormat);
                if (savedTasks.length > 0) {
                    tasks = savedTasks;
                }
            }
            // If no saved tasks, keep default tasks
            renderTasks();
        });
    } catch (error) {
        console.error('Error loading Firebase:', error);
        updateSyncStatus(false);
        // Fallback to localStorage
        const saved = localStorage.getItem('labMovingTasks');
        if (saved) {
            const savedTasks = JSON.parse(saved).map(convertTaskToNewFormat);
            if (savedTasks.length > 0) {
                tasks = savedTasks;
            }
        }
        // If no saved tasks, keep default tasks
        renderTasks();
    }
}

// Save tasks to Firebase
function saveTasks() {
    if (!window.db) {
        // Fallback to localStorage
        localStorage.setItem('labMovingTasks', JSON.stringify(tasks));
        return;
    }

    try {
        const tasksRef = window.db.collection('schedule').doc('tasks');
        tasksRef.set({ tasks }).then(() => {
            updateSyncStatus(true);
        }).catch((error) => {
            console.error('Error saving to Firebase:', error);
            // Fallback to localStorage
            localStorage.setItem('labMovingTasks', JSON.stringify(tasks));
        });
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        // Fallback to localStorage
        localStorage.setItem('labMovingTasks', JSON.stringify(tasks));
    }
}

// Render all tasks
function renderTasks() {
    const container = document.getElementById('tasksContainer');
    container.innerHTML = '';

    tasks.forEach(task => {
        const taskRow = document.createElement('div');
        taskRow.className = 'task-row';
        taskRow.style.borderLeftColor = task.color;

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        
        const taskName = document.createElement('div');
        taskName.className = 'task-name';
        taskName.textContent = task.name;
        taskName.style.cursor = 'pointer';
        taskName.onclick = () => editTask(task.id);

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';
        
        if (task.dependencies) {
            const dep = document.createElement('span');
            dep.className = 'task-dependency';
            dep.textContent = `📋 ${task.dependencies}`;
            taskDetails.appendChild(dep);
        }
        
        if (task.finishBefore) {
            const finish = document.createElement('span');
            finish.className = 'task-finish-before';
            finish.textContent = `⏰ Finish before week ${task.finishBefore}`;
            taskDetails.appendChild(finish);
        }

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskDetails);

        const taskTimeline = document.createElement('div');
        taskTimeline.className = 'task-timeline';

        // Ensure selectedWeeks exists
        if (!task.selectedWeeks) {
            task.selectedWeeks = [];
        }

        weeks.forEach((week, index) => {
            const weekNum = week === 'ww14 (LAB is ready)' ? 14 : parseInt(week);
            const weekCell = document.createElement('div');
            weekCell.className = 'week-cell';
            
            // Check if this week is selected
            const isSelected = task.selectedWeeks.includes(weekNum);
            
            if (isSelected) {
                weekCell.classList.add('active');
                weekCell.style.backgroundColor = task.color;
                weekCell.style.opacity = '0.8';
            }
            
            // Click to toggle week selection
            weekCell.onclick = () => {
                const index = task.selectedWeeks.indexOf(weekNum);
                if (index > -1) {
                    // Week is selected - remove it
                    task.selectedWeeks.splice(index, 1);
                } else {
                    // Week is not selected - add it
                    task.selectedWeeks.push(weekNum);
                    task.selectedWeeks.sort((a, b) => a - b); // Keep sorted
                }
                saveTasks();
                renderTasks();
            };
            
            taskTimeline.appendChild(weekCell);
        });

        taskRow.appendChild(taskInfo);
        taskRow.appendChild(taskTimeline);
        container.appendChild(taskRow);
    });
}

// Modal functions
const modal = document.getElementById('taskModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const cancelBtn = document.getElementById('cancelBtn');
const deleteBtn = document.getElementById('deleteBtn');
const taskForm = document.getElementById('taskForm');
const closeBtn = document.querySelector('.close');

addTaskBtn.onclick = () => {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Task';
    taskForm.reset();
    document.getElementById('taskColor').value = '#4A90E2';
    deleteBtn.style.display = 'none';
    modal.style.display = 'block';
};

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

cancelBtn.onclick = () => {
    modal.style.display = 'none';
};

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Convert to new format if needed
    const convertedTask = convertTaskToNewFormat(task);
    Object.assign(task, convertedTask);

    currentEditingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskName').value = task.name;
    document.getElementById('dependencies').value = task.dependencies || '';
    document.getElementById('finishBefore').value = task.finishBefore || '';
    // Calculate startWeek and duration from selectedWeeks for display
    if (task.selectedWeeks && task.selectedWeeks.length > 0) {
        const minWeek = Math.min(...task.selectedWeeks);
        const maxWeek = Math.max(...task.selectedWeeks);
        document.getElementById('startWeek').value = minWeek;
        document.getElementById('duration').value = maxWeek - minWeek + 1;
    } else {
        document.getElementById('startWeek').value = task.startWeek || startWeek;
        document.getElementById('duration').value = task.duration || 1;
    }
    document.getElementById('taskColor').value = task.color;
    deleteBtn.style.display = 'inline-block';
    modal.style.display = 'block';
}

taskForm.onsubmit = (e) => {
    e.preventDefault();
    
    const startWeekValue = parseInt(document.getElementById('startWeek').value);
    const durationValue = parseInt(document.getElementById('duration').value);
    
    // Convert startWeek + duration to selectedWeeks array
    const selectedWeeks = [];
    for (let i = startWeekValue; i < startWeekValue + durationValue; i++) {
        selectedWeeks.push(i);
    }
    
    const taskData = {
        name: document.getElementById('taskName').value,
        dependencies: document.getElementById('dependencies').value,
        finishBefore: document.getElementById('finishBefore').value ? 
            parseInt(document.getElementById('finishBefore').value) : null,
        selectedWeeks: selectedWeeks,
        startWeek: startWeekValue, // Keep for backward compatibility
        duration: durationValue,
        color: document.getElementById('taskColor').value
    };

    if (currentEditingId) {
        // Update existing task
        const task = tasks.find(t => t.id === currentEditingId);
        Object.assign(task, taskData);
    } else {
        // Add new task
        const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
        tasks.push({ id: newId, ...taskData });
    }

    saveTasks();
    renderTasks();
    modal.style.display = 'none';
};

deleteBtn.onclick = () => {
    if (currentEditingId && confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== currentEditingId);
        saveTasks();
        renderTasks();
        modal.style.display = 'none';
    }
};

// Export function
document.getElementById('exportBtn').onclick = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lab-moving-schedule.json';
    link.click();
};

// Settings Modal
const settingsModal = document.getElementById('settingsModal');
const settingsForm = document.getElementById('settingsForm');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettings = document.getElementById('closeSettings');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');

// Load week range from storage
function loadWeekRange() {
    const saved = localStorage.getItem('labMovingWeekRange');
    if (saved) {
        const range = JSON.parse(saved);
        startWeek = range.startWeek || 14;
        endWeek = range.endWeek || 28;
    }
    updateWeeks();
}

// Save week range to storage
function saveWeekRange() {
    localStorage.setItem('labMovingWeekRange', JSON.stringify({
        startWeek: startWeek,
        endWeek: endWeek
    }));
}

settingsBtn.onclick = () => {
    document.getElementById('startWeekRange').value = startWeek;
    document.getElementById('endWeekRange').value = endWeek;
    settingsModal.style.display = 'block';
};

closeSettings.onclick = () => {
    settingsModal.style.display = 'none';
};

cancelSettingsBtn.onclick = () => {
    settingsModal.style.display = 'none';
};

// Handle clicks outside modals
window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

settingsForm.onsubmit = (e) => {
    e.preventDefault();
    const newStartWeek = parseInt(document.getElementById('startWeekRange').value);
    const newEndWeek = parseInt(document.getElementById('endWeekRange').value);
    
    if (newStartWeek >= newEndWeek) {
        alert('Start week must be less than end week!');
        return;
    }
    
    startWeek = newStartWeek;
    endWeek = newEndWeek;
    saveWeekRange();
    updateWeeks();
    settingsModal.style.display = 'none';
};

// Initialize when Firebase is ready
window.onFirebaseReady = (connected) => {
    isFirebaseReady = true;
    loadWeekRange(); // Load week range first
    renderWeekHeaders();
    loadTasks();
    if (!connected) {
        updateSyncStatus(false);
    }
};

// Fallback: initialize immediately if Firebase not configured
setTimeout(() => {
    if (!isFirebaseReady) {
        loadWeekRange(); // Load week range first
        renderWeekHeaders();
        loadTasks();
    }
}, 1000);

