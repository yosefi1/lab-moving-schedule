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
let startWeek = 27;
let endWeek = 52;
let weeks = [];

// Calculate date for a given week number (ISO week - starts on Monday)
// Week 14 of 2024 starts on April 1, 2024 (Monday)
function getWeekStartDate(weekNumber, year = 2024) {
    // Find January 4th of the year (always in week 1 of ISO week)
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Find the Monday of week 1 (go back to Monday)
    const daysToMonday = jan4Day === 0 ? 6 : jan4Day - 1;
    const week1Monday = new Date(year, 0, 4 - daysToMonday);
    
    // Calculate days to add for the specific week (week 1 = week1Monday, week 14 = 13 weeks later)
    const daysToAdd = (weekNumber - 1) * 7;
    const weekStart = new Date(week1Monday);
    weekStart.setDate(week1Monday.getDate() + daysToAdd);
    
    return weekStart;
}

// Format date as DD/MM
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}

// Helper function to convert old format (startWeek + duration) to new format (selectedWeeks)
function convertTaskToNewFormat(task) {
    // If already in new format, return as is
    if (task.selectedWeeks && Array.isArray(task.selectedWeeks)) {
        // Ensure selectedWeeks is properly formatted - convert to numbers
        task.selectedWeeks = task.selectedWeeks.map(w => {
            const num = typeof w === 'string' ? parseInt(w) : w;
            return typeof num === 'number' && !isNaN(num) ? num : null;
        }).filter(w => w !== null);
        return task;
    }
    
    // Convert from old format (startWeek + duration) to new format (selectedWeeks array)
    if (task.startWeek && task.duration) {
        task.selectedWeeks = [];
        for (let i = 0; i < task.duration; i++) {
            task.selectedWeeks.push(task.startWeek + i);
        }
    } else if (task.startWeek) {
        task.selectedWeeks = [task.startWeek];
    } else {
        task.selectedWeeks = [];
    }
    
    // Ensure selectedWeeks is an array of numbers
    if (!Array.isArray(task.selectedWeeks)) {
        task.selectedWeeks = [];
    } else {
        task.selectedWeeks = task.selectedWeeks.map(w => {
            const num = typeof w === 'string' ? parseInt(w) : w;
            return typeof num === 'number' && !isNaN(num) ? num : null;
        }).filter(w => w !== null);
    }
    
    // Remove old format fields
    delete task.startWeek;
    delete task.duration;
    
    return task;
}

// Tasks based on the Excel file - weeks updated according to the document
let tasks = [
    {
        id: 1,
        name: 'LAB inspection (all IT ports, Electricity, Thermal tools, CDA, PCW)',
        dependencies: 'Dedicated inspection tools (IT, CDA, PCW)',
        finishBefore: null,
        selectedWeeks: [27],
        color: '#4A90E2'
    },
    {
        id: 2,
        name: 'Storage transfer (Compactus + lab shelfs)',
        dependencies: '',
        finishBefore: null,
        selectedWeeks: [27, 28],
        color: '#50C878'
    },
    {
        id: 3,
        name: 'SIPD Picoprobing transfer and calibration',
        dependencies: 'Need Rigotek',
        finishBefore: null,
        selectedWeeks: [28, 29, 30],
        color: '#FF6B6B'
    },
    {
        id: 4,
        name: 'MATRIX + MiniMax + BETA + Soldering equipment movement and installation',
        dependencies: '',
        finishBefore: null,
        selectedWeeks: [29, 30],
        color: '#FFD93D'
    },
    {
        id: 5,
        name: 'Racks 1-5 equipment movement and bring up',
        dependencies: 'One rack per 2 working days (need help of 3 more lab-oriented people to assist)',
        finishBefore: null,
        selectedWeeks: [30, 31],
        color: '#9B59B6'
    },
    {
        id: 6,
        name: 'Racks 6-10 equipment movement and bring up',
        dependencies: 'One rack per 2 working days (need help of 3 more lab-oriented people to assist)',
        finishBefore: null,
        selectedWeeks: [32, 33],
        color: '#1ABC9C'
    },
    {
        id: 7,
        name: 'Racks 11-15 equipment movement and bring up (PO preparation)',
        dependencies: 'One rack per 2 working days (need help of 3 more lab-oriented people to assist)',
        finishBefore: null,
        selectedWeeks: [34, 35],
        color: '#E67E22'
    },
    {
        id: 8,
        name: 'Racks 15-20 equipment movement and bring up (PO preparation)',
        dependencies: 'One rack per 2 working days (need help of 3 more lab-oriented people to assist)',
        finishBefore: null,
        selectedWeeks: [36, 37],
        color: '#3498DB'
    },
    {
        id: 9,
        name: 'Validation tables + DEMO + Packaging enablement',
        dependencies: '',
        finishBefore: null,
        selectedWeeks: [28],
        color: '#E74C3C'
    },
    {
        id: 10,
        name: 'LAB is ready',
        dependencies: '',
        finishBefore: null,
        selectedWeeks: [35],
        color: '#90EE90'
    },
    {
        id: 11,
        name: 'PO BRKMPS readiness (Equipment, Calib, Setups)',
        dependencies: 'One rack per 2 working days (need help of 3 more lab-oriented people to assist)',
        finishBefore: null,
        selectedWeeks: [36, 37, 38, 39],
        color: '#FFA500'
    },
    {
        id: 12,
        name: 'BRKMPS execution',
        dependencies: '',
        finishBefore: null,
        selectedWeeks: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52],
        color: '#9370DB'
    }
].map(convertTaskToNewFormat);

let currentEditingId = null;
let unsubscribeTasks = null;
let isFirebaseReady = false;

function updateWeeks() {
    weeks = [];
    for (let i = startWeek; i <= endWeek; i++) {
        weeks.push(i);
    }
    renderWeekHeaders();
    if (tasks && tasks.length > 0) {
        renderTasks();
    }
}

// Render week headers
function renderWeekHeaders() {
    const header = document.getElementById('weeksHeader');
    header.innerHTML = '';
    
    weeks.forEach(week => {
        const weekNum = parseInt(week);
        const weekDate = getWeekStartDate(weekNum);
        const dateStr = formatDate(weekDate);
        
        const weekLabel = document.createElement('div');
        weekLabel.className = 'week-label';
        weekLabel.setAttribute('data-week', weekNum);
        
        // Create date element
        const dateElement = document.createElement('div');
        dateElement.className = 'week-date';
        dateElement.textContent = dateStr;
        dateElement.style.fontSize = '0.75em';
        dateElement.style.color = '#888';
        dateElement.style.marginBottom = '2px';
        
        // Create week number element
        const weekElement = document.createElement('div');
        weekElement.className = 'week-number';
        weekElement.textContent = `ww${weekNum}`;
        weekElement.style.fontWeight = '600';
        weekElement.style.color = '#555';
        
        weekLabel.appendChild(dateElement);
        weekLabel.appendChild(weekElement);
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

// Load tasks from Firebase (with real-time sync) or localStorage
function loadTasks() {
    if (!window.db) {
        // Working locally - use localStorage only
        const saved = localStorage.getItem('labMovingTasks');
        if (saved) {
            const savedTasks = JSON.parse(saved);
            // Convert old format to new format
            tasks = savedTasks.map(convertTaskToNewFormat);
            // Ensure selectedWeeks are numbers
            tasks = tasks.map(task => {
                if (task.selectedWeeks && Array.isArray(task.selectedWeeks)) {
                    task.selectedWeeks = task.selectedWeeks.map(w => {
                        const num = typeof w === 'string' ? parseInt(w) : w;
                        return typeof num === 'number' && !isNaN(num) ? num : null;
                    }).filter(w => w !== null);
                }
                return task;
            });
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
                    // Ensure all tasks have selectedWeeks array
                    const processedTasks = loadedTasks.map(task => {
                        if (!task.selectedWeeks || !Array.isArray(task.selectedWeeks)) {
                            task.selectedWeeks = [];
                        }
                        // Convert selectedWeeks to numbers
                        task.selectedWeeks = task.selectedWeeks.map(w => {
                            const num = typeof w === 'string' ? parseInt(w) : w;
                            return typeof num === 'number' && !isNaN(num) ? num : null;
                        }).filter(w => w !== null);
                        return task;
                    });
                    
                    // Check if data is outdated (old week range 14-28 instead of 27-52)
                    // If any task has weeks < 27, it's old data - replace with defaults
                    const hasOldData = processedTasks.some(task => 
                        task.selectedWeeks && task.selectedWeeks.length > 0 && 
                        Math.min(...task.selectedWeeks) < 27
                    );
                    
                    if (hasOldData) {
                        console.log('🔄 Detected old data format - updating to new schedule (weeks 27-52)');
                        // Replace with default tasks (which have correct weeks 27-52)
                        tasksRef.set({ tasks }).then(() => {
                            console.log('✅ Updated Firebase with new schedule');
                            renderTasks();
                            updateSyncStatus(true);
                        });
                    } else {
                        tasks = processedTasks;
                        renderTasks();
                        updateSyncStatus(true);
                    }
                } else {
                    // If Firebase has empty tasks array, use default tasks
                    if (tasks.length > 0) {
                        // Save default tasks to Firebase
                        tasksRef.set({ tasks });
                    }
                    renderTasks();
                    updateSyncStatus(true);
                }
                // If Firebase has no tasks, keep default tasks
            } else {
                // First time - initialize with default tasks if they exist
                if (tasks.length > 0) {
                    tasksRef.set({ tasks });
                }
                renderTasks();
                updateSyncStatus(true);
            }
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

// Save tasks to Firebase or localStorage
function saveTasks() {
    // Always save to localStorage (for local work)
    localStorage.setItem('labMovingTasks', JSON.stringify(tasks));
    
    // Only save to Firebase if connected
    if (!window.db) {
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
        
        // Don't show finishBefore in main view - it's editable via cell popup

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskDetails);

        const taskTimeline = document.createElement('div');
        taskTimeline.className = 'task-timeline';

        // Ensure selectedWeeks exists
        if (!task.selectedWeeks) {
            task.selectedWeeks = [];
        }

        weeks.forEach((week, index) => {
            const weekNum = parseInt(week);
            const weekCell = document.createElement('div');
            weekCell.className = 'week-cell';
            weekCell.setAttribute('data-week', weekNum); // Add data attribute for hover matching
            
            // Check if this week is selected
            // Ensure selectedWeeks is an array
            if (!task.selectedWeeks || !Array.isArray(task.selectedWeeks)) {
                task.selectedWeeks = [];
            }
            
            // Convert selectedWeeks to numbers if they're strings
            const selectedWeeksNumbers = task.selectedWeeks.map(w => {
                const num = typeof w === 'string' ? parseInt(w) : w;
                return typeof num === 'number' && !isNaN(num) ? num : null;
            }).filter(w => w !== null);
            
            const isSelected = selectedWeeksNumbers.includes(weekNum);
            
            if (isSelected) {
                weekCell.classList.add('active');
                weekCell.style.backgroundColor = task.color;
                weekCell.style.opacity = '0.8';
                // Add checkmark icon
                const checkmark = document.createElement('div');
                checkmark.innerHTML = '✓';
                checkmark.style.position = 'absolute';
                checkmark.style.top = '50%';
                checkmark.style.left = '50%';
                checkmark.style.transform = 'translate(-50%, -50%)';
                checkmark.style.color = 'white';
                checkmark.style.fontSize = '20px';
                checkmark.style.fontWeight = 'bold';
                checkmark.style.pointerEvents = 'none';
                checkmark.style.zIndex = '1';
                weekCell.appendChild(checkmark);
            }
            
            // Hover effect - highlight corresponding week header
            weekCell.onmouseenter = () => {
                const weekLabel = document.querySelector(`.week-label[data-week="${weekNum}"]`);
                if (weekLabel) {
                    weekLabel.classList.add('week-hover');
                }
            };
            
            weekCell.onmouseleave = () => {
                const weekLabel = document.querySelector(`.week-label[data-week="${weekNum}"]`);
                if (weekLabel) {
                    weekLabel.classList.remove('week-hover');
                }
            };
            
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
                renderTasks(); // Re-render to update UI
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
    // Update min/max for week inputs
    document.getElementById('startWeek').min = startWeek;
    document.getElementById('startWeek').max = endWeek;
    document.getElementById('finishBefore').min = startWeek;
    document.getElementById('finishBefore').max = endWeek;
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
    // Ensure selectedWeeks are numbers
    if (task.selectedWeeks && task.selectedWeeks.length > 0) {
        const selectedWeeksNumbers = task.selectedWeeks.map(w => {
            const num = typeof w === 'string' ? parseInt(w) : w;
            return typeof num === 'number' && !isNaN(num) ? num : null;
        }).filter(w => w !== null);
        
        if (selectedWeeksNumbers.length > 0) {
            const minWeek = Math.min(...selectedWeeksNumbers);
            const maxWeek = Math.max(...selectedWeeksNumbers);
            document.getElementById('startWeek').value = minWeek;
            document.getElementById('duration').value = maxWeek - minWeek + 1;
        } else {
            document.getElementById('startWeek').value = startWeek;
            document.getElementById('duration').value = 1;
        }
    } else {
        document.getElementById('startWeek').value = task.startWeek || startWeek;
        document.getElementById('duration').value = task.duration || 1;
    }
    
    // Update min/max for week inputs
    document.getElementById('startWeek').min = startWeek;
    document.getElementById('startWeek').max = endWeek;
    document.getElementById('finishBefore').min = startWeek;
    document.getElementById('finishBefore').max = endWeek;
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
    // Export to Excel format (CSV)
    let csv = 'Task Name,Dependencies,Finish Before Week,Selected Weeks,Color\n';
    
    tasks.forEach(task => {
        const name = `"${(task.name || '').replace(/"/g, '""')}"`;
        const dependencies = `"${(task.dependencies || '').replace(/"/g, '""')}"`;
        const finishBefore = task.finishBefore || '';
        const selectedWeeks = (task.selectedWeeks || []).join(';');
        const color = task.color || '';
        csv += `${name},${dependencies},${finishBefore},"${selectedWeeks}",${color}\n`;
    });
    
    const dataBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lab-moving-tasks.csv';
    link.click();
    URL.revokeObjectURL(url);
};

// Settings Modal
const settingsModal = document.getElementById('settingsModal');
const settingsForm = document.getElementById('settingsForm');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettings = document.getElementById('closeSettings');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');

// Plan Modal
const planModal = document.getElementById('planModal');
const planBtn = document.getElementById('planBtn');
const closePlan = document.getElementById('closePlan');
const closePlanBtn = document.getElementById('closePlanBtn');

// Load week range from storage
function loadWeekRange() {
    const saved = localStorage.getItem('labMovingWeekRange');
    if (saved) {
        const range = JSON.parse(saved);
        startWeek = range.startWeek || 27;
        endWeek = range.endWeek || 52;
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

// Quick Edit Cell Modal
let currentCellEditTaskId = null;
let currentCellEditWeek = null;
const cellEditModal = document.getElementById('cellEditModal');
const cellEditForm = document.getElementById('cellEditForm');
const closeCellEdit = document.getElementById('closeCellEdit');
const cancelCellEditBtn = document.getElementById('cancelCellEditBtn');

function openCellEditPopup(taskId, weekNum) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentCellEditTaskId = taskId;
    currentCellEditWeek = weekNum;
    
    // Populate form with current values
    document.getElementById('cellDependencies').value = task.dependencies || '';
    document.getElementById('cellFinishBefore').value = task.finishBefore || '';
    
    cellEditModal.style.display = 'block';
}

if (closeCellEdit) {
    closeCellEdit.onclick = () => {
        cellEditModal.style.display = 'none';
    };
}

if (cancelCellEditBtn) {
    cancelCellEditBtn.onclick = () => {
        cellEditModal.style.display = 'none';
    };
}

if (cellEditForm) {
    cellEditForm.onsubmit = (e) => {
        e.preventDefault();
        
        const task = tasks.find(t => t.id === currentCellEditTaskId);
        if (!task) return;
        
        // Update task
        task.dependencies = document.getElementById('cellDependencies').value;
        const finishBeforeValue = document.getElementById('cellFinishBefore').value;
        task.finishBefore = finishBeforeValue ? parseInt(finishBeforeValue) : null;
        
        // Toggle week selection
        const index = task.selectedWeeks.indexOf(currentCellEditWeek);
        if (index > -1) {
            // Week is selected - remove it
            task.selectedWeeks.splice(index, 1);
        } else {
            // Week is not selected - add it
            task.selectedWeeks.push(currentCellEditWeek);
            task.selectedWeeks.sort((a, b) => a - b);
        }
        
        saveTasks();
        renderTasks();
        cellEditModal.style.display = 'none';
    };
}

// Plan Modal handlers
planBtn.onclick = () => {
    planModal.style.display = 'block';
};

closePlan.onclick = () => {
    planModal.style.display = 'none';
};

closePlanBtn.onclick = () => {
    planModal.style.display = 'none';
};

// Handle clicks outside modals
window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    if (event.target === planModal) {
        planModal.style.display = 'none';
    }
    if (event.target === cellEditModal) {
        cellEditModal.style.display = 'none';
    }
});

// Scroll controls
const scrollLeftBtn = document.getElementById('scrollLeftBtn');
const scrollRightBtn = document.getElementById('scrollRightBtn');
const timelineContainer = document.getElementById('timelineContainer');

if (scrollLeftBtn && scrollRightBtn && timelineContainer) {
    scrollLeftBtn.onclick = () => {
        timelineContainer.scrollBy({ left: -200, behavior: 'smooth' });
    };
    
    scrollRightBtn.onclick = () => {
        timelineContainer.scrollBy({ left: 200, behavior: 'smooth' });
    };
}

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

