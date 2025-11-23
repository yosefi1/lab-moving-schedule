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
        
        if (enteredPassword === APP_CONFIG.password) {
            sessionStorage.setItem('labMovingAuth', 'true');
            passwordModal.style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    };
})();

// Initialize weeks
const weeks = [];
for (let i = 14; i <= 28; i++) {
    weeks.push(i === 14 ? 'ww14 (LAB is ready)' : i);
}

// Sample tasks based on your Excel
let tasks = [
    {
        id: 1,
        name: 'LAB inspection (all IT ports, Electricity, Thermal tools, CDA, PCW)',
        dependencies: 'Dedicated inspection tools (IT, CDA, PCW)',
        finishBefore: null,
        startWeek: 14,
        duration: 1,
        color: '#4A90E2'
    },
    {
        id: 2,
        name: 'Storage transfer (Compactus + lab shelfs)',
        dependencies: '',
        finishBefore: 3,
        startWeek: 15,
        duration: 2,
        color: '#50C878'
    },
    {
        id: 3,
        name: 'SIPD Picoprobing transfer and calibration',
        dependencies: 'Need Rigotek',
        finishBefore: 4,
        startWeek: 15,
        duration: 1,
        color: '#FF6B6B'
    },
    {
        id: 4,
        name: 'MATRIX + MiniMax + Soldering equipment movement and installation',
        dependencies: '',
        finishBefore: null,
        startWeek: 17,
        duration: 1,
        color: '#FFD93D'
    },
    {
        id: 5,
        name: 'Racks 1-5 equipment movement and bring up',
        dependencies: 'One rack per 2 working days',
        finishBefore: 6,
        startWeek: 18,
        duration: 2,
        color: '#9B59B6'
    },
    {
        id: 6,
        name: 'Racks 6-10 equipment movement and bring up',
        dependencies: 'One rack per 2 working days',
        finishBefore: null,
        startWeek: 21,
        duration: 2,
        color: '#1ABC9C'
    },
    {
        id: 7,
        name: 'Racks 11-15 equipment movement and bring up',
        dependencies: 'One rack per 2 working days',
        finishBefore: null,
        startWeek: 24,
        duration: 2,
        color: '#E67E22'
    },
    {
        id: 8,
        name: 'Racks 15-20 equipment movement and bring up',
        dependencies: 'One rack per 2 working days',
        finishBefore: null,
        startWeek: 26,
        duration: 2,
        color: '#3498DB'
    },
    {
        id: 9,
        name: 'Validation tables + DEMO + Packaging enablement',
        dependencies: '',
        finishBefore: null,
        startWeek: 27,
        duration: 2,
        color: '#E74C3C'
    }
];

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
            tasks = JSON.parse(saved);
        }
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
                tasks = data.tasks || [];
            } else {
                // First time - initialize with default tasks
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
                tasks = JSON.parse(saved);
                renderTasks();
            }
        });
    } catch (error) {
        console.error('Error loading Firebase:', error);
        updateSyncStatus(false);
        // Fallback to localStorage
        const saved = localStorage.getItem('labMovingTasks');
        if (saved) {
            tasks = JSON.parse(saved);
            renderTasks();
        }
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

        weeks.forEach((week, index) => {
            const weekNum = week === 'ww14 (LAB is ready)' ? 14 : parseInt(week);
            const weekCell = document.createElement('div');
            weekCell.className = 'week-cell';
            
            const taskStartWeek = task.startWeek;
            const taskEndWeek = task.startWeek + task.duration - 1;
            
            if (weekNum >= taskStartWeek && weekNum <= taskEndWeek) {
                weekCell.classList.add('active');
                weekCell.style.backgroundColor = task.color;
                weekCell.style.opacity = '0.8';
            }
            
            weekCell.onclick = () => {
                if (currentEditingId === task.id) {
                    // Quick edit: click to change start week
                    const newStart = weekNum;
                    if (newStart + task.duration - 1 <= 28) {
                        task.startWeek = newStart;
                        saveTasks();
                        renderTasks();
                    }
                }
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

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskName').value = task.name;
    document.getElementById('dependencies').value = task.dependencies || '';
    document.getElementById('finishBefore').value = task.finishBefore || '';
    document.getElementById('startWeek').value = task.startWeek;
    document.getElementById('duration').value = task.duration;
    document.getElementById('taskColor').value = task.color;
    deleteBtn.style.display = 'inline-block';
    modal.style.display = 'block';
}

taskForm.onsubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
        name: document.getElementById('taskName').value,
        dependencies: document.getElementById('dependencies').value,
        finishBefore: document.getElementById('finishBefore').value ? 
            parseInt(document.getElementById('finishBefore').value) : null,
        startWeek: parseInt(document.getElementById('startWeek').value),
        duration: parseInt(document.getElementById('duration').value),
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

// Initialize when Firebase is ready
window.onFirebaseReady = (connected) => {
    isFirebaseReady = true;
    renderWeekHeaders();
    loadTasks();
    if (!connected) {
        updateSyncStatus(false);
    }
};

// Fallback: initialize immediately if Firebase not configured
setTimeout(() => {
    if (!isFirebaseReady) {
        renderWeekHeaders();
        loadTasks();
    }
}, 1000);

