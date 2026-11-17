const registerForm = document.getElementById("register-form");
const registerPassword = document.getElementById("register-password");
const registerRepeat = document.getElementById("register-repeat");

function checkPasswords() {
    registerRepeat.setCustomValidity(
        registerPassword.value === registerRepeat.value
            ? ""
            : "Пароли не совпадают"
    );
}

registerPassword.oninput = checkPasswords;
registerRepeat.oninput = checkPasswords;

registerForm.onsubmit = event => {
    event.preventDefault();

    const name = document.getElementById("register-name").value.trim();

    if (!name) {
        document.getElementById("register-message").textContent =
            "Введите имя.";
        return;
    }

    if (saveAuth(true, name)) {
        location.href = "index.html";
    }
};

document.querySelectorAll(".login-methods button").forEach(button => {
    button.onclick = () => {
        document.getElementById("register-message").textContent =
            "Этот способ входа пока не подключён.";
    };
});