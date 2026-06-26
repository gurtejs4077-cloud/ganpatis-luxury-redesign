/* ============================
   GANPATIS — LUXURY INTERACTIONS
============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ——— LOADER ———
    const loader       = document.getElementById('loader');
    const progress     = document.getElementById('loader-progress');
    let loadProgress   = 0;

    const progressTimer = setInterval(() => {
        loadProgress += Math.random() * 18 + 5;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(progressTimer);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.querySelector('.hero').classList.add('loaded');
                // Trigger initial animations
                document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
                    setTimeout(() => el.classList.add('active'), 400 + i * 160);
                });
            }, 400);
        }
        progress.style.width = loadProgress + '%';
    }, 100);

    // ——— CUSTOM CURSOR ———
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followX = 0, followY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
        followX += (mouseX - followX) * 0.1;
        followY += (mouseY - followY) * 0.1;
        follower.style.left = followX + 'px';
        follower.style.top  = followY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // ——— NAVBAR ———
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('dark-mode');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('dark-mode');
        }
    });
    navbar.classList.add('dark-mode');

    // ——— HAMBURGER ———
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    // ——— SCROLL REVEAL ———
    const revealEls = document.querySelectorAll('.reveal-up');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => {
        // Skip hero elements (handled by loader)
        if (!el.closest('.hero')) revealObs.observe(el);
    });

    // ——— HERO PARALLAX ———
    const heroImg = document.getElementById('hero-img');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
        }
    });

    // ——— SMOOTH ANCHOR SCROLL ———
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = document.getElementById('navbar').offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('open');
            }
        });
    });

    // ——— PRODUCT CARD MAGNETIC HOVER ———
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s';
        });
    });

    // ——— TICKER PAUSE ON HOVER ———
    const ticker = document.querySelector('.ticker');
    if (ticker) {
        ticker.addEventListener('mouseenter', () => { ticker.style.animationPlayState = 'paused'; });
        ticker.addEventListener('mouseleave', () => { ticker.style.animationPlayState = 'running'; });
    }

});
