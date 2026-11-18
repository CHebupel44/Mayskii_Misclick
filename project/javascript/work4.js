/* звездочки и сердечко */
function rate(value) {
    document.querySelectorAll(".rating button").forEach((star, i) => {
        star.classList.toggle("active", i < value);
    });

    document.getElementById("rating-text").textContent =
        `Ваша оценка: ${value} из 5`;
}

function toggleLike(button) {
    const liked = button.classList.toggle("liked");
    const count = button.querySelector(".like-count");

    count.textContent = Number(count.textContent) + (liked ? 1 : -1);
    button.querySelector(".heart").textContent = liked ? "♥" : "♡";
    button.setAttribute("aria-pressed", liked);
}