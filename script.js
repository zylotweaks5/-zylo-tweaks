/* =========================================================
   ZYLO TWEAKS — COMBINED SCRIPT
   Main website + Dashboard
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       HELPERS
    ===================================================== */

    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }


    /* =====================================================
       MAIN WEBSITE — MOBILE MENU
    ===================================================== */

    const menuButton = $(".menu-toggle");
    const nav = $(".site-nav");

    if (menuButton && nav) {

        menuButton.addEventListener("click", function () {

            nav.classList.toggle("open");
            menuButton.classList.toggle("open");

        });

    }


    /* =====================================================
       MAIN WEBSITE — FAQ
    ===================================================== */

    $$(".faq-question").forEach(function (question) {

        question.addEventListener("click", function () {

            const item = question.closest(".faq-item");

            if (!item) return;

            const wasOpen =
                item.classList.contains("open");

            $$(".faq-item").forEach(function (other) {
                other.classList.remove("open");
            });

            if (!wasOpen) {
                item.classList.add("open");
            }

        });

    });


    /* =====================================================
       MAIN WEBSITE — COUNTERS
    ===================================================== */

    $$("[data-count]").forEach(function (element) {

        const target =
            Number(element.dataset.count);

        if (Number.isNaN(target)) return;

        const duration = 1200;
        const start = performance.now();


        function animate(time) {

            const progress =
                Math.min(
                    (time - start) / duration,
                    1
                );

            element.textContent =
                Math.floor(target * progress);


            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        }


        requestAnimationFrame(animate);

    });


    /* =====================================================
       MAIN WEBSITE — PERFORMANCE BARS
    ===================================================== */

    $$("[data-width]").forEach(function (bar) {

        const width =
            bar.dataset.width;

        if (!width) return;

        requestAnimationFrame(function () {
            bar.style.width = width;
        });

    });


    /* =====================================================
       MAIN WEBSITE — TWEAK DATA
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
                "AMD-focused recommendations for supported systems."
        },

        "intel": {
            title: "Intel Optimization",
            description:
                "Intel-focused recommendations for supported systems."
        },

        "game-processor": {
            title: "Game Processor",
            description:
                "Processor-related Windows recommendations designed to reduce unnecessary background overhead."
        },

        "game-settings": {
            title: "Game User Settings",
            description:
                "Recommended Fortnite settings focused on reducing unnecessary overhead."
        },

        "stretched-res": {
            title: "Stretched Resolution",
            description:
                "Information about supported display-resolution configurations. Results depend on your hardware and display."
        },

        "network": {
            title: "Network Optimization",
            description:
                "Safe network recommendations focused on stability and consistency."
        },

        "pc-checks": {
            title: "PC Checks",
            description:
                "Use the ZYLO PC Check utility to inspect your Windows system."
        },

        "basic": {
            title: "Basic Tweaks",
            description:
                "A conservative collection of reversible Windows optimisations."
        },

        "pro": {
            title: "Pro Tweaks",
            description:
                "More advanced optimisation recommendations for users who understand the changes."
        },

        "extreme": {
            title: "Extreme Tweaks",
            description:
                "Advanced system adjustments. Review changes before applying them."
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
                "A lower-overhead graphics configuration for weaker systems."
        }

    };


    /* =====================================================
       MAIN WEBSITE — TWEAK MODAL
    ===================================================== */

    const modal =
        $("#tweak-modal");

    const modalTitle =
        $("#tweak-modal-title");

    const modalBody =
        $("#tweak-modal-body");

    const modalClose =
        $("#tweak-modal-close");


    function openTweak(key) {

        const data =
            tweakData[key];

        if (!data || !modal) return;

        if (modalTitle) {
            modalTitle.textContent =
                data.title;
        }

        if (modalBody) {
            modalBody.textContent =
                data.description;
        }

        modal.classList.add("open");

        document.body.classList.add(
            "modal-open"
        );
    }


    function closeTweak() {

        if (!modal) return;

        modal.classList.remove("open");

        document.body.classList.remove(
            "modal-open"
        );
    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeTweak
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {
                    closeTweak();
                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeTweak();
            }

        }
    );


    $$("[data-tweak]").forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                openTweak(
                    button.dataset.tweak
                );

            }
        );

    });


    window.zyloOpenTweak =
        openTweak;


    /* =====================================================
       MAIN WEBSITE — TWEAK FINDER
    ===================================================== */

    const finderInput =
        $("#tweak-search");

    const finderResults =
        $("#tweak-results");


    if (finderInput && finderResults) {

        finderInput.addEventListener(
            "input",
            function () {

                const search =
                    finderInput.value
                        .trim()
                        .toLowerCase();


                finderResults
                    .querySelectorAll(
                        "[data-tweak]"
                    )
                    .forEach(function (card) {

                        const key =
                            (
                                card.dataset.tweak ||
                                ""
                            ).toLowerCase();

                        const text =
                            card.textContent
                                .toLowerCase();


                        const matches =
                            !search ||
                            key.includes(search) ||
                            text.includes(search);


                        card.style.display =
                            matches
                                ? ""
                                : "none";

                    });

            }
        );

    }


    /* =====================================================
       MAIN WEBSITE — SMOOTH LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const id =
                        link.getAttribute("href");

                    if (!id || id === "#") {
                        return;
                    }

                    const target =
                        document.querySelector(id);

                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       DASHBOARD — DOWNLOADS
    ===================================================== */

    const DOWNLOADS = {

        pcCheck:
            "downloads/ZYLO_PC_CHECK.exe",

        networkCheck:
            "downloads/ZYLO_NETWORK_CHECK.exe",

        optimiser:
            "downloads/ZYLO_OPTIMISER.exe"

    };


    /* =====================================================
       DASHBOARD — STATE
    ===================================================== */

    const dashboardState = {

        pcCheck:
            localStorage.getItem(
                "zylo_pc_check"
            ) === "complete",

        networkCheck:
            localStorage.getItem(
                "zylo_network_check"
            ) === "complete",

        optimiserOpened: false,

        potatoOpened: false,

        downloadsOpened: false

    };


    /* =====================================================
       DASHBOARD — DOWNLOAD FUNCTION
    ===================================================== */

    function downloadFile(
        file,
        name
    ) {

        const link =
            document.createElement("a");

        link.href = file;

        link.download = name;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    }


    /* =====================================================
       DASHBOARD — LAST SCAN
    ===================================================== */

    function saveLastScan() {

        const date =
            new Date();


        const formatted =
            date.toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );


        localStorage.setItem(
            "zylo_last_scan",
            formatted
        );

    }


    /* =====================================================
       DASHBOARD — STATUS
    ===================================================== */

    function updateDashboardStatus() {

        const pcStatus =
            $("#pc-status");


        if (pcStatus) {

            pcStatus.textContent =
                dashboardState.pcCheck
                    ? "CHECK COMPLETED"
                    : "NOT SCANNED";


            pcStatus.classList.toggle(
                "complete",
                dashboardState.pcCheck
            );

        }


        const networkStatus =
            $("#network-status");


        if (networkStatus) {

            networkStatus.textContent =
                dashboardState.networkCheck
                    ? "CHECK COMPLETED"
                    : "NOT SCANNED";


            networkStatus.classList.toggle(
                "complete",
                dashboardState.networkCheck
            );

        }


        const lastScan =
            $("#last-scan");


        if (lastScan) {

            const savedDate =
                localStorage.getItem(
                    "zylo_last_scan"
                );


            lastScan.textContent =
                savedDate
                    ? "Last scan: " + savedDate
                    : "Last scan: Never";

        }

    }


    /* =====================================================
       DASHBOARD — NAVIGATION
    ===================================================== */

    $$(".zylo-nav-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const target =
                        button.dataset.target;

                    if (!target) return;

                    showDashboardView(
                        target
                    );

                }
            );

        });


    function showDashboardView(id) {

        $$(".zylo-view")
            .forEach(function (view) {

                view.classList.remove(
                    "active"
                );

            });


        $$(".zylo-nav-btn")
            .forEach(function (button) {

                button.classList.remove(
                    "active"
                );

            });


        const view =
            document.getElementById(id);


        if (view) {

            view.classList.add(
                "active"
            );

        }


        const button =
            document.querySelector(
                '.zylo-nav-btn[data-target="' +
                id +
                '"]'
            );


        if (button) {

            button.classList.add(
                "active"
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       DASHBOARD — PC CHECK
    ===================================================== */

    $$("[data-action='pc-check']")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    button.disabled = true;

                    button.textContent =
                        "Preparing PC Check...";


                    setTimeout(
                        function () {

                            downloadFile(
                                DOWNLOADS.pcCheck,
                                "ZYLO_PC_CHECK.exe"
                            );


                            dashboardState.pcCheck =
                                true;


                            localStorage.setItem(
                                "zylo_pc_check",
                                "complete"
                            );


                            saveLastScan();

                            updateDashboardStatus();


                            button.disabled =
                                false;


                            button.textContent =
                                "Download PC Check";

                        },
                        500
                    );

                }
            );

        });


    /* =====================================================
       DASHBOARD — NETWORK CHECK
    ===================================================== */

    $$("[data-action='network-check']")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    button.disabled = true;

                    button.textContent =
                        "Preparing Network Check...";


                    setTimeout(
                        function () {

                            downloadFile(
                                DOWNLOADS.networkCheck,
                                "ZYLO_NETWORK_CHECK.exe"
                            );


                            dashboardState.networkCheck =
                                true;


                            localStorage.setItem(
                                "zylo_network_check",
                                "complete"
                            );


                            saveLastScan();

                            updateDashboardStatus();


                            button.disabled =
                                false;


                            button.textContent =
                                "Download Network Check";

                        },
                        500
                    );

                }
            );

        });


    /* =====================================================
       DASHBOARD — OPTIMISER
    ===================================================== */

    $$("[data-action='optimiser']")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    dashboardState.optimiserOpened =
                        true;


                    const panel =
                        $("#optimiser-panel");


                    if (panel) {

                        panel.classList.add(
                            "open"
                        );


                        panel.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }
                    else {

                        showDashboardView(
                            "optimiser"
                        );

                    }

                }
            );

        });


    /* =====================================================
       DASHBOARD — OPTIMISER DOWNLOAD
    ===================================================== */

    $$("[data-action='download-optimiser']")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    downloadFile(
                        DOWNLOADS.optimiser,
                        "ZYLO_OPTIMISER.exe"
                    );

                }
            );

        });


    /* =====================================================
       DASHBOARD — POTATO MODE
    ===================================================== */

    $$("[data-action='potato']")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    dashboardState.potatoOpened =
                        true;


                    localStorage.setItem(
                        "zylo_potato_opened",
                        "true"
                    );


                    showDashboardView(
                        "potato"
                    );

                }
            );

        });


    /* =====================================================
       DASHBOARD — DOWNLOADS
    ===================================================== */

    $$("[data-action='downloads']")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    dashboardState.downloadsOpened =
                        true;


                    localStorage.setItem(
                        "zylo_downloads_opened",
                        "true"
                    );


                    showDashboardView(
                        "downloads"
                    );

                }
            );

        });


    /* =====================================================
       DASHBOARD — GUIDED TOUR
    ===================================================== */

    const tourSteps = [

        {
            target: "tour-pc",
            title: "PC Check",
            text:
                "Start here to check your Windows setup."
        },

        {
            target: "tour-network",
            title: "Network Check",
            text:
                "Check your connection and network information."
        },

        {
            target: "tour-optimizer",
            title: "Optimiser",
            text:
                "Open your ZYLO optimisation tools here."
        },

        {
            target: "tour-potato",
            title: "Potato Mode",
            text:
                "Find lower-overhead settings for weaker PCs."
        },

        {
            target: "tour-downloads",
            title: "Downloads",
            text:
                "Your ZYLO utilities and tools will appear here."
        },

        {
            target: "tour-premium",
            title: "Premium",
            text:
                "Access your premium ZYLO features here."
        },

        {
            target: "tour-account",
            title: "Account",
            text:
                "Your verified account information appears here."
        }

    ];


    let tourIndex = 0;


    const tourOverlay =
        $("#tour-overlay");

    const tourTitle =
        $("#tour-title");

    const tourText =
        $("#tour-text");

    const tourNext =
        $("#tour-next");

    const tourSkip =
        $("#tour-skip");

    const tourReplay =
        $("#tour-replay");


    function showTourStep() {

        const step =
            tourSteps[tourIndex];


        if (!step) return;


        $$(".tour-highlight")
            .forEach(function (element) {

                element.classList.remove(
                    "tour-highlight"
                );

            });


        const target =
            document.getElementById(
                step.target
            );


        if (target) {

            target.classList.add(
                "tour-highlight"
            );

        }


        if (tourTitle) {

            tourTitle.textContent =
                step.title;

        }


        if (tourText) {

            tourText.textContent =
                step.text;

        }


        if (tourNext) {

            tourNext.textContent =
                tourIndex ===
                tourSteps.length - 1
                    ? "Finish"
                    : "Next";

        }

    }


    function startTour() {

        if (!tourOverlay) return;

        tourIndex = 0;

        tourOverlay.classList.add(
            "active"
        );

        showTourStep();

    }


    function finishTour() {

        if (tourOverlay) {

            tourOverlay.classList.remove(
                "active"
            );

        }


        $$(".tour-highlight")
            .forEach(function (element) {

                element.classList.remove(
                    "tour-highlight"
                );

            });


        localStorage.setItem(
            "zyloTourDone",
            "true"
        );

    }


    if (tourNext) {

        tourNext.addEventListener(
            "click",
            function () {

                if (
                    tourIndex >=
                    tourSteps.length - 1
                ) {

                    finishTour();

                    return;

                }


                tourIndex++;

                showTourStep();

            }
        );

    }


    if (tourSkip) {

        tourSkip.addEventListener(
            "click",
            finishTour
        );

    }


    if (tourReplay) {

        tourReplay.addEventListener(
            "click",
            startTour
        );

    }


    /* =====================================================
       INITIALISE DASHBOARD
    ===================================================== */

    updateDashboardStatus();


    if (
        $("#tour-overlay") &&
        !localStorage.getItem("zyloTourDone")
    ) {

        setTimeout(
            startTour,
            1000
        );

    }

});