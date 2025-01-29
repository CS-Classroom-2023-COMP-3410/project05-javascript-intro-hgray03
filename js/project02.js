// Get DOM elements
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterSelect = document.getElementById('filter-select');

// We'll store tasks in an array of objects: [{ id, text, completed }, ...]
let tasks = [];
let dragSrcEl = null; // reference to the task being dragged

// --------------------------
//  Initialization
// --------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Load tasks from localStorage
  loadTasksFromStorage();
  // Render tasks
  renderTasks();

  // Add event listeners
  addTaskBtn.addEventListener('click', addTask);
  newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  filterSelect.addEventListener('change', renderTasks);
});

// --------------------------
//  Local Storage
// --------------------------
function saveTasksToStorage() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const storedTasks = JSON.parse(localStorage.getItem('myTasks'));
  if (Array.isArray(storedTasks)) {
    tasks = storedTasks;
  }
}

// --------------------------
//  Add & Delete Task
// --------------------------
function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText === '') return;

  const newTask = {
    id: Date.now().toString(),
    text: taskText,
    completed: false
  };
  tasks.push(newTask);
  saveTasksToStorage();
  renderTasks();

  // Clear input
  newTaskInput.value = '';
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasksToStorage();
  renderTasks();
}

// --------------------------
//  Toggle Complete
// --------------------------
function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasksToStorage();
    renderTasks();
  }
}

// --------------------------
//  Edit Task (Toggle Edit/Save)
// --------------------------
function handleEdit(task, li, editBtn) {
  // Check if this list item is already in editing mode
  const isEditing = li.classList.contains('editing');

  if (!isEditing) {
    // Switch to editing mode
    li.classList.add('editing');

    // Create an input box with the current task text
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('edit-input');
    editInput.value = task.text;

    // Insert the input after the checkbox
    const leftSection = li.querySelector('.left-section');
    const textSpan = li.querySelector('.task-text');
    leftSection.replaceChild(editInput, textSpan);

    // Change button text to 'Save'
    editBtn.textContent = 'Save';

    // Focus on the input
    editInput.focus();
  } else {
    // Currently editing, so this click means "Save"
    const editInput = li.querySelector('.edit-input');
    const newText = editInput.value.trim();

    if (newText) {
      task.text = newText;
    }

    // Save changes & re-render
    saveTasksToStorage();
    renderTasks();
  }
}

// --------------------------
//  Drag & Drop
// --------------------------
function handleDragStart(e) {
  dragSrcEl = e.currentTarget;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', e.currentTarget.dataset.id);

  // Add visual effect
  dragSrcEl.style.opacity = '0.4';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
  e.preventDefault();
  if (e.currentTarget.classList.contains('task-item')) {
    e.currentTarget.style.backgroundColor = '#ffd54f';
  }
}

function handleDragLeave(e) {
  if (e.currentTarget.classList.contains('task-item')) {
    e.currentTarget.style.backgroundColor = '#fff';
  }
}

function handleDrop(e) {
  e.stopPropagation();
  const droppedEl = e.currentTarget;
  if (dragSrcEl !== droppedEl) {
    // Reorder tasks in the array
    const draggedId = dragSrcEl.dataset.id;
    const droppedId = droppedEl.dataset.id;

    const draggedIndex = tasks.findIndex((t) => t.id === draggedId);
    const droppedIndex = tasks.findIndex((t) => t.id === droppedId);

    // Remove the dragged task and re-insert at new position
    const [removed] = tasks.splice(draggedIndex, 1);
    tasks.splice(droppedIndex, 0, removed);

    saveTasksToStorage();
    renderTasks();
  }
}

function handleDragEnd(e) {
  // Restore style
  e.currentTarget.style.opacity = '1';
  // Reset background of all task items
  const allItems = document.querySelectorAll('.task-item');
  allItems.forEach((item) => {
    item.style.backgroundColor = '#fff';
  });
}

// --------------------------
//  Render Tasks
// --------------------------
function renderTasks() {
  // Clear the current list
  taskList.innerHTML = '';

  // Filter tasks based on user selection
  let filteredTasks = [...tasks];
  const filterValue = filterSelect.value;
  if (filterValue === 'completed') {
    filteredTasks = filteredTasks.filter((t) => t.completed);
  } else if (filterValue === 'pending') {
    filteredTasks = filteredTasks.filter((t) => !t.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('task-completed');
    li.setAttribute('draggable', 'true');
    li.dataset.id = task.id;

    // Left section: checkbox + text
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-section');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    textSpan.textContent = task.text;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(textSpan);

    // Right section: Edit & Delete buttons
    const btnGroup = document.createElement('div');
    btnGroup.classList.add('btn-group');

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Edit';
    // Attach click listener for editing
    editBtn.addEventListener('click', () => handleEdit(task, li, editBtn));

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    // Assemble task item
    li.appendChild(leftDiv);
    li.appendChild(btnGroup);

    // Drag & drop event handlers
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('dragenter', handleDragEnter);
    li.addEventListener('dragleave', handleDragLeave);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragend', handleDragEnd);

    taskList.appendChild(li);
  });
}
