// =============================================
// Interactive Constellation Particle Canvas
// =============================================
(function () {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId = null;
    const mouse = { x: null, y: null, radius: 135 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#a78bfa', '#22d3ee'];
    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    class Particle {
        constructor() {
            this.x = randomBetween(0, canvas.width);
            this.y = randomBetween(0, canvas.height);
            this.r = randomBetween(1, 2.4);
            this.vx = randomBetween(-0.28, 0.28);
            this.vy = randomBetween(-0.28, 0.28);
            this.alpha = randomBetween(0.35, 0.85);
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 0 && dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.4;
                    this.y += (dy / dist) * force * 1.4;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = prefersReduced
            ? 24
            : Math.min(75, Math.max(28, Math.floor(window.innerWidth / 20)));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawConnections() {
        const maxDist = 115;
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#8b5cf6';
                    ctx.globalAlpha = (1 - dist / maxDist) * 0.22;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
            if (mouse.x !== null && mouse.y !== null) {
                const md = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
                if (md < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#06b6d4';
                    ctx.globalAlpha = (1 - md / mouse.radius) * 0.35;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (document.hidden) {
            animId = null;
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        drawConnections();
        ctx.globalAlpha = 1;
        animId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !animId && !prefersReduced) animate();
    });

    if (prefersReduced) {
        particles.forEach((p) => p.draw());
    } else {
        animate();
    }
})();

// =============================================
// Toast Helper
// =============================================
let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById('saToast');
    if (!toast) return;
    toast.innerHTML = `<i class="bx bx-check-circle"></i><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// =============================================
// Scroll Effects: Header, Progress Bar, Ring, Active Nav, Morphing Pill & Parallax
// =============================================
(function () {
    const header = document.getElementById('header');
    const topBar = document.getElementById('scroll-progress-bar');
    const scrollProgress = document.getElementById('progress');
    const menuLinks = Array.from(document.querySelectorAll('header ul li a[href^="#"]'));
    const navList = document.querySelector('header ul.navlist');
    const navPill = document.getElementById('navPill');
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const heroImg = document.querySelector('.img-hero');
    const aboutImg = document.querySelector('.about-img');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    if (scrollProgress) {
        scrollProgress.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function moveNavPill(targetLink) {
        if (!navPill || !navList || !targetLink || window.innerWidth <= 768) {
            if (navPill) navPill.style.opacity = '0';
            return;
        }
        const listRect = navList.getBoundingClientRect();
        const linkRect = targetLink.getBoundingClientRect();
        navPill.style.left = `${linkRect.left - listRect.left}px`;
        navPill.style.width = `${linkRect.width}px`;
        navPill.style.opacity = '1';
    }

    menuLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => moveNavPill(link));
    });
    if (navList) {
        navList.addEventListener('mouseleave', () => {
            const active = navList.querySelector('a.active');
            if (active) moveNavPill(active);
        });
    }

    function updateScrollUI() {
        ticking = false;
        const pos = window.scrollY || document.documentElement.scrollTop;
        const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const pct = calcHeight > 0 ? Math.min(100, Math.max(0, (pos * 100) / calcHeight)) : 0;

        if (header) header.classList.toggle('scrolled', pos > 50);
        if (topBar) topBar.style.width = `${pct}%`;

        if (scrollProgress) {
            const rounded = Math.round(pct);
            scrollProgress.style.display = pos > 120 ? 'grid' : 'none';
            scrollProgress.style.background =
                `conic-gradient(var(--accent-primary) ${rounded}%, rgba(139,92,246,0.15) ${rounded}%)`;
        }

        let currentId = sections[0] ? sections[0].id : 'home';
        const offset = pos + 140;
        for (let i = 0; i < sections.length; i++) {
            if (offset >= sections[i].offsetTop) {
                currentId = sections[i].id;
            }
        }
        let activeEl = null;
        menuLinks.forEach((link) => {
            const isMatch = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('active', isMatch);
            if (isMatch) activeEl = link;
        });
        if (activeEl) moveNavPill(activeEl);

        // Subtle Scroll Parallax
        if (!prefersReduced && window.innerWidth > 991) {
            if (heroImg && pos < 900) {
                heroImg.style.transform = `translate3d(0, ${(pos * 0.08).toFixed(1)}px, 0)`;
            }
            if (aboutImg) {
                const rect = aboutImg.getBoundingClientRect();
                const centerDelta = (rect.top + rect.height / 2 - window.innerHeight / 2) * -0.04;
                aboutImg.style.transform = `translate3d(0, ${Math.max(-24, Math.min(24, centerDelta)).toFixed(1)}px, 0)`;
            }
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateScrollUI);
        }
    }, { passive: true });
    window.addEventListener('resize', updateScrollUI);
    window.addEventListener('load', updateScrollUI);
    updateScrollUI();
})();

// =============================================
// Hamburger Menu
// =============================================
(function () {
    const menuIcon = document.querySelector('.menu-icon');
    const navlist = document.querySelector('.navlist');
    const overlay = document.querySelector('.overlay');
    if (!menuIcon || !navlist) return;

    function closeMenu() {
        navlist.classList.remove('active');
        menuIcon.classList.remove('active');
        document.body.classList.remove('open');
    }

    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('active');
        navlist.classList.toggle('active');
        document.body.classList.toggle('open');
    });

    navlist.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') closeMenu();
    });

    if (overlay) overlay.addEventListener('click', closeMenu);
})();

// =============================================
// About Tab Switching
// =============================================
(function () {
    const buttons = document.querySelectorAll('.about-btn button');
    const contents = document.querySelectorAll('.content-btn .content');

    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            contents.forEach((c) => {
                c.style.display = 'none';
                c.classList.remove('tab-anim');
            });
            if (contents[index]) {
                contents[index].style.display = 'block';
                void contents[index].offsetWidth;
                contents[index].classList.add('tab-anim');
            }
            buttons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
})();

// =============================================
// Desktop Pointer Enhancements: Physics Cursor Ring, Glow, Spotlight, 3D Tilt & Magnetic CTA
// =============================================
(function () {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return;

    document.body.classList.add('has-pointer');
    const glow = document.getElementById('cursorGlow');
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const ringLabel = ring ? ring.querySelector('.cursor-ring-label') : null;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (glow) {
            glow.style.opacity = '1';
            glow.style.left = `${mx}px`;
            glow.style.top = `${my}px`;
        }
        if (dot) {
            dot.style.opacity = '1';
            dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        }
        if (ring) ring.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        if (glow) glow.style.opacity = '0';
        if (dot) dot.style.opacity = '0';
        if (ring) ring.style.opacity = '0';
    });

    if (ring) {
        function animateCursor() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);

        document.addEventListener('mouseover', (e) => {
            const portfolioCard = e.target.closest('.portfolio-box');
            const interactive = e.target.closest('a, button, input, textarea, .tech-icon, .sa-fab');
            if (portfolioCard && !e.target.closest('a')) {
                ring.classList.remove('is-hover');
                ring.classList.add('is-view');
                if (ringLabel) ringLabel.textContent = 'VIEW';
                if (dot) dot.classList.add('is-hidden');
            } else if (interactive) {
                ring.classList.remove('is-view');
                ring.classList.add('is-hover');
                if (ringLabel) ringLabel.textContent = '';
                if (dot) dot.classList.remove('is-hidden');
            } else {
                ring.classList.remove('is-hover', 'is-view');
                if (ringLabel) ringLabel.textContent = '';
                if (dot) dot.classList.remove('is-hidden');
            }
        });
    }

    const spotlightSelectors = [
        '.portfolio-box',
        '.servicesItem',
        '.award-item',
        '.tech-category',
        '.contact-info-card',
        '.github-stats',
        '.github-activity'
    ].join(',');

    document.querySelectorAll(spotlightSelectors).forEach((el) => {
        el.classList.add('spotlight-card');
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            el.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }, { passive: true });
    });

    const tiltTargets = document.querySelectorAll('.portfolio-box, .servicesItem, .award-item');
    tiltTargets.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-5px)`;
        }, { passive: true });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    const heroWrap = document.querySelector('.img-hero-wrapper');
    if (heroWrap) {
        heroWrap.addEventListener('mousemove', (e) => {
            const rect = heroWrap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroWrap.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
        }, { passive: true });
        heroWrap.addEventListener('mouseleave', () => {
            heroWrap.style.transform = '';
        });
    }

    document.querySelectorAll('.btn-box .btn, .send-btn').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.14;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.14;
            btn.style.transform = `translate(${x.toFixed(1)}px, ${(y - 2).toFixed(1)}px)`;
        }, { passive: true });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
})();

// =============================================
// Native IntersectionObserver Staggered Reveal
// =============================================
(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) return;

    const groups = [
        '.main-text',
        '.about-img',
        '.about-content',
        '.tech-category',
        '.servicesItem',
        '.proposal',
        '.award-item',
        '.github-activity',
        '.contact-info-card',
        '.social-contact',
        '.contact-form-container'
    ];

    const targets = document.querySelectorAll(groups.join(','));
    targets.forEach((el, idx) => {
        el.classList.add('reveal');
        const siblings = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : idx;
        el.style.setProperty('--reveal-delay', `${Math.min(siblings * 70, 280)}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                const tag = entry.target.querySelector('.section-tag');
                if (tag && !tag.dataset.scrambled) {
                    scrambleText(tag);
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    function scrambleText(el) {
        const finalText = el.textContent.trim();
        if (!finalText) return;
        el.dataset.scrambled = 'true';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*';
        let iteration = 0;
        const interval = setInterval(() => {
            el.textContent = finalText
                .split('')
                .map((ch, idx) => {
                    if (ch === ' ') return ' ';
                    if (idx < iteration) return finalText[idx];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            iteration += 0.6;
            if (iteration >= finalText.length) {
                el.textContent = finalText;
                clearInterval(interval);
            }
        }, 28);
    }

    targets.forEach((el) => revealObserver.observe(el));
})();

// =============================================
// Interactive Portfolio Engine: Filter, Search, Pagination & Modal
// =============================================
(function () {
    const gallery = document.getElementById('portfolioGallery');
    const filterContainer = document.getElementById('portfolioFilters');
    const searchInput = document.getElementById('projectSearch');
    const clearSearchBtn = document.getElementById('clearProjectSearch');
    const countLabel = document.getElementById('projectCountLabel');
    const emptyState = document.getElementById('portfolioEmpty');
    const resetBtn = document.getElementById('resetPortfolioFilters');
    const toggleWrap = document.getElementById('portfolioToggleWrap');
    const toggleAllBtn = document.getElementById('toggleAllProjects');

    if (!gallery || !filterContainer) return;

    const INITIAL_LIMIT = 9;
    let activeFilter = 'all';
    let searchQuery = '';
    let showAll = false;

    const cards = Array.from(gallery.querySelectorAll('.portfolio-box'));
    const filterButtons = Array.from(filterContainer.querySelectorAll('button[data-filter]'));

    // Inject quick-view hint badge on each card
    cards.forEach((card) => {
        if (!card.querySelector('.portfolio-quick-hint')) {
            const hint = document.createElement('span');
            hint.className = 'portfolio-quick-hint';
            hint.innerHTML = '<i class="bx bx-expand-alt"></i> Quick View';
            card.appendChild(hint);
        }
    });

    // Populate dynamic filter counts
    filterButtons.forEach((btn) => {
        const key = btn.dataset.filter;
        const countEl = btn.querySelector('.filter-count');
        if (!countEl) return;
        const count = key === 'all'
            ? cards.length
            : cards.filter((c) => c.classList.contains(key)).length;
        countEl.textContent = count;
    });

    function renderPortfolio(animate) {
        const q = searchQuery.trim().toLowerCase();
        const matching = [];

        cards.forEach((card) => {
            const matchesCat = activeFilter === 'all' || card.classList.contains(activeFilter);
            const text = card.textContent.toLowerCase();
            const matchesQuery = !q || text.includes(q);
            if (matchesCat && matchesQuery) {
                matching.push(card);
            }
        });

        const isDefaultView = activeFilter === 'all' && !q;
        const limit = (isDefaultView && !showAll) ? INITIAL_LIMIT : matching.length;
        const visibleSet = new Set(matching.slice(0, limit));

        let animIdx = 0;
        cards.forEach((card) => {
            if (visibleSet.has(card)) {
                card.classList.remove('is-hidden');
                if (animate) {
                    card.classList.remove('card-enter');
                    void card.offsetWidth;
                    card.style.animationDelay = `${Math.min(animIdx * 28, 240)}ms`;
                    card.classList.add('card-enter');
                }
                animIdx++;
            } else {
                card.classList.add('is-hidden');
                card.classList.remove('card-enter');
            }
        });

        if (countLabel) {
            countLabel.textContent = matching.length === 0
                ? '0 projects found'
                : `Showing ${visibleSet.size} of ${matching.length} project${matching.length === 1 ? '' : 's'}`;
        }

        if (emptyState) emptyState.hidden = matching.length > 0;

        if (toggleWrap && toggleAllBtn) {
            const needToggle = isDefaultView && matching.length > INITIAL_LIMIT;
            toggleWrap.hidden = !needToggle;
            if (needToggle) {
                toggleAllBtn.innerHTML = showAll
                    ? '<span>Show Featured Projects</span><i class="bx bx-chevron-up"></i>'
                    : `<span>Show All ${matching.length} Projects</span><i class="bx bx-chevron-down"></i>`;
            }
        }
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            activeFilter = btn.dataset.filter;
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            renderPortfolio(true);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value;
            if (clearSearchBtn) clearSearchBtn.hidden = !searchQuery;
            renderPortfolio(false);
        });
    }

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearSearchBtn.hidden = true;
            renderPortfolio(true);
            searchInput.focus();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activeFilter = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            if (clearSearchBtn) clearSearchBtn.hidden = true;
            filterButtons.forEach((b) => b.classList.toggle('active', b.dataset.filter === 'all'));
            renderPortfolio(true);
        });
    }

    if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
            showAll = !showAll;
            renderPortfolio(true);
        });
    }

    renderPortfolio(false);

    // Project Quick-View Modal
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('pmodalClose');
    const modalMedia = document.getElementById('pmodalMedia');
    const modalTags = document.getElementById('pmodalTags');
    const modalTitle = document.getElementById('pmodalTitle');
    const modalDesc = document.getElementById('pmodalDesc');
    const modalStack = document.getElementById('pmodalStack');
    const modalActions = document.getElementById('pmodalActions');

    function openProjectModal(card) {
        if (!modal) return;
        const img = card.querySelector('.portfolio-img img');
        const visual = card.querySelector('.portfolio-visual');
        const titleEl = card.querySelector('.portfolio-content h3');
        const descEl = card.querySelector('.portfolio-content p:not(.portfolio-keywords)');
        const kwEl = card.querySelector('.portfolio-keywords');
        const links = card.querySelectorAll('.portfolio-links a');

        modalMedia.innerHTML = '';
        if (img) {
            const clone = document.createElement('img');
            clone.src = img.src;
            clone.alt = img.alt;
            modalMedia.appendChild(clone);
        } else if (visual) {
            modalMedia.appendChild(visual.cloneNode(true));
        }

        const tagMap = {
            'web': 'Web Development',
            'ai-cloud': 'AI, Cloud & Security',
            'mobile': 'Mobile App',
            'branding': 'Branding'
        };
        modalTags.innerHTML = '';
        Object.keys(tagMap).forEach((cls) => {
            if (card.classList.contains(cls)) {
                const span = document.createElement('span');
                span.className = 'pmodal-tag';
                span.textContent = tagMap[cls];
                modalTags.appendChild(span);
            }
        });

        modalTitle.textContent = titleEl ? titleEl.textContent : '';
        modalDesc.textContent = descEl ? descEl.textContent : '';

        modalStack.innerHTML = '';
        if (kwEl) {
            const raw = kwEl.textContent.replace(/^Stack:\s*/i, '');
            raw.split(/[|,]/).map((s) => s.trim()).filter(Boolean).forEach((item) => {
                const pill = document.createElement('span');
                pill.className = 'pmodal-stack-pill';
                pill.textContent = item;
                modalStack.appendChild(pill);
            });
        }

        modalActions.innerHTML = '';
        links.forEach((a) => {
            const btn = document.createElement('a');
            btn.href = a.href;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
            btn.className = a.classList.contains('live') ? 'btn' : 'btn btn-outline';
            btn.innerHTML = a.innerHTML;
            modalActions.appendChild(btn);
        });

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!modal || !modal.classList.contains('open')) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openProjectModal(card);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectModal();
    });

    // Expose helper for Command Palette
    window.__openProjectByTitle = function (title) {
        const target = cards.find((c) => {
            const h3 = c.querySelector('h3');
            return h3 && h3.textContent.trim() === title;
        });
        if (target) openProjectModal(target);
    };
})();

// =============================================
// Command Palette (Ctrl+K / Cmd+K)
// =============================================
(function () {
    const palette = document.getElementById('cmdPalette');
    const trigger = document.getElementById('cmdTrigger');
    const input = document.getElementById('cmdInput');
    const results = document.getElementById('cmdResults');
    if (!palette || !input || !results) return;

    let selectedIdx = 0;
    let filteredItems = [];

    const navItems = [
        { group: 'Navigate', icon: 'bx-home-alt', title: 'Home', sub: 'Hero overview & stats', action: () => scrollToSection('#home') },
        { group: 'Navigate', icon: 'bx-user', title: 'About Me', sub: 'Bio, skills, experience, certifications & education', action: () => scrollToSection('#about') },
        { group: 'Navigate', icon: 'bx-layer', title: 'Tech Stack', sub: 'Frontend, Backend, Cloud, Mobile & Design tools', action: () => scrollToSection('#tech-skills') },
        { group: 'Navigate', icon: 'bx-cog', title: 'Services', sub: 'Web, Cloud/Backend, Mobile & UI/UX services', action: () => scrollToSection('#services') },
        { group: 'Navigate', icon: 'bx-briefcase-alt', title: 'Portfolio Projects', sub: 'Browse & search 38 projects', action: () => scrollToSection('#portfolio') },
        { group: 'Navigate', icon: 'bx-trophy', title: 'Awards & Achievements', sub: 'SLIIT Dean\'s List, Hackathons & CodeFest', action: () => scrollToSection('#awards') },
        { group: 'Navigate', icon: 'bx-envelope', title: 'Contact', sub: 'Send a message or copy contact info', action: () => scrollToSection('#contact') }
    ];

    const actionItems = [
        { group: 'Actions', icon: 'bx-bot', title: 'Ask Sakith\'s AI Assistant', sub: 'Open interactive knowledge chat', action: () => { const fab = document.getElementById('saToggle'); if (fab) fab.click(); } },
        { group: 'Actions', icon: 'bx-copy', title: 'Copy Email Address', sub: 'sakithchanlaka2004@gmail.com', action: () => copyText('sakithchanlaka2004@gmail.com', 'Email copied to clipboard!') },
        { group: 'Actions', icon: 'bx-download', title: 'Download Resume / CV', sub: 'Open resume.pdf in new tab', action: () => window.open('img/resume.pdf', '_blank', 'noopener') },
        { group: 'Actions', icon: 'bxl-github', title: 'Open GitHub Profile', sub: 'github.com/SakithLiyanage (42 repos)', action: () => window.open('https://github.com/SakithLiyanage', '_blank', 'noopener') },
        { group: 'Actions', icon: 'bxl-linkedin', title: 'Open LinkedIn Profile', sub: 'linkedin.com/in/sakith-chanlaka', action: () => window.open('https://www.linkedin.com/in/sakith-chanlaka/', '_blank', 'noopener') }
    ];

    const projectItems = Array.from(document.querySelectorAll('.portfolio-box')).map((card) => {
        const title = (card.querySelector('h3')?.textContent || '').trim();
        const kw = (card.querySelector('.portfolio-keywords')?.textContent || card.querySelector('p')?.textContent || '').trim();
        return {
            group: 'Projects',
            icon: 'bx-code-alt',
            title,
            sub: kw.slice(0, 90),
            action: () => {
                scrollToSection('#portfolio');
                setTimeout(() => {
                    if (window.__openProjectByTitle) window.__openProjectByTitle(title);
                }, 220);
            }
        };
    });

    const allItems = [...navItems, ...actionItems, ...projectItems];

    function scrollToSection(hash) {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    function renderResults() {
        const q = input.value.trim().toLowerCase();
        filteredItems = q
            ? allItems.filter((item) => item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q))
            : [...navItems, ...actionItems, ...projectItems.slice(0, 6)];

        selectedIdx = 0;
        results.innerHTML = '';

        if (filteredItems.length === 0) {
            results.innerHTML = '<div class="cmd-empty">No matching commands or projects.</div>';
            return;
        }

        let lastGroup = '';
        filteredItems.forEach((item, idx) => {
            if (item.group !== lastGroup) {
                lastGroup = item.group;
                const grp = document.createElement('div');
                grp.className = 'cmd-group-title';
                grp.textContent = item.group;
                results.appendChild(grp);
            }
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `cmd-item${idx === selectedIdx ? ' selected' : ''}`;
            btn.innerHTML = `<i class="bx ${item.icon}"></i><span class="cmd-item-text"><span class="cmd-item-title"></span><span class="cmd-item-sub"></span></span>`;
            btn.querySelector('.cmd-item-title').textContent = item.title;
            btn.querySelector('.cmd-item-sub').textContent = item.sub;
            btn.addEventListener('click', () => {
                closePalette();
                item.action();
            });
            btn.addEventListener('mouseenter', () => {
                selectedIdx = idx;
                updateSelection();
            });
            results.appendChild(btn);
        });
    }

    function updateSelection() {
        const btns = results.querySelectorAll('.cmd-item');
        btns.forEach((b, i) => {
            b.classList.toggle('selected', i === selectedIdx);
            if (i === selectedIdx) b.scrollIntoView({ block: 'nearest' });
        });
    }

    function openPalette() {
        palette.classList.add('open');
        palette.setAttribute('aria-hidden', 'false');
        input.value = '';
        renderResults();
        setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
        if (!palette.classList.contains('open')) return;
        palette.classList.remove('open');
        palette.setAttribute('aria-hidden', 'true');
    }

    if (trigger) trigger.addEventListener('click', openPalette);
    palette.addEventListener('click', (e) => {
        if (e.target === palette) closePalette();
    });
    input.addEventListener('input', renderResults);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (filteredItems.length) {
                selectedIdx = (selectedIdx + 1) % filteredItems.length;
                updateSelection();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (filteredItems.length) {
                selectedIdx = (selectedIdx - 1 + filteredItems.length) % filteredItems.length;
                updateSelection();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredItems[selectedIdx]) {
                const chosen = filteredItems[selectedIdx];
                closePalette();
                chosen.action();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (palette.classList.contains('open')) closePalette();
            else openPalette();
        } else if (e.key === 'Escape') {
            closePalette();
        }
    });
})();

// =============================================
// One-Click Copy Buttons
// =============================================
function copyText(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast(label || 'Copied to clipboard!'));
    } else {
        const tmp = document.createElement('textarea');
        tmp.value = text;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        tmp.remove();
        showToast(label || 'Copied to clipboard!');
    }
}

document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const val = btn.dataset.copy;
        if (!val) return;
        copyText(val, `Copied: ${val}`);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = 'bx bx-check';
            setTimeout(() => { icon.className = 'bx bx-copy'; }, 1600);
        }
    });
});

// =============================================
// Hero Typing Animation
// =============================================
(function () {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const roles = [
        'Software Engineer',
        'Full Stack Developer',
        'Cloud & Backend Architect',
        'Mobile App Developer',
        'UI/UX Designer',
        'Open Source Contributor'
    ];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = true;
    typingText.textContent = roles[0];

    function type() {
        const currentRole = roles[roleIndex];
        let delay = 110;

        if (isDeleting) {
            charIndex--;
            typingText.textContent = currentRole.substring(0, charIndex);
            delay = 55;
        } else {
            charIndex++;
            typingText.textContent = currentRole.substring(0, charIndex);
            delay = 105;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            delay = 1900;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 420;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 1800);
})();

// =============================================
// Counter Animation for Stats
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const raw = entry.target.textContent.trim();
                const match = raw.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
                if (!match) return;
                const cleanNum = match[1].replace(/,/g, '');
                const num = parseFloat(cleanNum);
                if (isNaN(num)) return;
                const decimals = cleanNum.includes('.') ? cleanNum.split('.')[1].length : 0;
                const useCommas = match[1].includes(',');
                const suffix = match[2] || '';
                let frame = 0;
                const totalFrames = 40;
                const interval = setInterval(() => {
                    frame++;
                    const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
                    const value = num * progress;
                    let formatted = decimals > 0
                        ? value.toFixed(decimals)
                        : Math.round(value).toString();
                    if (useCommas) formatted = Number(formatted).toLocaleString();
                    entry.target.textContent = formatted + suffix;
                    if (frame >= totalFrames) {
                        entry.target.textContent = raw;
                        clearInterval(interval);
                    }
                }, 28);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach((el) => observer.observe(el));
});

// =============================================
// Interactive Hero Engineering Terminal & Live Clock
// =============================================
(function () {
    const body = document.getElementById('termBody');
    const input = document.getElementById('termInput');
    const quickBtns = document.querySelectorAll('#termQuickCmds button[data-cmd]');
    const clockEl = document.getElementById('liveClock');

    if (clockEl) {
        function updateClock() {
            try {
                clockEl.textContent = new Date().toLocaleTimeString('en-GB', {
                    timeZone: 'Asia/Colombo',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) + ' +05:30';
            } catch {
                clockEl.textContent = 'UTC+5:30';
            }
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    if (!body || !input) return;

    const history = [];
    let histIdx = -1;

    const COMMANDS = {
        help: () => [
            { cls: 'term-out-key', text: 'Available commands:' },
            { cls: '', text: '  whoami      - engineer summary & current role' },
            { cls: '', text: '  stack       - core languages, frameworks & cloud' },
            { cls: '', text: '  projects    - flagship builds & research' },
            { cls: '', text: '  experience  - work & leadership history' },
            { cls: '', text: '  awards      - Dean\'s List & hackathons' },
            { cls: '', text: '  neofetch    - system specs & GitHub telemetry' },
            { cls: '', text: '  contact     - email, GitHub & LinkedIn' },
            { cls: '', text: '  clear       - clear terminal output' }
        ],
        whoami: () => [
            { cls: 'term-out-ok', text: 'Sakith Liyanage (G.L.S. Chanlaka) · Software Engineer' },
            { cls: '', text: 'role:    Software Engineer @ Data Management Systems (Division 2)' },
            { cls: '', text: 'degree:  BSc (Hons) Software Engineering @ SLIIT (GPA 3.55)' },
            { cls: '', text: 'focus:   Full-Stack Web, Spring Boot / .NET 8, Flutter & AI' }
        ],
        stack: () => [
            { cls: 'term-out-key', text: 'Languages:  Java, TypeScript, JS, C#, Kotlin, Python, Dart' },
            { cls: 'term-out-accent', text: 'Frontend:   React 18, Next.js, Vite, Tailwind, Framer Motion' },
            { cls: 'term-out-ok', text: 'Backend:    Spring Boot, ASP.NET Core (.NET 8), Node/Express, Prisma' },
            { cls: '', text: 'Cloud/DB:   PostgreSQL, MongoDB, RabbitMQ, Docker, K8s, AWS' }
        ],
        projects: () => [
            { cls: 'term-out-key', text: '[01] Solvance    - Solar Microgrid Trading (.NET, React, Android)' },
            { cls: 'term-out-accent', text: '[02] HEART       - Mobile Robustness Testing (Qwen2-VL, React)' },
            { cls: 'term-out-ok', text: '[03] BizPilot AI - SME WhatsApp AI OS (TS, Prisma, Groq, Flutter)' },
            { cls: '', text: '[04] BuildMart   - 25 CWE Security Fixes + Google OAuth 2.0' },
            { cls: 'term-out-muted', text: '-> Tip: click any card below or press Ctrl+K to inspect all 38' }
        ],
        experience: () => [
            { cls: 'term-out-ok', text: '● Data Management Systems (Pvt) Ltd — Division 2' },
            { cls: '', text: '  Software Engineer · Full-time (Hybrid) · Aug 2025 – Present' },
            { cls: 'term-out-muted', text: '  Enterprise full-stack apps, REST APIs & scalable systems' }
        ],
        education: () => [
            { cls: 'term-out-key', text: 'SLIIT (2023–2027): BSc (Hons) IT — Software Engineering' },
            { cls: '', text: 'Cumulative GPA: 3.55 · 3× Dean\'s List (SGPA > 3.70)' },
            { cls: 'term-out-muted', text: 'Mahinda Rajapaksha College (2016–2022) · President, Commerce Soc.' }
        ],
        awards: () => [
            { cls: 'term-out-ok', text: '★ 3× Dean\'s List Honoree — SLIIT (SGPA 3.7+)' },
            { cls: 'term-out-key', text: '★ 1st Runners-Up — SLIIT MS Club Mini Hackathon 2025' },
            { cls: 'term-out-accent', text: '★ Top 10 Finalist — ReviveNation CodeFest 2025 (e-Grama)' }
        ],
        github: () => [
            { cls: 'term-out-key', text: 'github.com/SakithLiyanage' },
            { cls: '', text: 'Public Repos: 42 | Past Year: 1,650+ contributions | 2,700+ total' }
        ],
        neofetch: () => [
            { cls: 'term-out-accent', text: 'sakith@colombo-lk' },
            { cls: 'term-out-muted', text: '-----------------' },
            { cls: '', text: 'OS:      Full-Stack Engineer v4.0 (Sri Lanka)' },
            { cls: '', text: 'Kernel:  Java Spring Boot · .NET 8 · Node.js · React/Next' },
            { cls: '', text: 'Uptime:  5+ years coding (since May 2021)' },
            { cls: '', text: 'GitHub:  42 repos · 1,650+ commits/yr' },
            { cls: 'term-out-ok', text: 'Status:  200 OK — Open to collaborations' }
        ],
        contact: () => [
            { cls: 'term-out-key', text: 'Email:    sakithchanlaka2004@gmail.com' },
            { cls: '', text: 'Phone:    +94 76 909 2755' },
            { cls: '', text: 'LinkedIn: linkedin.com/in/sakith-chanlaka' },
            { cls: '', text: 'GitHub:   github.com/SakithLiyanage' }
        ],
        ls: () => [
            { cls: 'term-out-key', text: 'skills.json  experience.log  certs.yml  education.md  github.stat' }
        ]
    };
    COMMANDS.skills = COMMANDS.stack;

    function appendLine(text, cls) {
        const div = document.createElement('div');
        div.className = cls ? `term-line ${cls}` : 'term-line';
        div.textContent = text;
        body.appendChild(div);
    }

    function runCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;
        history.unshift(rawCmd);
        histIdx = -1;

        if (cmd === 'clear') {
            body.innerHTML = '';
            return;
        }

        appendLine(`$ ${rawCmd}`, 'term-cmd-echo');
        const handler = COMMANDS[cmd];
        if (handler) {
            handler().forEach((line) => appendLine(line.text, line.cls));
        } else {
            appendLine(`zsh: command not found: ${cmd}. Try 'help'.`, 'term-out-muted');
        }
        body.scrollTop = body.scrollHeight;
    }

    // Boot output
    runCommand('whoami');
    appendLine('Type `help` or click a command chip above.', 'term-out-muted');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runCommand(input.value);
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (histIdx + 1 < history.length) {
                histIdx++;
                input.value = history[histIdx];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx > 0) {
                histIdx--;
                input.value = history[histIdx];
            } else {
                histIdx = -1;
                input.value = '';
            }
        }
    });

    quickBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cmd = btn.dataset.cmd;
            if (cmd) runCommand(cmd);
        });
    });
})();
