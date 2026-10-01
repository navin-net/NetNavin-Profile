const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".slide-dot")];
const currentSlideLabel = document.getElementById("current-slide");
const progressFill = document.getElementById("progress-fill");

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");

let activeIndex = -1;
let scrollFramePending = false;

document.getElementById("year").textContent = new Date().getFullYear();

// Light/dark theme
function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.dataset.theme = theme;
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
    );

    try {
        localStorage.setItem("netnavin-portfolio-theme", theme);
    } catch (error) {
        // The toggle still works if local storage is unavailable.
    }
}

let savedTheme = "light";

try {
    savedTheme =
        localStorage.getItem("netnavin-portfolio-theme") || "light";
} catch (error) {
    // Use light theme if browser storage is unavailable.
}

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const nextTheme =
        document.body.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
});

// Reveal only the main content of each slide.
// This avoids nested elements appearing to belong to another slide.
slides.forEach((slide) => {
    const revealElements =
        slide.id === "home"
            ? [
                slide.querySelector(".hero-copy"),
                slide.querySelector(".profile-area"),
                slide.querySelector(".scroll-hint"),
            ]
            : [
                slide.querySelector(".slide-inner"),
                slide.querySelector(".contact-footer"),
            ];

    revealElements.filter(Boolean).forEach((element, index) => {
        element.classList.add("reveal");
        element.style.transitionDelay = `${index * 100}ms`;
    });
});

function setActiveSlide(index) {
    if (index < 0 || index >= slides.length || index === activeIndex)
        return;

    activeIndex = index;
    document.body.dataset.slide = String(index + 1);

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    currentSlideLabel.textContent = String(index + 1).padStart(2, "0");
    progressFill.style.width = `${((index + 1) / slides.length) * 100}%`;
}

// Select the slide at the centre of the viewport.
// This is more reliable than IntersectionObserver for tall mobile slides.
function updateActiveSlide() {
    const viewportCenter = window.innerHeight / 2;

    let index = slides.findIndex((slide) => {
        const rect = slide.getBoundingClientRect();
        return rect.top <= viewportCenter && rect.bottom > viewportCenter;
    });

    // Fallback if the viewport centre is between slides.
    if (index === -1) {
        let greatestVisibleHeight = 0;

        slides.forEach((slide, slideIndex) => {
            const rect = slide.getBoundingClientRect();
            const visibleHeight = Math.max(
                0,
                Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
            );

            if (visibleHeight > greatestVisibleHeight) {
                greatestVisibleHeight = visibleHeight;
                index = slideIndex;
            }
        });
    }

    if (index !== -1) {
        setActiveSlide(index);
    }
}

window.addEventListener(
    "scroll",
    () => {
        if (scrollFramePending) return;

        scrollFramePending = true;

        requestAnimationFrame(() => {
            updateActiveSlide();
            scrollFramePending = false;
        });
    },
    { passive: true },
);

window.addEventListener("resize", updateActiveSlide);

// Navigate with slide dots
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        slides[index]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
});

// Keyboard navigation: arrows, Page Up/Down, or Space
document.addEventListener("keydown", (event) => {
    if (event.target.closest("a, button, input, textarea, select")) return;

    let nextIndex = activeIndex;

    if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        nextIndex = Math.min(slides.length - 1, activeIndex + 1);
    } else if (["ArrowUp", "PageUp"].includes(event.key)) {
        nextIndex = Math.max(0, activeIndex - 1);
    } else {
        return;
    }

    event.preventDefault();
    slides[nextIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
});

// Set the correct slide on initial page load.
updateActiveSlide();
