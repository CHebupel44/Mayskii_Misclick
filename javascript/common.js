/* функции поиска элементов */
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

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

/* вкладки */
function selectTabs(selector, value, attribute) {
    $$(selector + " button").forEach(tab => {
        const active = tab.getAttribute(attribute) === value;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", active);
    });
}