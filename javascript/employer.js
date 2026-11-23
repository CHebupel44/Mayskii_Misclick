const employers = [
    {
        id: 1,
        name: "Евкакий",
        organization: "Кофейня «Зёрна»",
        phone: "+7 (000) 000-00-01",
        email: "akakiy@example.com",
        description: "Небольшая кофейня. Ищем разработчиков для создания удобного сайта с меню, контактами и информацией о нашей организации."
    },
    {
        id: 2,
        name: "Максим шабанов",
        organization: "Магазин «Городская одежда»",
        phone: "+7 (000) 000-00-02",
        email: "stint@example.com",
        description: "Магазин повседневной одежды. Хотим развивать онлайн-каталог и сотрудничать с начинающими веб-разработчиками."
    },
    {
        id: 3,
        name: "Олег",
        organization: "Фотостудия «Кадр»",
        phone: "+7 (000) 000-00-03",
        email: "oleg@example.com",
        description: "Занимаемся портретной и предметной фотографией. Нужен сайт, на котором можно посмотреть наши работы, услуги и контакты."
    }
];

const pageId = Number(new URLSearchParams(location.search).get("id"));
const employer = employers.find(item => item.id === pageId);

if (!employer) {
    $("#employer-profile").textContent = "Работодатель не найден.";
} else {
    document.title = employer.organization;

    ["name", "organization", "description", "phone", "email"].forEach(key => {
        $("#employer-" + key).textContent = employer[key];
    });

    document.querySelectorAll("[data-employer-avatar]").forEach(image => {
        image.hidden = Number(image.dataset.employerAvatar) !== employer.id;
    });
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