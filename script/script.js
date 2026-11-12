/* ==========================================================================
   VPAY ADVISORY (OPC) PRIVATE LIMITED - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");
    const backToTopBtn = document.getElementById("backToTop");
    const currentYearEl = document.getElementById("currentYear");

    // Set current copyright year
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Align mobile menu drawer directly below the sticky navbar
    const syncMenuPosition = () => {
        if (!navbar || !navMenu) return;
        if (window.innerWidth <= 991) {
            const rect = navbar.getBoundingClientRect();
            navMenu.style.top = `${Math.max(rect.bottom, 0)}px`;
        } else {
            navMenu.style.top = "";
        }
    };

    syncMenuPosition();
    window.addEventListener("resize", syncMenuPosition);

    // Toggle mobile navigation menu
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener("click", () => {
            syncMenuPosition();
            const isOpen = navMenu.classList.toggle("open");
            hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
            const icon = hamburgerBtn.querySelector("i");
            if (icon) {
                icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
            }
        });

        // Close menu when clicking a navigation link
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                hamburgerBtn.setAttribute("aria-expanded", "false");
                const icon = hamburgerBtn.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", (event) => {
            if (
                navMenu.classList.contains("open") &&
                !navMenu.contains(event.target) &&
                !hamburgerBtn.contains(event.target)
            ) {
                navMenu.classList.remove("open");
                hamburgerBtn.setAttribute("aria-expanded", "false");
                const icon = hamburgerBtn.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            }
        });
    }

    // Scroll effects: sticky shadow, back-to-top button, active section link
    const sections = document.querySelectorAll("main section[id]");

    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (navbar) {
            navbar.classList.toggle("scrolled", scrollY > 40);
            if (navMenu && navMenu.classList.contains("open")) {
                syncMenuPosition();
            }
        }

        if (backToTopBtn) {
            backToTopBtn.classList.toggle("show", scrollY > 420);
        }

        const hasHashNavLinks = Array.from(navLinks).some((link) =>
            (link.getAttribute("href") || "").startsWith("#")
        );

        if (hasHashNavLinks) {
            let currentId = "home";
            sections.forEach((section) => {
                const top = section.offsetTop - 130;
                const height = section.offsetHeight;
                if (scrollY >= top && scrollY < top + height) {
                    currentId = section.getAttribute("id");
                }
            });

            navLinks.forEach((link) => {
                const href = link.getAttribute("href");
                link.classList.toggle("active", href === `#${currentId}`);
            });
        }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Scroll Reveal for animate__fadeInUp inside sections
    const animatedItems = document.querySelectorAll("section .animate__fadeInUp");

    if ("IntersectionObserver" in window && animatedItems.length > 0) {
        const viewportBottom = window.innerHeight || document.documentElement.clientHeight;

        animatedItems.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top > viewportBottom - 20) {
                el.classList.remove("animate__fadeInUp");
                el.classList.add("reveal-pending");
            }
        });

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        target.classList.remove("reveal-pending");
                        target.classList.add("animate__animated", "animate__fadeInUp");
                        obs.unobserve(target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -30px 0px",
            }
        );

        animatedItems.forEach((el) => {
            if (el.classList.contains("reveal-pending")) {
                observer.observe(el);
            }
        });
    }

    // Service Category Filter Buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    const serviceCards = document.querySelectorAll(".service-card");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const selected = btn.getAttribute("data-filter");

            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            serviceCards.forEach((card) => {
                const category = card.getAttribute("data-category");
                const shouldShow =
                    selected === "all" ||
                    category === selected ||
                    category === "all-always";

                card.classList.toggle("hidden-card", !shouldShow);

                if (shouldShow) {
                    card.classList.remove("reveal-pending", "animate__fadeInUp");
                    void card.offsetWidth; // trigger reflow to replay animation smoothly
                    card.classList.add("animate__animated", "animate__fadeInUp");
                }
            });
        });
    });

    // Consultation Form (WhatsApp & Email)
    const consultationForm = document.getElementById("consultationForm");
    const emailSubmitBtn = document.getElementById("emailSubmitBtn");
    const formFeedback = document.getElementById("formFeedback");

    const collectFormValues = () => {
        const name = document.getElementById("clientName")?.value.trim() || "";
        const phone = document.getElementById("clientPhone")?.value.trim() || "";
        const email = document.getElementById("clientEmail")?.value.trim() || "Not provided";
        const service = document.getElementById("serviceType")?.value.trim() || "";
        const message = document.getElementById("clientMessage")?.value.trim() || "";

        return { name, phone, email, service, message };
    };

    const validateValues = ({ name, phone, service, message }) => {
        if (!name || !phone || !service || !message) {
            if (formFeedback) {
                formFeedback.textContent = "Please fill in all required fields (*).";
                formFeedback.style.color = "#b91c1c";
            }
            return false;
        }
        return true;
    };

    if (consultationForm) {
        consultationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = collectFormValues();
            if (!validateValues(data)) return;

            const text = [
                "Hello VPAY Advisory,",
                `Name: ${data.name}`,
                `Phone: ${data.phone}`,
                `Email: ${data.email}`,
                `Service: ${data.service}`,
                `Requirement: ${data.message}`,
            ].join("\n");

            const waUrl = `https://wa.me/919990366580?text=${encodeURIComponent(text)}`;
            window.open(waUrl, "_blank", "noopener,noreferrer");

            if (formFeedback) {
                formFeedback.textContent = "Opening WhatsApp with your consultation details...";
                formFeedback.style.color = "#15803d";
            }
        });
    }

    if (emailSubmitBtn) {
        emailSubmitBtn.addEventListener("click", () => {
            const data = collectFormValues();
            if (!validateValues(data)) return;

            const subject = `Consultation Enquiry: ${data.service} - ${data.name}`;
            const body = [
                "Dear Vinod Gumber / VPAY Advisory Team,",
                "",
                `Name: ${data.name}`,
                `Phone: ${data.phone}`,
                `Email: ${data.email}`,
                `Service Required: ${data.service}`,
                "",
                "Requirement:",
                data.message,
            ].join("\n");

            window.location.href = `mailto:vpayadvisory@gmail.com?cc=vinodstp@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            if (formFeedback) {
                formFeedback.textContent = "Opening your email client to send the enquiry...";
                formFeedback.style.color = "#0b1d3a";
            }
        });
    }
});

