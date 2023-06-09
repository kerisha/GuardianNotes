loginBox = document.querySelector(".sign");

loginBox.addEventListener("click", (e) => {
    e.preventDefault();
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if(username == "kerisha" && password == "admin") {
        audit_log("user_login", username, "login_view", "success", `User ${username} logged in successfully`, "web-login")
        window.location.href = "index.html";
    }
    else {
        audit_log("user_login", username, "login_view", "failure", `User ${username} failed to log in`, "web-login")
        alert("Invalid Credentials");
    }
});