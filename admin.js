// ================================
// ADMIN LOGIN CHECK
// ================================

const ADMIN_EMAIL = "adminaa2003@gmail.com";
const ADMIN_PASSWORD = "TaskFlowAdmin@123";

const currentUser =
    JSON.parse(localStorage.getItem("taskflowCurrentUser"));


// If nobody is logged in
if (!currentUser) {

    window.location.href = "home.html";

}


// If logged-in user is not admin
if (
    !currentUser ||
    currentUser.email !== ADMIN_EMAIL
) {

    alert("Access denied. Admin access only.");

    localStorage.removeItem("taskflowCurrentUser");

    window.location.href = "home.html";

}


// ================================
// ELEMENTS
// ================================

const totalUsers =
    document.getElementById("totalUsers");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const usersTableBody =
    document.getElementById("usersTableBody");

const userSearch =
    document.getElementById("userSearch");

const usersSection =
    document.getElementById("usersSection");

const userTasksSection =
    document.getElementById("userTasksSection");

const selectedUserTitle =
    document.getElementById("selectedUserTitle");

const selectedUserEmail =
    document.getElementById("selectedUserEmail");

const selectedTotal =
    document.getElementById("selectedTotal");

const selectedCompleted =
    document.getElementById("selectedCompleted");

const selectedPending =
    document.getElementById("selectedPending");

const userTasksTableBody =
    document.getElementById("userTasksTableBody");

const backToUsersBtn =
    document.getElementById("backToUsersBtn");

const adminLogoutBtn =
    document.getElementById("adminLogoutBtn");


// ================================
// GET USERS
// ================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("taskflowUsers")
    ) || [];

}


// ================================
// GET USER TASKS
// ================================

function getUserTasks(email) {

    const taskKey =
        "taskflowTasks_" + email;

    return JSON.parse(
        localStorage.getItem(taskKey)
    ) || [];

}


// ================================
// UPDATE OVERALL STATISTICS
// ================================

function updateStatistics() {

    const users =
        getUsers();


    let allTasks = [];


    users.forEach(function (user) {

        const userTasks =
            getUserTasks(user.email);

        allTasks =
            allTasks.concat(userTasks);

    });


    const completed =
        allTasks.filter(function (task) {

            return task.completed;

        }).length;


    const pending =
        allTasks.length - completed;


    if (totalUsers) {

        totalUsers.textContent =
            users.length;

    }


    if (totalTasks) {

        totalTasks.textContent =
            allTasks.length;

    }


    if (completedTasks) {

        completedTasks.textContent =
            completed;

    }


    if (pendingTasks) {

        pendingTasks.textContent =
            pending;

    }

}


// ================================
// DISPLAY USERS
// ================================

function displayUsers(searchTerm = "") {

    const users =
        getUsers();


    usersTableBody.innerHTML = "";


    const filteredUsers =
        users.filter(function (user) {

            const search =
                searchTerm.toLowerCase();


            return (
                user.name
                    .toLowerCase()
                    .includes(search) ||

                user.email
                    .toLowerCase()
                    .includes(search)
            );

        });


    if (filteredUsers.length === 0) {

        usersTableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="no-data"
                >
                    No users found.
                </td>
            </tr>
        `;

        return;

    }


    filteredUsers.forEach(function (user) {

        const tasks =
            getUserTasks(user.email);


        const completed =
            tasks.filter(function (task) {

                return task.completed;

            }).length;


        const pending =
            tasks.length - completed;


        const firstLetter =
            user.name
                .charAt(0)
                .toUpperCase();


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="user-info">

                    <div class="user-avatar">
                        ${escapeHTML(firstLetter)}
                    </div>

                    <div>

                        <div class="user-name">
                            ${escapeHTML(user.name)}
                        </div>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHTML(user.email)}
            </td>


            <td>
                ${tasks.length}
            </td>


            <td>

                <span class="status completed">
                    ${completed}
                </span>

            </td>


            <td>

                <span class="status pending">
                    ${pending}
                </span>

            </td>


            <td>

                <button
                    class="view-btn"
                    data-email="${escapeHTML(user.email)}"
                >
                    <i class="fa-solid fa-eye"></i>
                    View
                </button>

            </td>

        `;


        usersTableBody.appendChild(row);

    });

}


// ================================
// VIEW USER TASKS
// ================================

usersTableBody.addEventListener(
    "click",
    function (event) {

        const viewButton =
            event.target.closest(".view-btn");


        if (!viewButton) {
            return;
        }


        const email =
            viewButton.dataset.email;


        showUserTasks(email);

    }
);
function showUserTasks(email) {

    const users =
        getUsers();


    const user =
        users.find(function (user) {

            return user.email === email;

        });


    if (!user) {

        return;

    }


    const tasks =
        getUserTasks(email);


    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;


    const pending =
        tasks.length - completed;


    selectedUserTitle.textContent =
        user.name + "'s Tasks";


    selectedUserEmail.textContent =
        user.email;


    selectedTotal.textContent =
        tasks.length;


    selectedCompleted.textContent =
        completed;


    selectedPending.textContent =
        pending;


    userTasksTableBody.innerHTML = "";


    if (tasks.length === 0) {

        userTasksTableBody.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="no-data"
                >
                    This user has no tasks yet.
                </td>
            </tr>
        `;

    }


    tasks.forEach(function (task) {

        const row =
            document.createElement("tr");


        const statusClass =
            task.completed
                ? "completed"
                : "pending";


        const statusText =
            task.completed
                ? "Completed"
                : "Pending";


        row.innerHTML = `

            <td>

                <span class="status ${statusClass}">
                    ${statusText}
                </span>

            </td>


            <td>
                ${escapeHTML(task.text)}
            </td>


            <td>
                ${
                    task.date
                        ? formatDate(task.date)
                        : "No date"
                }
            </td>

        `;


        userTasksTableBody.appendChild(row);

    });


    usersSection.style.display =
        "none";


    userTasksSection.style.display =
        "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
if (backToUsersBtn) {

    backToUsersBtn.addEventListener(
        "click",
        function () {

            userTasksSection.style.display =
                "none";


            usersSection.style.display =
                "block";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}
if (userSearch) {

    userSearch.addEventListener(
        "input",
        function () {

            displayUsers(
                userSearch.value.trim()
            );

        }
    );

}
if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            localStorage.removeItem(
                "taskflowCurrentUser"
            );
window.location.href =
                "home.html";

        }
    );
}
function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;}
//format date
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
//initial load
displayUsers();

updateStatistics();