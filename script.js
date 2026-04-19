// =============================================
// Particle Canvas Background
// =============================================
(function() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#a78bfa', '#22d3ee'];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = randomBetween(0, canvas.width);
            this.y = randomBetween(0, canvas.height);
            this.r = randomBetween(0.8, 2.5);
            this.vx = randomBetween(-0.25, 0.25);
            this.vy = randomBetween(-0.35, -0.1);
            this.alpha = randomBetween(0.3, 0.8);
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= 0.001;
            if (this.alpha <= 0 || this.y < -10) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 90; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animate);
    }
    animate();
})();

// =============================================
// Header scroll effect
// =============================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// =============================================
// Hamburger Menu
// =============================================
let menuIcon = document.querySelector(".menu-icon");
let navlist  = document.querySelector(".navlist");

menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("active");
    navlist.classList.toggle("active");
    document.body.classList.toggle("open");
});

navlist.addEventListener("click", () => {
    navlist.classList.remove("active");
    menuIcon.classList.remove("active");
    document.body.classList.remove("open");
});

// =============================================
// Rotate Text (hero)
// =============================================
let textEl = document.querySelector(".text p");
if (textEl) {
    textEl.innerHTML = textEl.innerHTML.split("").map((char, i) =>
        `<b style="transform:rotate(${i * 6.3}deg)">${char}</b>`
    ).join("");
}

// =============================================
// About Tab Switching
// =============================================
const buttons  = document.querySelectorAll('.about-btn button');
const contents = document.querySelectorAll('.content');

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        contents.forEach(c => c.style.display = 'none');
        contents[index].style.display = 'block';
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// =============================================
// Portfolio Filter (MixItUp)
// =============================================
var mixer = mixitup('.portfolio-gallery', {
    selectors: { target: '.portfolio-box' },
    animation: { duration: 450, easing: 'cubic-bezier(0.4,0,0.2,1)' }
});

// =============================================
// Swiper (testimonials — keep for backward compat)
// =============================================
if (document.querySelector('.mySwiper')) {
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: { el: ".swiper-pagination", clickable: true },
        autoplay: { delay: 3000, disableOnInteraction: false },
        breakpoints: {
            576:  { slidesPerView: 2, spaceBetween: 10  },
            1200: { slidesPerView: 3, spaceBetween: 20  },
        }
    });
}

// =============================================
// Scroll-to-Top Progress Ring
// =============================================
let calcScrollValue = () => {
    let scrollProgress = document.getElementById("progress");
    let pos         = document.documentElement.scrollTop;
    let calcHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);

    scrollProgress.style.display = pos > 100 ? "grid" : "none";

    scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });

    scrollProgress.style.background =
        `conic-gradient(var(--accent-primary) ${scrollValue}%, rgba(139,92,246,0.15) ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload   = calcScrollValue;

// =============================================
// Active Nav Link on Scroll
// =============================================
let menuLi  = document.querySelectorAll("header ul li a");
let section = document.querySelectorAll('section');

function activeMenu() {
    let len = section.length;
    while (--len && window.scrollY + 97 < section[len].offsetTop) {}
    menuLi.forEach(sec => sec.classList.remove("active"));
    if (menuLi[len]) menuLi[len].classList.add("active");
}
activeMenu();
window.addEventListener("scroll", activeMenu);

// =============================================
// Scroll Reveal
// =============================================
ScrollReveal({
    distance:  "60px",
    duration:  1000,
    delay:     150,
    easing:    'cubic-bezier(0.4, 0, 0.2, 1)',
});

ScrollReveal().reveal('.hero-info, .main-text, .proposal, .heading', { origin: "top" });
ScrollReveal().reveal('.about-img, .fillter-buttons, .contact-info', { origin: "left" });
ScrollReveal().reveal('.about-content, .tech-stack', { origin: "right" });
ScrollReveal().reveal('.allServices, .portfolio-gallery, footer, .img-hero, .tech-categories, .awards-container, .contact-container', { origin: "bottom" });

// =============================================
// Hero Typing Animation
// =============================================
const typingText = document.querySelector(".typing-text");
if (typingText) {
    const roles = [
        "Associate Software Engineer",
        "Full Stack Developer",
        "UI/UX Designer",
        "Open Source Contributor"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed  = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 60;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause start
        }

        setTimeout(type, typeSpeed);
    }
    
    // Minimal delay before starting
    setTimeout(type, 1200);
}

// =============================================
// Typing dots animation
// =============================================
const dotStyle = document.createElement('style');
dotStyle.textContent = `
    .typing .dot {
        display: inline-block;
        width: 7px; height: 7px;
        border-radius: 50%;
        margin: 0 2px;
        background: var(--accent-primary);
        animation: typingBounce 1.4s infinite ease-in-out;
    }
    .typing .dot:nth-child(2) { animation-delay: 0.2s; }
    .typing .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30%           { transform: translateY(-8px); }
    }
`;
document.head.appendChild(dotStyle);

// =============================================
// Counter animation for stats
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const text = entry.target.textContent;
                const num  = parseInt(text);
                if (isNaN(num)) return;
                const suffix = text.replace(/[0-9]/g, '');
                let current = 0;
                const step = Math.ceil(num / 50);
                const interval = setInterval(() => {
                    current = Math.min(current + step, num);
                    entry.target.textContent = current + suffix;
                    if (current >= num) clearInterval(interval);
                }, 40);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
});
