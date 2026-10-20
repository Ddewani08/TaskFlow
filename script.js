// CHECK LOGIN
const currentUser =
    JSON.parse(localStorage.getItem("taskflowCurrentUser"));

if (!currentUser) {
    window.location.href = "home.html";
}
// SCREEN ELEMENTS
const dashboard =
    document.getElementById("dashboard");

const startBtn =
    document.getElementById("startBtn");

const taskInput =
    document.getElementById("taskInput");

const taskDate =
    document.getElementById("taskDate");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");
// SETTINGS ELEMENTS
const autoSave =
    document.getElementById("autoSave");

const showCompleted =
    document.getElementById("showCompleted");

const clearTasksBtn =
    document.getElementById("clearTasksBtn");
// PROGRESS ELEMENTS
const progressPercentage =
    document.getElementById("progressPercentage");

const progressMessage =
    document.getElementById("progressMessage");

const progressTotal =
    document.getElementById("progressTotal");

const progressCompleted =
    document.getElementById("progressCompleted");

const progressPending =
    document.getElementById("progressPending");

const progressBarText =
    document.getElementById("progressBarText");

const progressBar =
    document.getElementById("progressBar");
// USER-SPECIFIC TASK STORAGE
const taskStorageKey =
    "taskflowTasks_" + currentUser.email;

let tasks =
    JSON.parse(localStorage.getItem(taskStorageKey)) || [];

let currentFilter = "all";

let searchTerm = "";
// DISPLAY USER NAME
const userNameElements =
    document.querySelectorAll(".user-name");

userNameElements.forEach(function (element) {

    element.textContent = currentUser.name;

});
// AUTO SAVE
const savedAutoSave =
    localStorage.getItem("taskflowAutoSave");

if (autoSave) {

    if (savedAutoSave === "false") {
        autoSave.checked = false;
    } else {
        autoSave.checked = true;
    }

    autoSave.addEventListener("change", function () {

        localStorage.setItem(
            "taskflowAutoSave",
            autoSave.checked
        );

    });

}
// SHOW COMPLETED
const savedShowCompleted =
    localStorage.getItem("taskflowShowCompleted");

if (showCompleted) {

    if (savedShowCompleted === "false") {
        showCompleted.checked = false;
    } else {
        showCompleted.checked = true;
    }

    showCompleted.addEventListener("change", function () {

        localStorage.setItem(
            "taskflowShowCompleted",
            showCompleted.checked
        );

        displayTasks();

    });

}
// SAVE TASKS
function saveTasks() {

    if (!autoSave || autoSave.checked) {

        localStorage.setItem(
            taskStorageKey,
            JSON.stringify(tasks)
        );

    }

}
// DISPLAY TASKS
function displayTasks() {

    if (!taskList) {
        return;
    }

    taskList.innerHTML = "";


    const filteredTasks =
        tasks.filter(function (task) {

            // Search

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );

            if (!matchesSearch) {
                return false;
            }


            // Pending filter

            if (
                currentFilter === "pending" &&
                task.completed
            ) {
                return false;
            }


            // Completed filter

            if (
                currentFilter === "completed" &&
                !task.completed
            ) {
                return false;
            }


            // Show completed setting

            if (
                showCompleted &&
                !showCompleted.checked &&
                task.completed
            ) {
                return false;
            }


            return true;

        });
// NO TASKS
    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <li class="no-tasks">
                No tasks found.
            </li>
        `;

        updateStats();

        return;
    }
// CREATE TASK ITEMS
    filteredTasks.forEach(function (task) {

        const originalIndex =
            tasks.indexOf(task);


        const taskItem =
            document.createElement("li");

        taskItem.className =
            "task-item";


        taskItem.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                data-index="${originalIndex}"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">

                <span class="task-text ${
                    task.completed ? "completed" : ""
                }">
                    ${escapeHTML(task.text)}
                </span>

                ${
                    task.date
                        ? `
                            <span class="task-date">
                                ${formatDate(task.date)}
                            </span>
                          `
                        : ""
                }

            </div>

            <button
                class="delete-btn"
                type="button"
                data-index="${originalIndex}"
                title="Delete task">

                <i class="fa-solid fa-trash"></i>

            </button>

        `;


        taskList.appendChild(taskItem);

    });


    updateStats();

}
// ESCAPE HTML
function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
// FORMAT DATE
function formatDate(date) {

    if (!date) {
        return "";
    }

    const dateObject =
        new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}
// ADD TASK
if (addTaskBtn) {

    addTaskBtn.addEventListener(
        "click",
        function () {

            const taskText =
                taskInput.value.trim();

            const date =
                taskDate.value;


            if (taskText === "") {

                alert("Please enter a task.");

                return;

            }


            const newTask = {

                text: taskText,

                date: date,

                completed: false

            };


            tasks.push(newTask);

            saveTasks();

            displayTasks();


            taskInput.value = "";

            taskDate.value = "";

        }
    );

}
// ENTER KEY
if (taskInput) {

    taskInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                if (addTaskBtn) {
                    addTaskBtn.click();
                }

            }

        }
    );

}
// COMPLETE TASK
if (taskList) {

    taskList.addEventListener(
        "change",
        function (event) {

            if (
                event.target.classList.contains(
                    "task-checkbox"
                )
            ) {

                const index =
                    Number(
                        event.target.dataset.index
                    );


                if (tasks[index]) {

                    tasks[index].completed =
                        event.target.checked;

                    saveTasks();

                    displayTasks();

                }

            }

        }
    );

}
// DELETE TASK
if (taskList) {

    taskList.addEventListener(
        "click",
        function (event) {

            const deleteButton =
                event.target.closest(
                    ".delete-btn"
                );


            if (!deleteButton) {
                return;
            }


            const index =
                Number(
                    deleteButton.dataset.index
                );


            if (!tasks[index]) {
                return;
            }


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this task?"
                );


            if (!confirmDelete) {
                return;
            }


            tasks.splice(index, 1);

            saveTasks();

            displayTasks();

        }
    );

}
// FILTER BUTTONS
filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(
                function (btn) {

                    btn.classList.remove("active");

                }
            );


            button.classList.add("active");


            currentFilter =
                button.dataset.filter;


            displayTasks();

        }
    );

});
// SEARCH
if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            searchTerm =
                searchInput.value.trim();

            displayTasks();

        }
    );

}
// UPDATE STATISTICS
function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const pending =
        total - completed;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    // Percentage

    if (progressPercentage) {

        progressPercentage.textContent =
            percentage + "%";

    }


    // Progress bar text

    if (progressBarText) {

        progressBarText.textContent =
            percentage + "%";

    }


    // Progress bar

    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }
    // Total
if (progressTotal) {

        progressTotal.textContent =
            total;

    }
        // Completed
if (progressCompleted) {

        progressCompleted.textContent =
            completed;

    }
    // Pending
if (progressPending) {

        progressPending.textContent =
            pending;

    }
    // Progress message
if (progressMessage) {

        if (total === 0) {

            progressMessage.textContent =
                "Start adding tasks to track your progress.";

        }

        else if (percentage === 100) {

            progressMessage.textContent =
                "Amazing! You completed all your tasks.";

        }

        else if (percentage >= 75) {

            progressMessage.textContent =
                "Great work! You're almost there.";

        }

        else if (percentage >= 50) {

            progressMessage.textContent =
                "You're doing well. Keep going!";

        }

        else {

            progressMessage.textContent =
                "Keep working on your tasks.";

        }

    }

}
// START BUTTON
if (startBtn) {

    startBtn.addEventListener(
        "click",
        function () {

            const tasksSection =
                document.getElementById("tasks");


            if (tasksSection) {

                tasksSection.scrollIntoView({
                    behavior: "smooth"
                });

            }


            if (taskInput) {

                setTimeout(
                    function () {

                        taskInput.focus();

                    },
                    500
                );

            }

        }
    );

}
// CLEAR ALL TASKS
if (clearTasksBtn) {

    clearTasksBtn.addEventListener(
        "click",
        function () {

            if (tasks.length === 0) {

                alert(
                    "There are no tasks to clear."
                );

                return;

            }


            const confirmClear =
                confirm(
                    "Are you sure you want to clear all your tasks?"
                );


            if (!confirmClear) {
                return;
            }


            tasks = [];

            saveTasks();

            displayTasks();

        }
    );

}
// THEME
const lightModeBtn =
    document.getElementById("lightModeBtn");

const darkModeBtn =
    document.getElementById("darkModeBtn");


const savedTheme =
    localStorage.getItem("taskflowTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");


    if (darkModeBtn) {

        darkModeBtn.classList.add("active");

    }


    if (lightModeBtn) {

        lightModeBtn.classList.remove("active");

    }

}


if (lightModeBtn) {

    lightModeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.remove(
                "dark-mode"
            );


            localStorage.setItem(
                "taskflowTheme",
                "light"
            );


            lightModeBtn.classList.add(
                "active"
            );


            if (darkModeBtn) {

                darkModeBtn.classList.remove(
                    "active"
                );

            }

        }
    );

}


if (darkModeBtn) {

    darkModeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.add(
                "dark-mode"
            );


            localStorage.setItem(
                "taskflowTheme",
                "dark"
            );


            darkModeBtn.classList.add(
                "active"
            );


            if (lightModeBtn) {

                lightModeBtn.classList.remove(
                    "active"
                );

            }

        }
    );

}
//logout
const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            // Remove only the login session

            localStorage.removeItem(
                "taskflowCurrentUser"
            );


            // Keep account and tasks

            window.location.href =
                "home.html";

        }
    );

}
//ripple effect
const rippleButtons =
    document.querySelectorAll("button");


rippleButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function (event) {

            const ripple =
                document.createElement("span");


            ripple.classList.add("ripple");


            const rect =
                button.getBoundingClientRect();


            const size =
                Math.max(
                    rect.width,
                    rect.height
                );


            ripple.style.width =
                size + "px";

            ripple.style.height =
                size + "px";


            ripple.style.left =
                event.clientX -
                rect.left -
                size / 2 +
                "px";


            ripple.style.top =
                event.clientY -
                rect.top -
                size / 2 +
                "px";


            button.appendChild(ripple);


            setTimeout(
                function () {

                    ripple.remove();

                },
                600
            );

        }
    );

});
displayTasks();

updateStats();