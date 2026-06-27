/* =========================================
   GANPATIS — WEDDING EDIT JS
   Filters: weddingeditwomen / weddingeditmen / bridal / wedding tags
========================================= */

(() => {

const PAGE_SIZE = 28;
let allProducts = [];   // the entire wedding edit pool (all genders)
let womenPool  = [];
let menPool    = [];
let filtered   = [];
let page       = 0;
let activeGender = 'women'; // women | men | all
let activeFilter = 'all';
let searchQuery  = '';

function formatPrice(variants) {
    const prices = (variants || []).map(v => parseFloat(v.price)).filter(p => !isNaN(p));
    if (!prices.length) return '';
    return 'From \u20b9 ' + Math.min(...prices).toLocaleString('en-IN');
}

function createTile(product) {
    const a = document.createElement('a');
    a.href = `product.html?id=${product.id}&src=wedding-edit`;
    a.className = 'product-tile';

    const hasAlt = product.all_images && product.all_images.length > 1;

    // Badge logic
    const isBride = (product.tags || []).some(t => t.toLowerCase() === 'bridal');
    const isBridesmaid = (product.tags || []).some(t => t.toLowerCase() === 'bridesmaid');
    let badge = '';
    if (isBride) badge = `<div class="product-badge" style="background:var(--c-gold);">Bridal</div>`;
    else if (isBridesmaid) badge = `<div class="product-badge" style="background:#8a6a3a;">Bridesmaid</div>`;

    a.innerHTML = `
        <div class="product-tile-img-wrap">
            <img class="product-tile-img" src="${product.primary_image || ''}" alt="${product.title}" loading="lazy">
            ${hasAlt ? `<img class="product-tile-img-alt" src="${product.all_images[1]}" alt="${product.title}" loading="lazy">` : ''}
            <div class="product-tile-overlay"><span>View Look \u2192</span></div>
            ${badge}
        </div>
        <div class="product-tile-info">
            <p class="product-tile-type">${product.product_type || ''}</p>
            <p class="product-tile-name">${product.title}</p>
            <p class="product-tile-price"><strong>${formatPrice(product.variants)}</strong></p>
        </div>
    `;
    return a;
}

function getPool() {
    if (activeGender === 'women') return womenPool;
    if (activeGender === 'men')   return menPool;
    return allProducts;
}

function applyFilters() {
    const q    = searchQuery.toLowerCase();
    const pool = getPool();

    filtered = pool.filter(p => {
        const matchFilter =
            activeFilter === 'all' ||
            (p.product_type && p.product_type.toLowerCase().includes(activeFilter.toLowerCase())) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())));

        const matchSearch =
            !q ||
            p.title.toLowerCase().includes(q) ||
            (p.product_type && p.product_type.toLowerCase().includes(q)) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));

        return matchFilter && matchSearch;
    });

    page = 0;
    renderGrid(true);
    updateCount();

    // Update hero image to reflect the current pool
    const heroImg = document.getElementById('wedding-hero-img');
    if (heroImg && filtered.length > 0) {
        const best = filtered.find(p => p.primary_image);
        if (best) heroImg.src = best.primary_image;
    }
}

function renderGrid(reset = false) {
    const grid        = document.getElementById('coll-grid');
    const loadMoreWrap = document.getElementById('load-more-wrap');
    const emptyState   = document.getElementById('empty-state');
    if (!grid) return;

    if (reset) grid.innerHTML = '';

    const start = page * PAGE_SIZE;
    const end   = start + PAGE_SIZE;
    const slice = filtered.slice(start, end);

    if (reset && slice.length === 0) {
        emptyState.style.display = 'block';
        if (loadMoreWrap) loadMoreWrap.style.display = 'none';
        return;
    }
    emptyState.style.display = 'none';
    slice.forEach(p => grid.appendChild(createTile(p)));
    page++;
    if (loadMoreWrap) loadMoreWrap.style.display = end < filtered.length ? 'block' : 'none';
}

function updateCount() {
    const el = document.getElementById('filter-count');
    if (el) el.textContent = `${filtered.length} look${filtered.length !== 1 ? 's' : ''}`;
}

async function init() {
    try {
        const res  = await fetch('data extraction/ganpatis_complete_inventory.json');
        const data = await res.json();

        // Women's wedding edit: weddingeditwomen, bridal, bridesmaid, "wedding" + women
        womenPool = data.filter(p =>
            p.tags && p.tags.some(t => {
                const tl = t.toLowerCase();
                return tl === 'weddingeditwomen' || tl === 'bridal' || tl === 'bridesmaid';
            })
        );

        // Men's wedding edit: weddingeditmen, groom, groomsmen
        menPool = data.filter(p =>
            p.tags && p.tags.some(t => {
                const tl = t.toLowerCase();
                return tl === 'weddingeditmen' || tl === 'weddingmen' || tl === 'groom' || tl === 'groomsmen';
            })
        );

        // All: union, deduplicated
        const seen = new Set();
        allProducts = [...womenPool, ...menPool].filter(p => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });

        // Sort: bridal > bridesmaid > rest
        const sortScore = p => {
            const tags = (p.tags || []).map(t => t.toLowerCase());
            if (tags.includes('bridal')) return 3;
            if (tags.includes('bridesmaid')) return 2;
            if (tags.includes('weddingeditwomen') || tags.includes('weddingeditmen')) return 1;
            return 0;
        };
        allProducts.sort((a, b) => sortScore(b) - sortScore(a));
        womenPool.sort((a, b)   => sortScore(b) - sortScore(a));
        menPool.sort((a, b)     => sortScore(b) - sortScore(a));

        applyFilters();

    } catch (e) {
        console.error('Failed to load wedding edit inventory:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();

    // Gender tabs
    document.querySelectorAll('.wedding-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.wedding-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeGender = tab.dataset.gender;
            // Reset filter chips too
            document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');
            activeFilter = 'all';
            applyFilters();
        });
    });

    // Filter chips
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', e => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value;
                applyFilters();
            }, 280);
        });
    }

    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => renderGrid(false));
    }

    // Cursor
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (cursor && follower) {
        let mx = 0, my = 0, fx = 0, fy = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.transform = `translate3d(${mx - 4}px,${my - 4}px,0)`;
        }, { passive: true });
        (function loop() {
            fx += (mx - fx) * 0.1;
            fy += (my - fy) * 0.1;
            follower.style.transform = `translate3d(${fx - 18}px,${fy - 18}px,0)`;
            requestAnimationFrame(loop);
        })();
    }
});

})();
