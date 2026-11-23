/* вкладки в профиле */
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
    selectTabs(".profile-tabs", selectedFilter, "data-filter");

    $$(".profile-tabs button").forEach(tab => {
        const counter = tab.querySelector("span");
        if (counter) counter.textContent = counts[tab.dataset.filter];
    });
}

updateTabs();