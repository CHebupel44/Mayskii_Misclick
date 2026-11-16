/* функции поиска элементов */
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

/* слайдер */
let slideIndex = 0;

function showSlide(number) {
    const slides = $("#slides");
    if (!slides || !slides.children.length) return;

    const count = slides.children.length;
    slideIndex = (number % count + count) % count;
    slides.style.transform = `translateX(-${slideIndex * 100}%)`;

    $$(".dots button").forEach((button, i) => {
        button.classList.toggle("active", i === slideIndex);
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

const navigation = performance.getEntriesByType("navigation")[0];

try {
    if (navigation?.type === "reload") {
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
    const previous = {
        joined: [...taskState.joined],
        archived: [...taskState.archived]
    };

    taskState.joined = taskState.joined.filter(item => item !== id);
    taskState.archived = taskState.archived.filter(item => item !== id);

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
const currentTask = tasks.find(task => {
    return task.id === Number(new URLSearchParams(location.search).get("id"));
});

if ($("#task-page")) {
    if (!currentTask) {
        $("#task-page").textContent = "Задание не найдено.";
    } else {
        document.title = currentTask.title;
        const employerLine = $("#task-employer");
        const employerLink = document.createElement("a");

        employerLink.href = "employer.html?id=" + currentTask.id;
        employerLink.textContent = currentTask.employer;

        employerLine.replaceChildren("Работодатель: ", employerLink);
            "Работодатель: " + currentTask.employer;
        $("#task-image").src = currentTask.image;
        $("#task-description").textContent = currentTask.description;
        $("#task-requirements").textContent = currentTask.requirements;

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

if (archiveSection && !completedArchive) {
    completedArchive = document.createElement("div");
    completedArchive.id = "completed-archive";
    completedArchive.className = "works";
    archiveSection.appendChild(completedArchive);
}

function setupWork(card) {
    const actions = document.createElement("div");
    actions.className = "actions";

    const archiveButton = button("В архив", () => {
        if (!completedArchive) return;

        completedArchive.appendChild(card);
        archiveButton.hidden = true;
        restoreButton.hidden = false;
        deleteButton.hidden = false;
        render();
        showNotice("Работа добавлена в архив");
    });

    const restoreButton = button("Восстановить", () => {
        readyWorks.appendChild(card);
        archiveButton.hidden = false;
        restoreButton.hidden = true;
        deleteButton.hidden = true;
        render();
        showNotice("Работа возвращена в готовые");
    });

    const deleteButton = button("Удалить", () => {
        card.remove();
        render();
        showNotice("Работа удалена");
    });

    restoreButton.hidden = true;
    deleteButton.hidden = true;

    actions.append(archiveButton, restoreButton, deleteButton);
    card.appendChild(actions);
}

readyWorks?.querySelectorAll(".work").forEach(setupWork);

/* добавление пустой работы */
if ($("#add-work") && readyWorks) {
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

    $$(".profile-tabs button").forEach(tab => {
        const active = tab.dataset.filter === selectedFilter;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", active);

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

    [
        ["in-progress", taskState.joined, false],
        ["archived-tasks", taskState.archived, true]
    ].forEach(([id, list, archived]) => {
        const container = document.getElementById(id);
        if (!container) return;

        container.replaceChildren();

        tasks.filter(task => list.includes(task.id)).forEach(task => {
            container.appendChild(taskCard(task, archived));
        });
    });

    if ($("#empty-progress")) {
        $("#empty-progress").hidden = !!$("#in-progress")?.children.length;
    }

    if ($("#empty-archive")) {
        $("#empty-archive").hidden =
            !!archiveSection?.querySelector(".work, .task");
    }

    updateTabs();
}

render();

/* при возврате кнопкой "Назад"" читаем актуальное участие */
window.addEventListener("pageshow", () => {
    taskState = readTasks();
    render();
});

function hideOtherProfileControls() {
    const file = location.pathname.split("/").pop();

    if (file !== "user2.html" && file !== "user3.html") return;

    document.body.classList.add("other-profile");

    document.querySelectorAll(
        '.profile-group[data-status="done"] .archive-work'
    ).forEach(button => button.remove());
}

hideOtherProfileControls();

const employers = [
    {
        id: 1,
        name: "Евкакий",
        organization: "Кофейня «Зёрна»",
        phone: "+7 (000) 000-00-01",
        email: "akakiy@example.com",
        avatar: "file:///C:/Users/ArtVeles/Desktop/project/images/evkakiy.jpg",
        description: "Небольшая кофейня. Ищем разработчиков для создания удобного сайта с меню, контактами и информацией о нашей организации."
    },
    {
        id: 2,
        name: "Максим шабанов",
        organization: "Магазин «Городская одежда»",
        phone: "+7 (000) 000-00-02",
        email: "stint@example.com",
        avatar: "file:///C:/Users/ArtVeles/Desktop/project/images/stint.webp",
        description: "Магазин повседневной одежды. Хотим развивать онлайн-каталог и сотрудничать с начинающими веб-разработчиками."
    },
    {
        id: 3,
        name: "Олег",
        organization: "Фотостудия «Кадр»",
        phone: "+7 (000) 000-00-03",
        email: "oleg@example.com",
        avatar: "file:///C:/Users/ArtVeles/Desktop/project/images/oleg.webp",
        description: "Занимаемся портретной и предметной фотографией. Нужен сайт, на котором можно посмотреть наши работы, услуги и контакты."
    }
];

if ($("#employer-profile")) {
    const id = Number(new URLSearchParams(location.search).get("id"));
    const employer = employers.find(item => item.id === id);

    if (!employer) {
        $("#employer-profile").textContent = "Работодатель не найден.";
    } else {
        document.title = employer.organization;

        $("#employer-name").textContent = employer.name;
        $("#employer-organization").textContent = employer.organization;
        $("#employer-avatar").src = employer.avatar;
        $("#employer-description").textContent = employer.description;

        const phone = $("#employer-phone");
        phone.textContent = employer.phone;
        phone.href = "tel:" + employer.phone.replace(/[^\d+]/g, "");

        const email = $("#employer-email");
        email.textContent = employer.email;
        email.href = "mailto:" + employer.email;
    }
}

if ($("#active-cases")) {
    const employerId = Number(
        new URLSearchParams(location.search).get("id")
    );

    const employer = employers.find(item => item.id === employerId);

    const activeTasks = employer
        ? tasks.filter(task => task.employer === employer.name)
        : [];

    activeTasks.forEach(task => {
        const card = document.createElement("a");
        card.className = "task";
        card.href = "task.html?id=" + task.id;

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description;

        const name = document.createElement("p");
        name.className = "employer";
        name.textContent = "Работодатель: " + task.employer;

        card.append(title, description, name);
        $("#active-cases").appendChild(card);
    });

    $("#active-case-count").textContent = activeTasks.length;
    $("#empty-active-cases").hidden = activeTasks.length > 0;

    $$(".case-tabs button").forEach(button => {
        button.setAttribute(
            "aria-pressed",
            button.classList.contains("active")
        );

        button.onclick = () => {
            const selected = button.dataset.case;

            $$(".case-tabs button").forEach(tab => {
                const active = tab.dataset.case === selected;
                tab.classList.toggle("active", active);
                tab.setAttribute("aria-pressed", active);
            });

            $$("[data-case-section]").forEach(section => {
                section.hidden =
                    section.dataset.caseSection !== selected;
            });
        };
    });
}