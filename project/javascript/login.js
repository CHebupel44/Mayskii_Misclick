document.getElementById("login-form").onsubmit = event => {
    event.preventDefault();
    location.href = "index.html";
};

document.querySelectorAll(".forgot, .login-methods button").forEach(button => {
    button.onclick = () => {
        document.getElementById("login-message").textContent =
            "Эта функция пока не подключена.";
    };
});