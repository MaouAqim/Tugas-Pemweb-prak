document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList");
    const addTaskButton = document.getElementById("addTaskButton");
    const notification = document.getElementById("notification");
    const deleteModal = document.getElementById("deleteModal");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const cancelDeleteButton = document.getElementById("cancelDeleteButton");
    const themeToggle = document.getElementById("themeToggle");
    const activeCount = document.getElementById("activeCount");
    const completedCount = document.getElementById("completedCount");
    const progressBarFill = document.getElementById("progressBarFill");
    const searchTask = document.getElementById("searchTask");
    const clearAllButton = document.getElementById("clearAllButton");
    const sortTasksButton = document.getElementById("sortTasksButton");
    const taskTitleInput = document.getElementById("taskTitle");
    const taskDueDateInput = document.getElementById("taskDueDate");
    const taskPriorityInput = document.getElementById("taskPriority");
    

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let deleteIndex = null;
    let darkTheme = localStorage.getItem("darkTheme") === "true";
    let sortAscending = true;

    if (darkTheme) document.body.classList.add("dark-theme");

    // Render task list
    function renderTasks() {
        taskList.innerHTML = "";
        let active = 0, completed = 0;

        tasks.forEach((task, index) => {
            if (searchTask.value && !task.title.toLowerCase().includes(searchTask.value.toLowerCase())) return;

            const taskItem = document.createElement("li");
            taskItem.className = `task-item ${task.completed ? "task-completed" : ""}`;
            taskItem.innerHTML = `
                <span class="task-title">${task.title}</span>
                <span class="task-date">${task.dueDate || "No Due Date"}</span>
                <span class="task-priority">Priority: ${task.priority}</span>
                <button class="complete-btn" data-index="${index}">✓</button>
                <button class="edit-btn" data-index="${index}">✎</button>
                <button class="delete-btn" data-index="${index}">✖</button>
            `;
            taskList.appendChild(taskItem);

            task.completed ? completed++ : active++;
        });

        activeCount.textContent = `Active Tasks: ${active}`;
        completedCount.textContent = `Completed Tasks: ${completed}`;
        progressBarFill.style.width = tasks.length ? `${(completed / tasks.length) * 100}%` : "0%";
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = "block";
        setTimeout(() => notification.style.display = "none", 2000);
    }

    // Dynamic search event
    searchTask.addEventListener("input", renderTasks);

    // Theme toggle event
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        darkTheme = !darkTheme;
        localStorage.setItem("darkTheme", darkTheme);
    });

    // Add task event
    addTaskButton.addEventListener("click", () => {
        const title = taskTitleInput.value.trim();
        const dueDate = taskDueDateInput.value;
        const priority = taskPriorityInput.value;

        if (!title) {
            showNotification("Task title is required!");
            return;
        }

        tasks.push({ title, dueDate, priority, completed: false });
        renderTasks();
        showNotification("Task added successfully!");

        // Clear input fields after adding a task
        taskTitleInput.value = "";
        taskDueDateInput.value = "";
        taskPriorityInput.value = "Medium";
    });

    // Close modal when clicking outside the modal
    window.addEventListener("click", function (event) {
        if (event.target === deleteModal) {
            deleteModal.style.display = "none";
        }
    });

    // Toggle task completion
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("complete-btn")) {
            const index = e.target.dataset.index;
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
        }
    });

    // Edit task event
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("edit-btn")) {
            const index = e.target.dataset.index;
            const task = tasks[index];
            taskTitleInput.value = task.title;
            taskDueDateInput.value = task.dueDate;
            taskPriorityInput.value = task.priority;
            tasks.splice(index, 1);
            renderTasks();
        }
    });

    // Show delete confirmation modal
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            deleteIndex = e.target.dataset.index;
            deleteModal.style.display = "block";
        }
    });

    // Confirm delete task
    confirmDeleteButton.addEventListener("click", function () {
        tasks.splice(deleteIndex, 1);
        renderTasks();
        deleteModal.style.display = "none";
        showNotification("Task deleted successfully!");
    });

    // Cancel delete task
    cancelDeleteButton.addEventListener("click", function () {
        deleteModal.style.display = "none";
    });

    // Event to delete all tasks
    clearAllButton.addEventListener("click", function () {
        tasks = [];
        renderTasks();
        showNotification("All tasks cleared!");
    });

    // Sort tasks
    sortTasksButton.addEventListener("click", function () {
        tasks.sort((a, b) => {
            if (a.priority === b.priority) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            return sortAscending
                ? a.priority.localeCompare(b.priority)
                : b.priority.localeCompare(a.priority);
        });
        sortAscending = !sortAscending;
        renderTasks();
    });
    

    // Initial task render
    renderTasks();
});
