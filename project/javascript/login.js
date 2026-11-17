const loginForm = document.getElementById("login-form");
const codeForm = document.getElementById("code-form");
const codeInputs = [...document.querySelectorAll(".code-inputs input")];

let loginMethod = "password";

function showCodeStep(show) {
    document.getElementById("login-step").hidden = show;
    codeForm.hidden = !show;

    document.getElementById("auth-title").textContent =
        show ? "Подтверждение" : "Авторизация";

    codeInputs.forEach(input => {
        input.disabled = !show;
    });

    if (show) codeInputs[0].focus();
}

document.querySelectorAll(".auth-tabs button").forEach(button => {
    button.onclick = () => {
        loginMethod = button.dataset.method;
        const byPhone = loginMethod === "phone";

        document.getElementById("password-fields").hidden = byPhone;
        document.getElementById("phone-fields").hidden = !byPhone;

        document.querySelectorAll("#password-fields input").forEach(input => {
            input.disabled = byPhone;
        });

        document.getElementById("phone").disabled = !byPhone;
        document.getElementById("login-submit").textContent =
            byPhone ? "Далее" : "Войти";

        document.getElementById("login-message").textContent = "";

        document.querySelectorAll(".auth-tabs button").forEach(tab => {
            const active = tab === button;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", active);
        });
    };
});

function finishLogin() {
    if (saveAuth(true, readAuth().name)) {
        location.href = "index.html";
    }
}

loginForm.onsubmit = event => {
    event.preventDefault();

    if (loginMethod === "phone") {
        codeForm.reset();
        document.getElementById("code-message").textContent = "";
        showCodeStep(true);
    } else {
        finishLogin();
    }
};

codeInputs.forEach((input, index) => {
    input.oninput = () => {
        input.value = input.value.replace(/\D/g, "");

        if (input.value) {
            codeInputs[index + 1]?.focus();
        }
    };

    input.onkeydown = event => {
        if (event.key === "Backspace" && !input.value) {
            codeInputs[index - 1]?.focus();
        }
    };
});

codeForm.onsubmit = event => {
    event.preventDefault();

    const code = codeInputs.map(input => input.value).join("");

    if (code === "123456") {
        finishLogin();
    } else {
        document.getElementById("code-message").textContent =
            "Неверный код. Для демонстрации введите 123456.";
    }
};

document.getElementById("resend-code").onclick = () => {
    document.getElementById("code-message").textContent =
        "SMS не отправляется. Демонстрационный код: 123456.";
};

document.querySelectorAll(".forgot:not(#resend-code), .login-methods button")
    .forEach(button => {
        button.onclick = () => {
            document.getElementById("login-message").textContent =
                "Эта функция пока не подключена.";
        };
    });

document.querySelector(".auth-back").onclick = event => {
    if (!codeForm.hidden) {
        event.preventDefault();
        showCodeStep(false);
    }
};