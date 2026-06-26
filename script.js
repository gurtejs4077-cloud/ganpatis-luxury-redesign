/* ============================
   GANPATIS — LUXURY INTERACTIONS
============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ——— LENIS SMOOTH SCROLL ———
    const lenis = new Lenis({
        lerp: 0.07,
        smoothWheel: true,
        syncTouch: false,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ——— WORD SPLIT REVEAL ———
    function splitAndReveal(selector) {
        document.querySelectorAll(selector).forEach(el => {
            const text = el.textContent;
            const words = text.trim().split(/\s+/);
            el.innerHTML = words.map(w =>
                `<span class="word"><span class="word-inner">${w}</span></span>`
            ).join(' ');
        });
    }
    splitAndReveal('.split-text');
    splitAndReveal('.split-word');

    // Observe split-text elements for reveal
    const splitObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                splitObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.split-text, .split-word').forEach(el => {
        if (!el.closest('.hero')) splitObs.observe(el);
    });

    // ——— LOADER ———
    const loader       = document.getElementById('loader');
    const progress     = document.getElementById('loader-progress');
    const heroVideo    = document.getElementById('hero-video');
    const heroSection  = document.querySelector('.hero');
    let loadProgress   = 0;

    const progressTimer = setInterval(() => {
        loadProgress += Math.random() * 18 + 5;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(progressTimer);
            setTimeout(() => {
                loader.classList.add('hidden');
                heroSection.classList.add('loaded');
                // Trigger hero text animations
                document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('active');
                        // For split-word in hero
                        if (el.classList.contains('split-word')) el.classList.add('active');
                    }, 400 + i * 160);
                });
            }, 400);
        }
        progress.style.width = loadProgress + '%';
    }, 100);

    // ——— VIDEO READINESS — crossfade from poster to video ———
    if (heroVideo) {
        const onVideoReady = () => heroSection.classList.add('video-ready');
        if (heroVideo.readyState >= 3) {
            onVideoReady();
        } else {
            heroVideo.addEventListener('canplaythrough', onVideoReady, { once: true });
        }
    }

    // ——— MUTE TOGGLE ———
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn && heroVideo) {
        muteBtn.addEventListener('click', () => {
            heroVideo.muted = !heroVideo.muted;
            muteBtn.textContent = heroVideo.muted ? '🔇' : '🔊';
        });
    }

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
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 60) {
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
        if (!el.closest('.hero')) revealObs.observe(el);
    });

    // ——— HERO PARALLAX (targets video) ———
    const heroEl = document.getElementById('hero-video') || document.getElementById('hero-img');
    lenis.on('scroll', ({ scroll }) => {
        if (heroEl && scroll < window.innerHeight) {
            heroEl.style.transform = `scale(1) translateY(${scroll * 0.25}px)`;
        }
    });

    // ——— SMOOTH ANCHOR SCROLL ———
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = document.getElementById('navbar').offsetHeight;
                lenis.scrollTo(target, { offset: -offset, duration: 1.6 });
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('open');
            }
        });
    });

    // ——— HORIZONTAL DRAG SCROLL ———
    const hscrollWrap  = document.querySelector('.hscroll-wrap');
    const hscrollTrack = document.getElementById('hscroll-track');
    if (hscrollWrap && hscrollTrack) {
        let isDragging = false;
        let startX, scrollLeft;

        hscrollWrap.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - hscrollWrap.offsetLeft;
            scrollLeft = hscrollWrap.scrollLeft;
            hscrollWrap.style.cursor = 'grabbing';
            lenis.stop(); // pause smooth scroll while dragging
        });
        hscrollWrap.addEventListener('mouseleave', () => {
            if (isDragging) { isDragging = false; lenis.start(); }
            hscrollWrap.style.cursor = 'grab';
        });
        hscrollWrap.addEventListener('mouseup', () => {
            isDragging = false;
            hscrollWrap.style.cursor = 'grab';
            lenis.start();
        });
        hscrollWrap.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - hscrollWrap.offsetLeft;
            const walk = (x - startX) * 1.5;
            hscrollWrap.scrollLeft = scrollLeft - walk;
        });

        // Touch support
        hscrollWrap.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = hscrollWrap.scrollLeft;
        }, { passive: true });
        hscrollWrap.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX;
            hscrollWrap.scrollLeft = scrollLeft - (x - startX);
        }, { passive: true });

        // Auto-scroll hint animation on section enter
        const hintObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Nudge scroll to hint at scrollability
                    setTimeout(() => {
                        hscrollWrap.scrollTo({ left: 80, behavior: 'smooth' });
                        setTimeout(() => hscrollWrap.scrollTo({ left: 0, behavior: 'smooth' }), 600);
                    }, 500);
                    hintObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        hintObs.observe(hscrollWrap);
    }

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
