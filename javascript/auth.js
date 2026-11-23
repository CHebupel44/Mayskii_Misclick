const authKey = "web-project-auth";

function readAuth() {
    try {
        return JSON.parse(sessionStorage.getItem(authKey))
            || { loggedIn: true, name: "Александр" };
    } catch (error) {
        return { loggedIn: true, name: "Александр" };
    }
}

function saveAuth(loggedIn, name = "Александр") {
    try {
        sessionStorage.setItem(authKey, JSON.stringify({ loggedIn, name }));
        return true;
    } catch (error) {
        alert("Браузер не разрешает сохранить состояние входа.");
        return false;
    }
}

const sidebarAvatar = document.getElementById("sidebar-avatar");
const originalAvatar = sidebarAvatar?.getAttribute("src");

function updateSidebar() {
    if (!sidebarAvatar) return;

    const auth = readAuth();
    const action = document.getElementById("sidebar-action");

    sidebarAvatar.src = auth.loggedIn ? originalAvatar : sidebarAvatar.dataset.guestSrc;
    sidebarAvatar.alt = auth.loggedIn ? "Аватар профиля" : "Аватар гостя";

    document.getElementById("sidebar-name").textContent =
        auth.loggedIn ? auth.name : "Гость";

    document.getElementById("sidebar-profile").hidden = !auth.loggedIn;
    document.getElementById("sidebar-works").hidden = !auth.loggedIn;

    action.textContent = auth.loggedIn ? "Выйти" : "Зарегистрироваться";
    action.classList.toggle("guest-action", !auth.loggedIn);

    action.onclick = event => {
        if (!readAuth().loggedIn) return;

        event.preventDefault();

        if (saveAuth(false)) {
            try {
                sessionStorage.removeItem("web-project-tasks");
            } catch (error) {}

            updateSidebar();
        }
    };
}

updateSidebar();
window.addEventListener("pageshow", updateSidebar);