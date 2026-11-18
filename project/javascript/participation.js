/* функция сохранения когда нажимаешь на кнопку участвовать чтобы отображалось норм в профиел */
const storageKey = "web-project-tasks";

try {
    if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
        sessionStorage.removeItem(storageKey);
    }
} catch (error) {}

function readTasks() {
    try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey));
        return {
            joined: Array.isArray(saved?.joined) ? saved.joined : [],
            archived: Array.isArray(saved?.archived) ? saved.archived : []
        };
    } catch (error) {
        return { joined: [], archived: [] };
    }
}

let taskState = readTasks();

function saveTasks() {
    try {
        sessionStorage.setItem(storageKey, JSON.stringify(taskState));
        return true;
    } catch (error) {
        showNotice("Браузер не разрешает сохранять участие между страницами.");
        return false;
    }
}

/* участие восстановление и удаление задания */
function changeTask(id, action) {
    const previous = taskState;

    taskState = {
        joined: previous.joined.filter(item => item !== id),
        archived: previous.archived.filter(item => item !== id)
    };

    if (action === "join") taskState.joined.push(id);
    if (action === "archive") taskState.archived.push(id);

    if (!saveTasks()) {
        taskState = previous;
        return false;
    }

    render();
    return true;
}

/* модалка потдверждения отписки */
const modal = document.createElement("dialog");
modal.className = "unsubscribe-modal";
modal.innerHTML = `
    <p>Точно ли вы хотите отписаться от данной работы?</p>
    <div class="modal-buttons"></div>
`;
document.body.appendChild(modal);

let unsubscribeId = null;

modal.querySelector(".modal-buttons").append(
    button("Да", () => {
        if (unsubscribeId === null) return;

        if (changeTask(unsubscribeId, "archive")) {
            modal.close();
            showNotice("Вы успешно отписались. Задание перенесено в архив");
        }
    }, ""),
    button("Нет", () => modal.close(), "")
);

modal.addEventListener("close", () => unsubscribeId = null);

function askUnsubscribe(id) {
    unsubscribeId = id;
    modal.showModal();
}

/* при возврате кнопкой "Назад"" читаем актуальное участие */
window.addEventListener("pageshow", () => {
    taskState = readTasks();
    render();
});