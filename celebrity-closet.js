/* =========================================
   GANPATIS — CELEBRITY CLOSET JS
   Filters: celebrity closet / celebrity / instagram collection tags
========================================= */

(() => {

const PAGE_SIZE = 28;
let allProducts = [];
let filtered = [];
let page = 0;
let activeFilter = 'all';
let searchQuery = '';

function formatPrice(variants) {
    const prices = (variants || []).map(v => parseFloat(v.price)).filter(p => !isNaN(p));
    if (!prices.length) return '';
    return 'From \u20b9 ' + Math.min(...prices).toLocaleString('en-IN');
}

function createTile(product) {
    const a = document.createElement('a');
    a.href = `product.html?id=${product.id}&src=celebrity-closet`;
    a.className = 'product-tile';

    const hasAlt = product.all_images && product.all_images.length > 1;

    // Build a celebrity-badge based on tags
    const isCeleb = (product.tags || []).some(t =>
        t.toLowerCase() === 'celebrity closet' || t.toLowerCase() === 'celebrity'
    );

    a.innerHTML = `
        <div class="product-tile-img-wrap">
            <img class="product-tile-img" src="${product.primary_image || ''}" alt="${product.title}" loading="lazy">
            ${hasAlt ? `<img class="product-tile-img-alt" src="${product.all_images[1]}" alt="${product.title}" loading="lazy">` : ''}
            <div class="product-tile-overlay"><span>View Look \u2192</span></div>
            ${isCeleb ? `<div class="product-badge" style="background:var(--c-dark);">★ Celebrity</div>` : ''}
        </div>
        <div class="product-tile-info">
            <p class="product-tile-type">${product.product_type || ''}</p>
            <p class="product-tile-name">${product.title}</p>
            <p class="product-tile-price"><strong>${formatPrice(product.variants)}</strong></p>
        </div>
    `;
    return a;
}

function applyFilters() {
    const q = searchQuery.toLowerCase();

    filtered = allProducts.filter(p => {
        // UI filter chip
        const matchFilter =
            activeFilter === 'all' ||
            (p.product_type && p.product_type.toLowerCase().includes(activeFilter.toLowerCase())) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())));

        // Search box
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
}

function renderGrid(reset = false) {
    const grid = document.getElementById('coll-grid');
    const loadMoreWrap = document.getElementById('load-more-wrap');
    const emptyState = document.getElementById('empty-state');
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

        // Celebrity Closet = items tagged with "celebrity closet", "celebrity", or "instagram collection"
        allProducts = data.filter(p =>
            p.tags && p.tags.some(t => {
                const tl = t.toLowerCase();
                return tl === 'celebrity closet' || tl === 'celebrity' || tl === 'instagram collection';
            })
        );

        // Fallback: use all if nothing matches
        if (allProducts.length === 0) allProducts = data;

        // Shuffle slightly so it feels curated, not alphabetical
        allProducts = allProducts.sort((a, b) => {
            // priority: celebrity closet tag first
            const aScore = (a.tags || []).some(t => t.toLowerCase() === 'celebrity closet') ? 1 : 0;
            const bScore = (b.tags || []).some(t => t.toLowerCase() === 'celebrity closet') ? 1 : 0;
            return bScore - aScore;
        });

        applyFilters();

        // Update hero image dynamically
        const heroImg = document.getElementById('celeb-hero-img');
        if (heroImg && allProducts.length > 0) {
            const best = allProducts.find(p => p.primary_image);
            if (best) heroImg.src = best.primary_image;
        }

    } catch (e) {
        console.error('Failed to load celebrity closet inventory:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();

    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });

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
