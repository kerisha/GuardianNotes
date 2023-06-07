loginBox = document.querySelector(".sign");

loginBox.addEventListener("click", (e) => {
    e.preventDefault();
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if(username == "kerisha" && password == "admin") {
        window.location.href = "index.html";
    }
});