//admin credentials
const ADMIN_EMAIL = "adminaa2003@gmail.com";
const ADMIN_PASSWORD = "TaskFlowAdmin@123";
//get screen started
const welcomeScreen = document.getElementById("welcomeScreen");
const authScreen = document.getElementById("authScreen");
const getStartedBtn = document.getElementById("getStartedBtn");

if (getStartedBtn) {
    getStartedBtn.addEventListener("click", function () {
        welcomeScreen.classList.add("hidden");
        authScreen.classList.remove("hidden");
    });
}
//auth elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
//switch to sign up
if (showSignup) {
    showSignup.addEventListener("click", function () {

        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");

        formTitle.textContent = "Create Account";

        formSubtitle.textContent =
            "Create your TaskFlow account and get started.";
    });
}

//switch login

if (showLogin) {
    showLogin.addEventListener("click", function () {

        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");

        formTitle.textContent = "Welcome Back!";

        formSubtitle.textContent =
            "Login to continue your TaskFlow journey.";
    });
}
//password toggle
function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);
    const icon = button.querySelector("i");

    if (input.type === "password") {

        input.type = "text";

        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

    } else {

        input.type = "password";

        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}
//sign up
if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value
                .trim()
                .toLowerCase();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // Check empty fields
        if (!name || !email || !password || !confirmPassword) {

            alert("Please fill in all fields.");

            return;
        }

        // Prevent admin email from normal signup
        if (email === ADMIN_EMAIL) {

            alert(
                "This email is reserved for the administrator. Please use the admin login."
            );

            return;
        }

        // Check password match
        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }

        // Get existing users
        let users =
            JSON.parse(localStorage.getItem("taskflowUsers")) || [];

        // Check if email already exists
        const existingUser =
            users.find(function (user) {

                return user.email === email;

            });

        if (existingUser) {

            alert(
                "An account with this email already exists. Please login."
            );

            return;
        }

        // Create new user
        const newUser = {

            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        // Save users
        localStorage.setItem(
            "taskflowUsers",
            JSON.stringify(users)
        );

        // Create current user session
        localStorage.setItem(
            "taskflowCurrentUser",
            JSON.stringify({

                name: name,
                email: email,
                role: "user"

            })
        );

        alert("Account created successfully!");

        // Go to dashboard
        window.location.href = "index.html";
    });
}
//login
if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value
                .trim()
                .toLowerCase();

        const password =
            document.getElementById("loginPassword").value;
//admin login
        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem(
                "taskflowCurrentUser",
                JSON.stringify({

                    name: "Administrator",
                    email: ADMIN_EMAIL,
                    role: "admin"

                })
            );

            window.location.href = "admin.html";

            return;
        }
//normal user login
        const users =
            JSON.parse(localStorage.getItem("taskflowUsers")) || [];

        const user =
            users.find(function (user) {

                return (
                    user.email === email &&
                    user.password === password
                );

            });

        // Invalid login
        if (!user) {

            alert("Invalid email or password.");

            return;
        }

        // Create normal user session
        localStorage.setItem(
            "taskflowCurrentUser",
            JSON.stringify({

                name: user.name,
                email: user.email,
                role: "user"

            })
        );

        // Go to dashboard
        window.location.href = "index.html";
    });
}