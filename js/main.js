document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = document.getElementById('main-navbar');
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const themeIcon = document.getElementById('theme-icon');
    const backToTop = document.getElementById('back-to-top');

    const setTheme = (theme) => {
        const isDark = theme === '🌙';
        body.classList.toggle('dark-mode', isDark);

        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        }

        localStorage.setItem('theme', theme);
    };

    setTheme(localStorage.getItem('theme') || '☀️');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTheme(body.classList.contains('dark-mode') ? '☀️' : '🌙');
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    document.querySelectorAll('.current-year').forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    // Progressive reveal of page hero elements
    const revealPageHeroElements = () => {
        const pageHero = document.querySelector('.page-hero');
        if (!pageHero) return;

        const heroElements = {
            kicker: pageHero.querySelector('.section-kicker'),
            title: pageHero.querySelector('h1'),
            description: pageHero.querySelector('.hero-lead'),
        };

        // Stagger reveal timing
        setTimeout(() => {
            if (heroElements.kicker) heroElements.kicker.classList.add('reveal-element');
        }, 100);

        setTimeout(() => {
            if (heroElements.title) heroElements.title.classList.add('reveal-element');
        }, 300);

        setTimeout(() => {
            if (heroElements.description) heroElements.description.classList.add('reveal-element');
        }, 500);
    };

    // Call on page load
    revealPageHeroElements();

    const updateScrollState = () => {
        if (navbar) {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
        }

        if (backToTop) {
            const shouldShow = window.scrollY > 420;
            backToTop.hidden = !shouldShow;
            backToTop.classList.toggle('is-visible', shouldShow);
        }
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const counters = document.querySelectorAll('[data-goal]');
    const animateCounter = (element) => {
        const goal = Number.parseInt(element.dataset.goal, 10);
        if (!goal || element.dataset.started === 'true') return;

        element.dataset.started = 'true';
        const duration = 1200;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * goal);
            element.textContent = `${value.toLocaleString('fr-FR')}+`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.textContent = `${goal.toLocaleString('fr-FR')}+`;
            }
        };

        requestAnimationFrame(tick);
    };

    const revealTargets = document.querySelectorAll('section, .feature-card, .freelance-card, .pricing-card');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('visible');

                if (entry.target.matches('.stats-band')) {
                    counters.forEach(animateCounter);
                }

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.18 });

        revealTargets.forEach((target) => {
            target.classList.add('fade-in');
            observer.observe(target);
        });
    } else {
        revealTargets.forEach((target) => target.classList.add('visible'));
        counters.forEach(animateCounter);
    }

    const filterButtons = document.querySelectorAll('#filter-buttons [data-filter]');
    const freelanceItems = document.querySelectorAll('.freelance-item');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle('active', isActive);
                item.classList.toggle('btn-primary', isActive);
                item.classList.toggle('btn-outline-primary', !isActive);
            });

            freelanceItems.forEach((item) => {
                const isVisible = filter === 'all' || item.dataset.category === filter;
                item.hidden = !isVisible;
            });

            // Reveal header elements based on visible freelances
            revealHeaderProgressively();
        });
    });

    // Progressive reveal of header elements based on freelance count
    const revealHeaderProgressively = () => {
        const visibleFreelances = document.querySelectorAll('.freelance-item:not([hidden])');
        const totalFreelances = visibleFreelances.length;
        const pageHero = document.querySelector('.page-hero');

        if (!pageHero) return;

        const heroElements = {
            kicker: pageHero.querySelector('.section-kicker'),
            title: pageHero.querySelector('h1'),
            description: pageHero.querySelector('.hero-lead'),
        };

        const revealPercentage = Math.min((totalFreelances / 9) * 100, 100);

        // Add reveal animation class
        if (heroElements.kicker) {
            if (revealPercentage > 25) {
                heroElements.kicker.classList.add('reveal-element');
            } else {
                heroElements.kicker.classList.remove('reveal-element');
            }
        }

        if (heroElements.title) {
            if (revealPercentage > 50) {
                heroElements.title.classList.add('reveal-element');
            } else {
                heroElements.title.classList.remove('reveal-element');
            }
        }

        if (heroElements.description) {
            if (revealPercentage > 75) {
                heroElements.description.classList.add('reveal-element');
            } else {
                heroElements.description.classList.remove('reveal-element');
            }
        }
    };

    // Initial reveal check
    revealHeaderProgressively();

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const successMessage = document.getElementById('form-success-msg');

            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                return;
            }

            if (successMessage) {
                successMessage.classList.remove('d-none');
            }

            contactForm.reset();
            contactForm.classList.remove('was-validated');
        });
    }
});
<<<<<<< HEAD
<<<<<<< HEAD










=======
>>>>>>> ca1ad624bc2633c7c342d4851009f956834e0f89



=======
>>>>>>> ca1ad624bc2633c7c342d4851009f956834e0f89
