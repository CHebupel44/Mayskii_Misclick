/* функции поиска элементов */
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const page = location.pathname.split("/").pop();
const isMyProfile = page === "user1.html";
const pageId = Number(new URLSearchParams(location.search).get("id"));

if (page === "user2.html" || page === "user3.html") {
    document.body.classList.add("other-profile");
}

/* слайдер */
let slideIndex = 0;

function showSlide(number) {
    const slides = $("#slides");
    if (!slides?.children.length) return;

    const count = slides.children.length;
    slideIndex = (number % count + count) % count;
    slides.style.transform = `translateX(-${slideIndex * 100}%)`;

    $$(".dots button").forEach((tab, i) => {
        tab.classList.toggle("active", i === slideIndex);
    });
}

function changeSlide(step) {
    showSlide(slideIndex + step);
}

/* звездочки и сердечко */
function rate(value) {
    $$(".rating button").forEach((star, i) => {
        star.classList.toggle("active", i < value);
    });

    if ($("#rating-text")) {
        $("#rating-text").textContent = `Ваша оценка: ${value} из 5`;
    }
}

function toggleLike(button) {
    const liked = button.classList.toggle("liked");
    const count = button.querySelector(".like-count");

    count.textContent = Number(count.textContent) + (liked ? 1 : -1);
    button.querySelector(".heart").textContent = liked ? "♥" : "♡";
    button.setAttribute("aria-pressed", liked);
}

/* задания */
const tasks = [
    {
        id: 1,
        title: "Сайт для кофейни",
        employer: "Евкакий",
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200",
        description: "Создать одностраничный сайт для небольшой кофейни.",
        requirements: "Добавить описание кофейни, меню с ценами, контакты и время работы. Сделать удобное отображение на телефоне."
    },
    {
        id: 2,
        title: "Каталог товаров",
        employer: "Максим Шабанов",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
        description: "Разработать каталог одежды с фотографиями и ценами.",
        requirements: "Создать минимум шесть карточек товаров, добавить поиск по названию и описание товаров. Адаптировать каталог под телефон."
    },
    {
        id: 3,
        title: "Портфолио фотографа",
        employer: "Олег",
        image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200",
        description: "Создать сайт для представления работ фотографа.",
        requirements: "Добавить галерею, информацию о фотографе, описание услуг и контакты. Сделать адаптивную вёрстку."
    }
];

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

/* уведы */
let noticeTimer;

function showNotice(text) {
    let notice = $("#notice");

    if (!notice) {
        notice = document.createElement("div");
        notice.id = "notice";
        notice.className = "notice";
        notice.setAttribute("role", "status");
        document.body.appendChild(notice);
    }

    notice.textContent = text;
    notice.hidden = false;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => notice.hidden = true, 3500);
}

/* кнопки */
function button(text, action, className = "archive-work") {
    const element = document.createElement("button");
    element.type = "button";
    element.className = className;
    element.textContent = text;
    element.onclick = action;
    return element;
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

/* заполнение страницы задания */
const currentTask = tasks.find(task => task.id === pageId);

if ($("#task-page")) {
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
}

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
let completedArchive = $("#completed-archive");

if (isMyProfile && archiveSection && !completedArchive) {
    completedArchive = document.createElement("div");
    completedArchive.id = "completed-archive";
    completedArchive.className = "works";
    archiveSection.appendChild(completedArchive);
}

function setupWork(card) {
    if (!isMyProfile) return;

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

readyWorks?.querySelectorAll(".work").forEach(setupWork);

/* добавление пустой работы */
if (isMyProfile && $("#add-work") && readyWorks) {
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
}

/* вкладки */
let selectedFilter = "all";

function selectTabs(selector, value, attribute) {
    $$(selector + " button").forEach(tab => {
        const active = tab.getAttribute(attribute) === value;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", active);
    });
}

$$(".profile-tabs button").forEach(tab => {
    tab.onclick = () => {
        selectedFilter = tab.dataset.filter;
        updateTabs();
    };
});

function updateTabs() {
    const counts = { done: 0, progress: 0, archive: 0 };

    $$(".profile-group").forEach(group => {
        const status = group.dataset.status;
        counts[status] = group.querySelectorAll(".work, .task").length;
        group.hidden = selectedFilter === "all"
            ? status === "archive"
            : status !== selectedFilter;
    });

    counts.all = counts.done + counts.progress;
    selectTabs(".profile-tabs", selectedFilter, "data-filter");

    $$(".profile-tabs button").forEach(tab => {
        const counter = tab.querySelector("span");
        if (counter) counter.textContent = counts[tab.dataset.filter];
    });
}

/* обновление страницы и профиля */
function render() {
    if ($("#task-page") && currentTask) {
        const joined = taskState.joined.includes(currentTask.id);
        $("#join-button").textContent = joined ? "Отписаться" : "Участвовать";
        $("#join-message").textContent =
            joined ? "Вы участвуете в выполнении задания." : "";
    }

    if (isMyProfile) {
        [
            ["in-progress", taskState.joined, false],
            ["archived-tasks", taskState.archived, true]
        ].forEach(([id, list, archived]) => {
            const container = document.getElementById(id);
            if (!container) return;

            container.replaceChildren(
                ...tasks.filter(task => list.includes(task.id))
                    .map(task => taskCard(task, archived))
            );
        });

        if ($("#empty-progress")) {
            $("#empty-progress").hidden = !!$("#in-progress")?.children.length;
        }

        if ($("#empty-archive")) {
            $("#empty-archive").hidden =
                !!archiveSection?.querySelector(".work, .task");
        }
    }

    updateTabs();
}

render();

/* при возврате кнопкой "Назад"" читаем актуальное участие */
window.addEventListener("pageshow", () => {
    taskState = readTasks();
    render();
});

const employers = [
    {
        id: 1,
        name: "Евкакий",
        organization: "Кофейня «Зёрна»",
        phone: "+7 (000) 000-00-01",
        email: "akakiy@example.com",
        avatar: "images/evkakiy.jpg",
        description: "Небольшая кофейня. Ищем разработчиков для создания удобного сайта с меню, контактами и информацией о нашей организации."
    },
    {
        id: 2,
        name: "Максим шабанов",
        organization: "Магазин «Городская одежда»",
        phone: "+7 (000) 000-00-02",
        email: "stint@example.com",
        avatar: "images/stint.webp",
        description: "Магазин повседневной одежды. Хотим развивать онлайн-каталог и сотрудничать с начинающими веб-разработчиками."
    },
    {
        id: 3,
        name: "Олег",
        organization: "Фотостудия «Кадр»",
        phone: "+7 (000) 000-00-03",
        email: "oleg@example.com",
        avatar: "images/oleg.webp",
        description: "Занимаемся портретной и предметной фотографией. Нужен сайт, на котором можно посмотреть наши работы, услуги и контакты."
    }
];

if ($("#employer-profile")) {
    const employer = employers.find(item => item.id === pageId);

    if (!employer) {
        $("#employer-profile").textContent = "Работодатель не найден.";
    } else {
        document.title = employer.organization;

        ["name", "organization", "description", "phone", "email"].forEach(key => {
            $("#employer-" + key).textContent = employer[key];
        });

        $("#employer-avatar").src = employer.avatar;
        $("#employer-phone").href =
            "tel:" + employer.phone.replace(/[^\d+]/g, "");
        $("#employer-email").href = "mailto:" + employer.email;

        const activeTasks = tasks.filter(task => task.id === employer.id);

        $("#active-cases").replaceChildren(...activeTasks.map(task => {
            const card = document.createElement("a");
            card.className = "task";
            card.href = "task.html?id=" + task.id;
            card.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p class="employer">Работодатель: ${task.employer}</p>
            `;
            return card;
        }));

        $("#active-case-count").textContent = activeTasks.length;
        $("#empty-active-cases").hidden = activeTasks.length > 0;

        function showCases(value) {
            selectTabs(".case-tabs", value, "data-case");
            $$("[data-case-section]").forEach(section => {
                section.hidden = section.dataset.caseSection !== value;
            });
        }

        $$(".case-tabs button").forEach(tab => {
            tab.onclick = () => showCases(tab.dataset.case);
        });

        showCases("active");
    }
}

if ($("#login-form")) {
    $("#login-form").onsubmit = event => {
        event.preventDefault();
        location.href = "1.html";
    };

    $$(".forgot, .login-methods button").forEach(button => {
        button.onclick = () => {
            $("#login-message").textContent =
                "Эта функция пока не подключена.";
        };
    });
}