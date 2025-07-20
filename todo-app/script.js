document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const pendingTasksList = document.getElementById('pendingTasks');
    const completedTasksList = document.getElementById('completedTasks');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render all tasks
    renderTasks();

    // Add new task
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    function renderTasks() {
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            if (task.completed) {
                taskText.classList.add('completed');
            }

            const taskTime = document.createElement('small');
            taskTime.textContent = formatDate(task.completed ? task.completedAt : task.createdAt);
            taskTime.style.marginLeft = '10px';
            taskTime.style.color = '#666';

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            if (!task.completed) {
                const completeBtn = document.createElement('button');
                completeBtn.textContent = 'Complete';
                completeBtn.className = 'complete-btn';
                completeBtn.addEventListener('click', () => completeTask(task.id));
                actionsDiv.appendChild(completeBtn);
            }

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => editTask(task.id));
            actionsDiv.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(taskText);
            li.appendChild(taskTime);
            li.appendChild(actionsDiv);

            if (task.completed) {
                completedTasksList.appendChild(li);
            } else {
                pendingTasksList.appendChild(li);
            }
        });
    }

    function completeTask(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = true;
            tasks[taskIndex].completedAt = new Date().toISOString();
            saveTasks();
            renderTasks();
        }
    }

    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        if (!task) return;

        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    }
});