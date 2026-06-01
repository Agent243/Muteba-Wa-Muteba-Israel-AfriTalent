document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = document.getElementById('main-navbar');
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const themeIcon = document.getElementById('theme-icon');
    const backToTop = document.getElementById('back-to-top');

    // ==========================================
    // 1. GESTION DU THÈME (LIGHT / DARK)
    // ==========================================
    const setTheme = (theme) => {
        // Supporte à la fois les émojis historiques et les chaînes de texte standards
        const isDark = theme === '🌙' || theme === 'dark';

        // Gestion hybride : Ta classe personnalisée + Le mode natif de Bootstrap 5.3
        body.classList.toggle('dark-mode', isDark);
        document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');

        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        }

        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // Initialisation du thème au chargement
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isCurrentlyDark = body.classList.contains('dark-mode') || document.documentElement.getAttribute('data-bs-theme') === 'dark';
            setTheme(isCurrentlyDark ? 'light' : 'dark');
        });
    }

    // ==========================================
    // 2. LIENS DE NAVIGATION ACTIFS & ANNÉE
    // ==========================================
    // Nettoyage de l'URL pour éviter les faux négatifs avec les ancres ou requêtes
    const currentPage = window.location.pathname.split('/').pop().split('?')[0].split('#')[0] || 'index.html';

    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Mise à jour de l'année automatique
    document.querySelectorAll('.current-year').forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    // ==========================================
    // 3. ANIMATIONS D'APPARITION DU HERO
    // ==========================================
    const revealPageHeroElements = () => {
        const pageHero = document.querySelector('.page-hero') || document.querySelector('.hero-section');
        if (!pageHero) return;

        const heroElements = {
            kicker: pageHero.querySelector('.section-kicker'),
            title: pageHero.querySelector('h1'),
            description: pageHero.querySelector('.hero-lead'),
        };

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

    revealPageHeroElements();

    // ==========================================
    // 4. GESTION DU SCROLL (NAVBAR & RETOUR EN HAUT)
    // ==========================================
    const updateScrollState = () => {
        if (navbar) {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
        }

        if (backToTop) {
            const shouldShow = window.scrollY > 420;
            backToTop.hidden = !shouldShow;
            backToTop.classList.toggle('is-visible', shouldShow);
            // Fallback d'affichage si la classe CSS ne gère pas le display
            backToTop.style.display = shouldShow ? 'block' : 'none';
        }
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState(); // Appel initial au cas où la page est déjà scrollée

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 5. COMPTEURS STATISTIQUES ANIMÉS
    // ==========================================
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

    // ==========================================
    // 6. INTERSECTION OBSERVER (FADE IN EFFECTS)
    // ==========================================
    const revealTargets = document.querySelectorAll('section, .feature-card, .freelance-card, .pricing-card, .stats-band');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('visible');

                // Si la section des stats ou un conteneur proche est visible, on lance les compteurs
                if (entry.target.matches('.stats-band') || entry.target.querySelector('[data-goal]')) {
                    counters.forEach(animateCounter);
                }

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        revealTargets.forEach((target) => {
            target.classList.add('fade-in');
            observer.observe(target);
        });
    } else {
        // Fallback si le navigateur est ancien
        revealTargets.forEach((target) => target.classList.add('visible'));
        counters.forEach(animateCounter);
    }

    // ==========================================
    // 7. FILTRES DE LA PAGE FREELANCES
    // ==========================================
    const filterButtons = document.querySelectorAll('#filter-buttons [data-filter]');
    const freelanceItems = document.querySelectorAll('.freelance-item');

    // Progressive reveal ajusté selon les filtres actifs
    const revealHeaderProgressively = () => {
        const visibleFreelances = document.querySelectorAll('.freelance-item:not([hidden])');
        const totalFreelances = visibleFreelances.length;
        const pageHero = document.querySelector('.page-hero') || document.querySelector('.hero-section');

        if (!pageHero) return;

        const heroElements = {
            kicker: pageHero.querySelector('.section-kicker'),
            title: pageHero.querySelector('h1'),
            description: pageHero.querySelector('.hero-lead'),
        };

        // Calcul dynamique basé sur le ratio d'éléments visibles (évite les divisions par 0)
        const revealPercentage = totalFreelances > 0 ? Math.min((totalFreelances / 9) * 100, 100) : 100;

        if (heroElements.kicker) {
            heroElements.kicker.classList.toggle('reveal-element', revealPercentage > 25);
        }
        if (heroElements.title) {
            heroElements.title.classList.toggle('reveal-element', revealPercentage > 50);
        }
        if (heroElements.description) {
            heroElements.description.classList.toggle('reveal-element', revealPercentage > 75);
        }
    };

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
                // Ajustement d'affichage pour la grille Bootstrap
                item.style.display = isVisible ? '' : 'none';
            });

            revealHeaderProgressively();
        });
    });

    // Appel initial du filtre pour synchroniser l'en-tête
    if (freelanceItems.length > 0) {
        revealHeaderProgressively();
    }

    // ==========================================
    // 8. FORMULAIRE DE CONTACT
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const successMessage = document.getElementById('form-success-msg');

            // Utilise la validation native de Bootstrap
            if (!contactForm.checkValidity()) {
                event.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            // Affiche le message de succès si tout est OK
            if (successMessage) {
                successMessage.classList.remove('d-none');
                setTimeout(() => {
                    successMessage.classList.add('d-none');
                }, 5000);
            }

            // Réinitialise le formulaire et supprime les styles de validation
            contactForm.reset();
            contactForm.classList.remove('was-validated');
        });
    }
});