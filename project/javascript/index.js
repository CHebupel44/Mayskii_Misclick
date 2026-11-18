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