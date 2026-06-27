/* ============================
   GANPATIS — LUXURY INTERACTIONS
   Performance-optimised version
============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ——— REDUCED MOTION CHECK ———
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ——— NATIVE SCROLL HANDLING (Lenis removed) ———

    // ——— NAVBAR scroll handling ———
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
                navbar.classList.remove('dark-mode');
            } else {
                navbar.classList.remove('scrolled');
                navbar.classList.add('dark-mode');
            }
        }, { passive: true });
        navbar.classList.add('dark-mode');
    }

    // ——— HERO PARALLAX (only when in viewport, skip if reduced motion) ———
    const heroEl = document.getElementById('hero-video') || document.getElementById('hero-img');
    const heroH = window.innerHeight;
    if (heroEl && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if (scroll < heroH) {
                heroEl.style.transform = `scale(1) translate3d(0, ${scroll * 0.2}px, 0)`;
            }
        }, { passive: true });
    }

    // ——— SMOOTH ANCHOR SCROLL ———
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburger  = document.getElementById('hamburger');
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 68;
                const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
                if (mobileMenu) mobileMenu.classList.remove('open');
                if (hamburger) hamburger.classList.remove('open');
            }
        });
    });

    // ——— HORIZONTAL DRAG SCROLL ———
    const hscrollWrap  = document.querySelector('.hscroll-wrap');
    if (hscrollWrap) {
        let isDragging = false;
        let isHovered = false;
        let startX, scrollLeft;
        const autoScrollSpeed = 0.6;

        function autoScroll() {
            if (!isDragging && !isHovered) {
                hscrollWrap.scrollLeft += autoScrollSpeed;
                if (hscrollWrap.scrollLeft >= (hscrollWrap.scrollWidth - hscrollWrap.clientWidth - 1)) {
                    hscrollWrap.scrollLeft = 0;
                }
            }
        }

        // Touch support
        hscrollWrap.addEventListener('touchstart', (e) => {
            isHovered = true;
            startX = e.touches[0].pageX;
            scrollLeft = hscrollWrap.scrollLeft;
        }, { passive: true });
        hscrollWrap.addEventListener('touchend', () => { isHovered = false; }, { passive: true });
        hscrollWrap.addEventListener('touchmove', (e) => {
            hscrollWrap.scrollLeft = scrollLeft - (e.touches[0].pageX - startX);
        }, { passive: true });

        hscrollWrap.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - hscrollWrap.offsetLeft;
            scrollLeft = hscrollWrap.scrollLeft;
            hscrollWrap.style.cursor = 'grabbing';
        });
        hscrollWrap.addEventListener('mouseenter', () => { isHovered = true; });
        hscrollWrap.addEventListener('mouseleave', () => {
            isHovered = false;
            if (isDragging) { isDragging = false; }
            hscrollWrap.style.cursor = 'grab';
        });
        hscrollWrap.addEventListener('mouseup', () => {
            isDragging = false;
            hscrollWrap.style.cursor = 'grab';
        });
        hscrollWrap.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - hscrollWrap.offsetLeft;
            hscrollWrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });

        // Integrate auto-scroll into unified rAF loop
        window.__autoScroll = autoScroll;
    }

    // ——— UNIFIED RAF LOOP — one loop for everything ———
    // Cursor state (module-scoped)
    let mouseX = 0, mouseY = 0;
    let followX = 0, followY = 0;
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    function unifiedLoop(time) {
        // Cursor follower interpolation (GPU-composited via translate3d)
        followX += (mouseX - followX) * 0.1;
        followY += (mouseY - followY) * 0.1;
        if (follower) {
            follower.style.transform = `translate3d(${followX - 18}px, ${followY - 18}px, 0)`;
        }

        // Auto scroll for carousel
        if (window.__autoScroll) window.__autoScroll();

        requestAnimationFrame(unifiedLoop);
    }
    requestAnimationFrame(unifiedLoop);
    // ——— CURSOR — use translate3d for GPU layer ———
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
        }, { passive: true });
    }
    // Rewrite cursor CSS to use transform instead of top/left
    if (cursor) {
        cursor.style.left = '0';
        cursor.style.top  = '0';
    }
    if (follower) {
        follower.style.left = '0';
        follower.style.top  = '0';
    }

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

    // ——— INTERSECTION OBSERVER — shared for all reveals ———
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObs.unobserve(entry.target); // unobserve immediately — no repeat triggers
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-up, .split-text, .split-word').forEach(el => {
        if (!el.closest('.hero')) revealObs.observe(el);
    });

    // ——— LOADER ———
    const loader      = document.getElementById('loader');
    const counter     = document.getElementById('loader-counter');
    const heroSection = document.querySelector('.hero');
    let loadProgress  = 0;

    if (loader && counter) {
        // Snappy loader feel
        const progressTimer = setInterval(() => {
            loadProgress += Math.random() * 22 + 8;
            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(progressTimer);
                setTimeout(() => {
                    loader.classList.add('hidden');
                    if (heroSection) heroSection.classList.add('loaded');
                    document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
                        setTimeout(() => {
                            el.classList.add('active');
                            if (el.classList.contains('split-word')) el.classList.add('active');
                        }, 300 + i * 130);
                    });
                }, 350);
            }
            // Format to 3 digits (e.g. 008, 045, 100)
            counter.innerText = Math.floor(loadProgress).toString().padStart(3, '0');
        }, 80);
    }

    // ——— VIDEO crossfade from poster to video ———
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        const onVideoReady = () => heroSection.classList.add('video-ready');
        if (heroVideo.readyState >= 3) {
            onVideoReady();
        } else {
            heroVideo.addEventListener('canplay', onVideoReady, { once: true });
        }
    }

    // ——— HAMBURGER ———
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
    }

    // ——— PRODUCT CARD MAGNETIC HOVER ———
    // Use event delegation instead of per-card listeners
    const productSection = document.querySelector('.arrivals-section');
    if (productSection) {
        productSection.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(5px)`;
        });
        productSection.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;
            card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
        }, true);
    }

    // ——— TICKER PAUSE ON HOVER ———
    const ticker = document.querySelector('.ticker');
    if (ticker) {
        ticker.addEventListener('mouseenter', () => { ticker.style.animationPlayState = 'paused'; });
        ticker.addEventListener('mouseleave', () => { ticker.style.animationPlayState = 'running'; });
    }

    // ——— MAGNETIC BUTTONS ———
    document.querySelectorAll('.nav-explore-btn, .btn-ghost').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });

});
