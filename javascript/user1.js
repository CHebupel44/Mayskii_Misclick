/* иарточка задания в профиле */
function taskCard(task, archived) {
    const card = document.createElement("article");
    card.className = "task";

    /* здесь используются только тексты из массива tasks */
    card.innerHTML = `
        <span class="tag">${archived ? "В архиве" : "В процессе"}</span>
        <a href="task.html?id=${task.id}"><h3>${task.title}</h3></a>
        <p class="employer">Работодатель: ${task.employer}</p>
        <div class="actions"></div>
    `;

    const actions = card.querySelector(".actions");

    if (archived) {
        actions.append(
            button("Восстановить", () => {
                if (changeTask(task.id, "join")) {
                    showNotice("Задание возвращено в работы в процессе");
                }
            }),
            button("Удалить", () => {
                if (changeTask(task.id, "delete")) {
                    showNotice("Задание удалено из архива");
                }
            })
        );
    } else {
        actions.append(button("Отписаться", () => askUnsubscribe(task.id)));
    }

    return card;
}

/* готовые работы перемещаем сами карточки без копирования */
const readyWorks = $('.profile-group[data-status="done"] .works');
const archiveSection = $('.profile-group[data-status="archive"]');

const completedArchive = document.createElement("div");
completedArchive.id = "completed-archive";
completedArchive.className = "works";
archiveSection.appendChild(completedArchive);

function setupWork(card) {
    const actions = document.createElement("div");
    actions.className = "actions";

    function moveWork(archived) {
        (archived ? completedArchive : readyWorks).appendChild(card);
        archiveButton.hidden = archived;
        restoreButton.hidden = deleteButton.hidden = !archived;

        render();
        showNotice(archived
            ? "Работа добавлена в архив"
            : "Работа возвращена в готовые");
    }

    const archiveButton = button("В архив", () => moveWork(true));
    const restoreButton = button("Восстановить", () => moveWork(false));
    const deleteButton = button("Удалить", () => {
        card.remove();
        render();
        showNotice("Работа удалена");
    });

    restoreButton.hidden = deleteButton.hidden = true;
    actions.append(archiveButton, restoreButton, deleteButton);
    card.appendChild(actions);
}

readyWorks.querySelectorAll(".work").forEach(setupWork);

/* добавление пустой работы */
$("#add-work").onclick = () => {
    const card = document.createElement("article");
    card.className = "work";
    card.innerHTML = `
        <div class="empty-work-image" role="img"
             aria-label="Серая картинка"></div>
        <h3>Пустая работа</h3>
    `;

    readyWorks.appendChild(card);
    setupWork(card);
    selectedFilter = "done";
    render();
};

/* обновление страницы и профиля */
function render() {
    [
        ["in-progress", taskState.joined, false],
        ["archived-tasks", taskState.archived, true]
    ].forEach(([id, list, archived]) => {
        document.getElementById(id).replaceChildren(
            ...tasks.filter(task => list.includes(task.id))
                .map(task => taskCard(task, archived))
        );
    });

    $("#empty-progress").hidden = !!$("#in-progress").children.length;
    $("#empty-archive").hidden =
        !!archiveSection.querySelector(".work, .task");

    updateTabs();
}

render();