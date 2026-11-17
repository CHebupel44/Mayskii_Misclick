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

const guestAvatar = "data:image/svg+xml," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130">
        <rect width="130" height="130" fill="#d9d9d9"/>
        <circle cx="65" cy="45" r="24" fill="#888"/>
        <path d="M15 130v-13a50 50 0 0 1 100 0v13" fill="#888"/>
    </svg>
`);

const sidebarAvatar = document.getElementById("sidebar-avatar");
const originalAvatar = sidebarAvatar?.getAttribute("src");

function updateSidebar() {
    if (!sidebarAvatar) return;

    const auth = readAuth();
    const action = document.getElementById("sidebar-action");

    sidebarAvatar.src = auth.loggedIn ? originalAvatar : guestAvatar;
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