/* заполнение страницы задания */
const pageId = Number(new URLSearchParams(location.search).get("id"));
const currentTask = tasks.find(task => task.id === pageId);

if (!currentTask) {
    $("#task-page").textContent = "Задание не найдено.";
} else {
    document.title = currentTask.title;

    ["title", "description", "requirements"].forEach(key => {
        $("#task-" + key).textContent = currentTask[key];
    });

    $("#task-image").src = currentTask.image;

    const link = document.createElement("a");
    link.href = "employer.html?id=" + currentTask.id;
    link.textContent = currentTask.employer;
    $("#task-employer").replaceChildren("Работодатель: ", link);

    $("#join-button").onclick = () => {
        if (taskState.joined.includes(currentTask.id)) {
            askUnsubscribe(currentTask.id);
        } else if (changeTask(currentTask.id, "join")) {
            showNotice("Вы участвуете. Задание добавлено в профиль");
        }
    };
}

/* обновление страницы и профиля */
function render() {
    if (!currentTask) return;

    const joined = taskState.joined.includes(currentTask.id);
    $("#join-button").textContent = joined ? "Отписаться" : "Участвовать";
    $("#join-message").textContent =
        joined ? "Вы участвуете в выполнении задания." : "";
}

render();