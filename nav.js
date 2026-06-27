/* =============================================
   GANPATIS — NAV.JS
   Shared navigation: minimal navbar + slide panel
============================================= */

(function () {
    'use strict';

    /* ── build the slide panel HTML once ── */
    const PANEL_HTML = `
    <div class="nav-panel-overlay" id="nav-panel-overlay"></div>
    <aside class="nav-panel" id="nav-panel" aria-label="Navigation" role="dialog" aria-modal="true">

        <div class="nav-panel-head">
            <a href="index.html" class="nav-panel-logo">GANPATIS</a>
            <button class="nav-panel-close" id="nav-panel-close" aria-label="Close menu">
                <span></span><span></span>
            </button>
        </div>

        <nav class="nav-panel-body">

            <!-- Quick links -->
            <a href="instagram-collection.html" class="npl-item npl-highlight">
                <span>Instagram Collection</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </a>

            <!-- NEW ARRIVALS accordion -->
            <div class="npl-accordion">
                <button class="npl-accordion-trigger" aria-expanded="false">
                    <span>New Arrivals</span>
                    <svg class="npl-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                </button>
                <div class="npl-accordion-body">
                    <a href="new-arrivals.html?gender=all">All New</a>
                    <a href="new-arrivals.html?gender=girls">Women</a>
                    <a href="new-arrivals.html?gender=boys">Men</a>
                </div>
            </div>

            <!-- WOMEN accordion -->
            <div class="npl-accordion">
                <button class="npl-accordion-trigger" aria-expanded="false">
                    <span>Women</span>
                    <svg class="npl-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                </button>
                <div class="npl-accordion-body">
                    <p class="npl-acc-label">Style</p>
                    <a href="women.html?filter=kaftan">Kaftan</a>
                    <a href="women.html?filter=dress">Dress</a>
                    <a href="women.html?filter=jumpsuit">Jumpsuit</a>
                    <a href="women.html?filter=co-ord">Co-ord Set</a>
                    <a href="women.html?filter=salwar">Salwar Kameez</a>
                    <a href="women.html?filter=sharara">Sharara-Garara</a>
                    <a href="women.html?filter=anarkali">Anarkali</a>
                    <a href="women.html?filter=lehenga">Lehenga</a>
                    <a href="women.html?filter=gown">Gown</a>
                    <a href="women.html?filter=saree">Saree</a>
                    <a href="women.html?filter=kurti">Kurti &amp; Tunic</a>
                    <a href="women.html?filter=dupatta">Dupatta</a>
                    <p class="npl-acc-label">Occasion</p>
                    <a href="women.html?filter=haldi" class="npl-gold">Haldi</a>
                    <a href="women.html?filter=mehendi" class="npl-gold">Mehendi</a>
                    <a href="women.html?filter=cocktail">Cocktail</a>
                    <a href="women.html?filter=wedding">Wedding</a>
                    <a href="women.html?filter=reception">Reception</a>
                    <p class="npl-acc-label">Accessories</p>
                    <a href="women.html?filter=necklace">Necklace</a>
                    <a href="women.html?filter=earrings">Earrings</a>
                    <a href="women.html?filter=bags">Bags &amp; Clutches</a>
                </div>
            </div>

            <!-- MEN accordion -->
            <div class="npl-accordion">
                <button class="npl-accordion-trigger" aria-expanded="false">
                    <span>Men</span>
                    <svg class="npl-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                </button>
                <div class="npl-accordion-body">
                    <p class="npl-acc-label">Style</p>
                    <a href="men.html?filter=kurta">Kurta Set</a>
                    <a href="men.html?filter=nehru">Nehru Jacket Set</a>
                    <a href="men.html?filter=sherwani">Sherwani</a>
                    <a href="men.html?filter=bandhgala">Bandhgala</a>
                    <a href="men.html?filter=suit">Suit</a>
                    <a href="men.html?filter=tuxedo">Tuxedo</a>
                    <a href="men.html?filter=indo">Indo Western</a>
                    <p class="npl-acc-label">Occasion</p>
                    <a href="men.html?filter=haldi" class="npl-gold">Haldi</a>
                    <a href="men.html?filter=mehendi" class="npl-gold">Mehendi</a>
                    <a href="men.html?filter=wedding">Wedding</a>
                    <a href="men.html?filter=reception">Reception</a>
                    <a href="men.html?filter=groom">Groom</a>
                </div>
            </div>

            <!-- DESIGNERS accordion -->
            <div class="npl-accordion">
                <button class="npl-accordion-trigger" aria-expanded="false">
                    <span>Designers</span>
                    <svg class="npl-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                </button>
                <div class="npl-accordion-body">
                    <a href="designers.html?filter=al-ustaad">Al Ustaad By Ganpati's</a>
                    <a href="designers.html?filter=ablissa">Ablissa</a>
                    <a href="designers.html?filter=ankit-v-kapoor">Ankit V Kapoor</a>
                    <a href="designers.html?filter=ayushi-maniar">Ayushi Maniar</a>
                    <a href="designers.html?filter=dilli-darzi">Dilli Darzi</a>
                    <a href="designers.html?filter=ganpati">Ganpati's</a>
                    <a href="designers.html?filter=gopi-vaid">Gopi Vaid</a>
                    <a href="designers.html?filter=juhi-bengani" class="npl-gold">Juhi Bengani</a>
                    <a href="designers.html?filter=label-niti-bothra" class="npl-gold">Label Niti Bothra</a>
                    <a href="designers.html?filter=mandira-wirk">Mandira Wirk</a>
                    <a href="designers.html?filter=matsya">Matsya</a>
                    <a href="designers.html?filter=ohaila-khan" class="npl-gold">Ohaila Khan</a>
                    <a href="designers.html?filter=shalki" class="npl-gold">Shalki</a>
                    <a href="designers.html?filter=sheetal-batra">Sheetal Batra</a>
                    <a href="designers.html" class="npl-gold" style="margin-top:0.5rem;font-weight:600;">View All →</a>
                </div>
            </div>

            <!-- Direct links -->
            <a href="celebrity-closet.html" class="npl-item">
                <span>Celebrity Closet</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </a>
            <a href="wedding-edit.html" class="npl-item">
                <span>Wedding Edit</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </a>
            <a href="sale.html" class="npl-item npl-sale">
                <span>Sale</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            </a>

        </nav>

        <div class="nav-panel-foot">
            <a href="celebrity-closet.html">★ Celebrity Closet</a>
            <a href="sale.html" style="color:#c16452;">Sale →</a>
        </div>

    </aside>`;

    /* ── inject into DOM ── */
    document.body.insertAdjacentHTML('beforeend', PANEL_HTML);

    const overlay  = document.getElementById('nav-panel-overlay');
    const panel    = document.getElementById('nav-panel');
    const closeBtn = document.getElementById('nav-panel-close');
    const exploreBtn = document.getElementById('nav-explore-btn');

    /* ── open / close ── */
    function openPanel() {
        panel.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        panel.focus();
        if (exploreBtn) exploreBtn.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
        panel.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        if (exploreBtn) exploreBtn.setAttribute('aria-expanded', 'false');
    }

    exploreBtn && exploreBtn.addEventListener('click', () => {
        panel.classList.contains('open') ? closePanel() : openPanel();
    });
    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);

    /* ── keyboard: Escape ── */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });

    /* ── accordion ── */
    document.querySelectorAll('.npl-accordion-trigger').forEach(btn => {
        const body = btn.nextElementSibling;
        body.style.maxHeight = '0';
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            // collapse all others first
            document.querySelectorAll('.npl-accordion-trigger').forEach(other => {
                if (other !== btn) {
                    other.setAttribute('aria-expanded', 'false');
                    other.nextElementSibling.style.maxHeight = '0';
                    other.closest('.npl-accordion').classList.remove('open');
                }
            });
            // toggle this one
            btn.setAttribute('aria-expanded', String(!expanded));
            btn.closest('.npl-accordion').classList.toggle('open', !expanded);
            body.style.maxHeight = expanded ? '0' : body.scrollHeight + 'px';
        });
    });

    /* ── highlight active page in panel ── */
    const here = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-panel a').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href && href !== '#' && (href === here || href.startsWith(here.split('.')[0]))) {
            a.classList.add('npl-active');
        }
    });

    /* ── swipe-to-close on touch devices ── */
    let touchStartX = 0;
    panel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    panel.addEventListener('touchend', e => {
        if (e.changedTouches[0].clientX - touchStartX > 80) closePanel();
    }, { passive: true });

})();
