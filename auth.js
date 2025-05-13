
const USER = "admin";
const PASS = "1234";

function checkAuth() {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (username === USER && password === PASS) {
        localStorage.setItem("loggedIn", true);
        window.location.href = "home.html";
      } else {
        document.getElementById("loginError").innerText = "Invalid username or password.";
      }
    });
  }
} else {
  checkAuth();
}
