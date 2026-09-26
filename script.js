/* =========================================================
   ZYLO TWEAKS — MAIN SCRIPT
   Landing page controls, FAQ, tweak finder,
   tweak guide modal, animations and mobile menu.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuButton.classList.toggle("open");
        });
    }


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    document.querySelectorAll(".faq-question").forEach(question => {

        question.addEventListener("click", () => {

            const item = question.closest(".faq-item");

            if (!item) return;

            const alreadyOpen = item.classList.contains("open");

            document.querySelectorAll(".faq-item").forEach(other => {
                other.classList.remove("open");
            });

            if (!alreadyOpen) {
                item.classList.add("open");
            }
        });

    });


    /* =====================================================
       DIAGNOSTIC COUNTER
    ===================================================== */

    document.querySelectorAll("[data-count]").forEach(element => {

        const target = Number(element.dataset.count);

        if (Number.isNaN(target)) return;

        let current = 0;
        const duration = 1200;
        const start = performance.now();

        function animate(time) {

            const progress =
                Math.min((time - start) / duration, 1);

            current = Math.floor(target * progress);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(animate);
    });


    /* =====================================================
       PERFORMANCE BARS
    ===================================================== */

    document.querySelectorAll("[data-width]").forEach(bar => {

        const width = bar.dataset.width;

        if (!width) return;

        requestAnimationFrame(() => {
            bar.style.width = width;
        });

    });


    /* =====================================================
       TWEAK DATA
    ===================================================== */

    const tweakData = {

        "low-end": {
            title: "Potato / Low-End Preset",
            description:
                "A lower-overhead configuration designed for weaker PCs. Focuses on reducing unnecessary Windows overhead while keeping changes reversible."
        },

        "amd": {
            title: "AMD Optimization",
            description:
                "A collection of safe AMD-focused recommendations for improving consistency and reducing unnecessary background overhead."
        },

        "intel": {
            title: "Intel Optimization",
            description:
                "Intel-focused system recommendations designed for lower-end and integrated graphics systems."
        },

        "game-processor": {
            title: "Game Processor",
            description:
                "Safe processor-related Windows adjustments intended to reduce unnecessary background activity."
        },

        "game-settings": {
            title: "Game User Settings",
            description:
                "Recommended settings for creating a lower-overhead Fortnite configuration."
        },

        "stretched-res": {
            title: "Stretched Resolution",
            description:
                "Information and setup guidance for using supported display resolutions. Results vary depending on your hardware and display."
        },

        "network": {
            title: "Network Optimization",
            description:
                "Safe network recommendations focused on stability and consistency rather than claiming impossible zero latency."
        },

        "pc-checks": {
            title: "PC Checks",
            description:
                "Use the ZYLO PC Check utility to inspect your Windows system before applying optimisations."
        },

        "basic": {
            title: "Basic Tweaks",
            description:
                "A conservative collection of reversible Windows optimisations."
        },

        "pro": {
            title: "Pro Tweaks",
            description:
                "More advanced optimisation recommendations for users who understand the changes being applied."
        },

        "extreme": {
            title: "Extreme Tweaks",
            description:
                "Advanced system adjustments. Review every change before applying it and keep a backup available."
        },

        "full-optimization": {
            title: "Full Optimization",
            description:
                "A combined optimisation approach covering system, gaming and network recommendations."
        },

        "nvidia": {
            title: "NVIDIA Pack",
            description:
                "NVIDIA-focused recommendations for supported systems."
        },

        "zero-delay": {
            title: "0 Delay — No FPS Drop",
            description:
                "A performance-focused preset designed to reduce unnecessary overhead. No software can guarantee literally zero input latency."
        },

        "potato-pro": {
            title: "Potato Graphics Pro",
            description:
                "A more aggressive low-end graphics configuration for systems where performance is the priority."
        }

    };


    /* =====================================================
       TWEAK MODAL
    ===================================================== */

    const modal = document.querySelector("#tweak-modal");
    const modalTitle = document.querySelector("#tweak-modal-title");
    const modalBody = document.querySelector("#tweak-modal-body");
    const modalClose = document.querySelector("#tweak-modal-close");


    function openTweak(key) {

        const data = tweakData[key];

        if (!data || !modal) return;

        if (modalTitle) {
            modalTitle.textContent = data.title;
        }

        if (modalBody) {
            modalBody.textContent = data.description;
        }

        modal.classList.add("open");
        document.body.classList.add("modal-open");
    }


    function closeTweak() {

        if (!modal) return;

        modal.classList.remove("open");
        document.body.classList.remove("modal-open");
    }


    if (modalClose) {
        modalClose.addEventListener("click", closeTweak);
    }


    if (modal) {
        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closeTweak();
            }

        });
    }


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeTweak();
        }

    });


    /* =====================================================
       TWEAK BUTTONS
    ===================================================== */

    document.querySelectorAll("[data-tweak]").forEach(button => {

        button.addEventListener("click", () => {

            const key = button.dataset.tweak;

            openTweak(key);

        });

    });


    /* =====================================================
       GLOBAL TWEAK OPENER
       Allows HTML buttons to call:
       window.zyloOpenTweak("amd")
    ===================================================== */

    window.zyloOpenTweak = openTweak;


    /* =====================================================
       TWEAK FINDER
    ===================================================== */

    const finder = document.querySelector("#tweak-finder");
    const finderInput = document.querySelector("#tweak-search");
    const finderResults = document.querySelector("#tweak-results");


    if (finderInput && finderResults) {

        finderInput.addEventListener("input", () => {

            const search =
                finderInput.value
                    .trim()
                    .toLowerCase();

            const cards =
                finderResults.querySelectorAll(
                    "[data-tweak]"
                );

            cards.forEach(card => {

                const key =
                    (card.dataset.tweak || "")
                        .toLowerCase();

                const text =
                    card.textContent
                        .toLowerCase();

                const matches =
                    !search ||
                    key.includes(search) ||
                    text.includes(search);

                card.style.display =
                    matches ? "" : "none";
            });

        });
    }


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const id =
                link.getAttribute("href");

            if (!id || id === "#") return;

            const target =
                document.querySelector(id);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       CLOSE MOBILE NAV AFTER CLICK
    ===================================================== */

    document.querySelectorAll(".site-nav a").forEach(link => {

        link.addEventListener("click", () => {

            if (nav) {
                nav.classList.remove("open");
            }

            if (menuButton) {
                menuButton.classList.remove("open");
            }

        });

    });

});