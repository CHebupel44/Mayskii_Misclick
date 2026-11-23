/* слайдер */
let slideIndex = 0;

function showSlide(number) {
    const slides = document.getElementById("slides");
    const count = slides.children.length;

    slideIndex = (number % count + count) % count;
    slides.style.transform = `translateX(-${slideIndex * 100}%)`;

    document.querySelectorAll(".dots button").forEach((tab, i) => {
        tab.classList.toggle("active", i === slideIndex);
    });
}

function changeSlide(step) {
    showSlide(slideIndex + step);
}

const avatarButton = document.getElementById("avatar-button");
const profileMenu = document.getElementById("profile-menu");
const mobileAction = document.getElementById("mobile-account-action");

function updateMobileAccount() {
    const auth = readAuth();

    document.getElementById("mobile-avatar").src =
        document.getElementById("sidebar-avatar").src;

    document.getElementById("mobile-profile").hidden = !auth.loggedIn;

    mobileAction.textContent =
        auth.loggedIn ? "Выйти" : "Зарегистрироваться";

    mobileAction.classList.toggle("guest-action", !auth.loggedIn);

    if (!auth.loggedIn) {
        document.getElementById("work-filter").value = "all";
    }

    filterWorks();
}

avatarButton.onclick = () => {
    updateMobileAccount();
    profileMenu.showModal();
};

document.getElementById("close-profile-menu").onclick = () => {
    profileMenu.close();
};

profileMenu.addEventListener("click", event => {
    if (event.target !== profileMenu) return;

    const box = profileMenu.getBoundingClientRect();

    if (
        event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom
    ) {
        profileMenu.close();
    }
});

mobileAction.onclick = event => {
    if (!readAuth().loggedIn) return;

    event.preventDefault();

    document.getElementById("sidebar-action").click();
    updateMobileAccount();
    profileMenu.close();
};

document.getElementById("large-text").onchange = event => {
    document.body.classList.toggle("large-text", event.target.checked);
};

function filterWorks() {
    const query = document.getElementById("work-search")
        .value.trim().toLowerCase();

    const filter = document.getElementById("work-filter").value;
    const loggedIn = readAuth().loggedIn;
    const works = document.getElementById("main-works");
    const cards = [...works.children];
    cards.forEach((card, index) => {
    card.dataset.order ??= index;
});

cards.sort((a, b) => {
    const likes = card =>
        Number(card.querySelector("p")?.textContent.match(/Лайки:\s*(\d+)/i)?.[1] || 0);

    return filter === "popular"
        ? likes(b) - likes(a)
        : Number(a.dataset.order) - Number(b.dataset.order);
});

cards.forEach(card => works.append(card));
    let visible = 0;

    document.querySelectorAll("#main-works .work").forEach(card => {
        const mine = loggedIn && !!card.querySelector('a[href="user1.html"]');
        const matchesText = card.textContent.toLowerCase().includes(query);

        const matchesFilter =
            filter === "all" ||
            filter === "popular" ||
            (filter === "mine" && mine) ||
            (filter === "others" && !mine);

        card.hidden = !(matchesText && matchesFilter);
        if (!card.hidden) visible++;
    });

    document.getElementById("no-works").hidden = visible > 0;
}

document.getElementById("work-search").oninput = filterWorks;
document.getElementById("work-filter").onchange = filterWorks;

window.addEventListener("pageshow", updateMobileAccount);

window.matchMedia("(max-width: 700px)").addEventListener("change", event => {
    if (!event.matches) {
        profileMenu.close();
        document.getElementById("work-search").value = "";
        document.getElementById("work-filter").value = "all";
        filterWorks();
    }
});

updateMobileAccount();