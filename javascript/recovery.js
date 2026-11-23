const contact = document.getElementById("contact");
const password = document.getElementById("new-password");
const repeat = document.getElementById("repeat-password");

const steps = [
    "contact-step",
    "confirmation-step",
    "password-step"
];

const titles = [
    "Восстановление пароля",
    "Подтверждение",
    "Смена пароля"
];

let currentStep = 0;

function showStep(number) {
    currentStep = number;

    steps.forEach((id, index) => {
        document.getElementById(id).hidden = index !== number;
    });

    document.getElementById("recovery-title").textContent = titles[number];

    document.querySelector(
        "#" + steps[number] + " input, #" + steps[number] + " a"
    )?.focus();
}

document.querySelectorAll(".auth-tabs button").forEach(button => {
    button.onclick = () => {
        const byPhone = button.dataset.method === "phone";

        contact.type = byPhone ? "tel" : "email";
        contact.autocomplete = byPhone ? "tel" : "email";
        contact.value = "";

        if (byPhone) {
            contact.setAttribute("pattern", "\\+?[0-9 ()\\-]{10,20}");
            contact.title = "Введите номер телефона";
        } else {
            contact.removeAttribute("pattern");
            contact.removeAttribute("title");
        }

        document.getElementById("contact-label").textContent =
            byPhone ? "Телефон" : "Почта:";

        document.querySelectorAll(".auth-tabs button").forEach(tab => {
            const active = tab === button;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", active);
        });
    };
});

document.getElementById("contact-form").onsubmit = event => {
    event.preventDefault();

    document.getElementById("recovery-code-form").reset();
    document.getElementById("recovery-message").textContent = "";

    showStep(1);
};

document.getElementById("recovery-code-form").onsubmit = event => {
    event.preventDefault();

    if (document.getElementById("recovery-code").value !== "123456") {
        document.getElementById("recovery-message").textContent =
            "Неверный код. Введите 123456.";
        return;
    }

    showStep(2);
};

function checkPasswords() {
    repeat.setCustomValidity(
        password.value === repeat.value ? "" : "Пароли не совпадают"
    );
}

password.oninput = checkPasswords;
repeat.oninput = checkPasswords;

document.getElementById("new-password-form").onsubmit = event => {
    event.preventDefault();

    password.value = "";
    repeat.value = "";

    location.href = "login.html";
};

document.querySelector(".auth-back").onclick = event => {
    if (currentStep > 0) {
        event.preventDefault();
        showStep(currentStep === 3 ? 0 : currentStep - 1);
    }
};