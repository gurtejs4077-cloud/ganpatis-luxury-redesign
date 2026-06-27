/* =========================================
   GANPATIS — NEW ARRIVALS JS
========================================= */

(() => {

const PAGE_SIZE = 28;

let allProducts = [];
let filtered = [];
let page = 0;
let activeFilter = 'all';
let searchQuery = '';
let currentSrc = 'new-girls'; // default

function formatPrice(variants) {
    const prices = variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
    if (!prices.length) return '';
    const min = Math.min(...prices);
    return 'From \u20b9 ' + min.toLocaleString('en-IN');
}

function isNew(product) {
    return true; // it's new arrivals page!
}

function createTile(product) {
    const src = product._src || currentSrc;
    const a = document.createElement('a');
    a.href = `product.html?id=${product.id}&src=${src}`;
    a.className = 'product-tile';

    const hasAlt = product.all_images && product.all_images.length > 1;
    
    a.innerHTML = `
        <div class="product-tile-img-wrap">
            <img class="product-tile-img" src="${product.primary_image || ''}" alt="${product.title}" loading="lazy">
            ${hasAlt ? `<img class="product-tile-img-alt" src="${product.all_images[1]}" alt="${product.title}" loading="lazy">` : ''}
            <div class="product-tile-badge">New</div>
            <div class="product-tile-overlay"><span>View Look \u2192</span></div>
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
        const matchFilter =
            activeFilter === 'all' ||
            (p.product_type && p.product_type.toLowerCase().includes(activeFilter.toLowerCase())) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())));
        const matchSearch =
            !q ||
            p.title.toLowerCase().includes(q) ||
            (p.product_type && p.product_type.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
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
    const end = start + PAGE_SIZE;
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
    const params = new URLSearchParams(window.location.search);
    let gender = params.get('gender') || 'all';
    if (gender !== 'boys' && gender !== 'girls' && gender !== 'all') gender = 'all';

    // Update active tab UI
    if(document.getElementById('tab-all')) document.getElementById('tab-all').classList.toggle('active', gender === 'all');
    if(document.getElementById('tab-girls')) document.getElementById('tab-girls').classList.toggle('active', gender === 'girls');
    if(document.getElementById('tab-boys')) document.getElementById('tab-boys').classList.toggle('active', gender === 'boys');

    try {
        const res = await fetch('data extraction/ganpatis_complete_inventory.json');
        const data = await res.json();
        
        let newDrops = data.filter(p => p.tags && p.tags.some(t => t.toLowerCase().includes('new')));
        if (newDrops.length === 0) newDrops = data.slice(0, 500); // fallback if no 'new' tags

        if (gender === 'boys') {
            allProducts = newDrops.filter(p => p.tags && p.tags.some(t => t.toLowerCase().includes('men') || t.toLowerCase().includes('menswear')));
        } else if (gender === 'girls') {
            allProducts = newDrops.filter(p => p.tags && p.tags.some(t => t.toLowerCase().includes('women') || t.toLowerCase().includes('womenswear')));
        } else {
            allProducts = newDrops;
        }

        filtered = [...allProducts];
        renderGrid(true);
        updateCount();

        // Dynamically set hero image
        const heroImg = document.querySelector('.col-hero-bg img');
        if (heroImg && filtered.length > 0) {
            const bestImgProduct = filtered.find(p => p.primary_image);
            if (bestImgProduct) {
                heroImg.src = bestImgProduct.primary_image;
            }
        }
    } catch (e) {
        console.error('Failed to load inventory:', e);
    }
}

// Boot
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

    // Cursor (shared)
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (cursor && follower) {
        let mx = 0, my = 0, fx = 0, fy = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });
        (function loop() {
            fx += (mx - fx) * 0.1;
            fy += (my - fy) * 0.1;
            follower.style.left = fx + 'px';
            follower.style.top = fy + 'px';
            requestAnimationFrame(loop);
        })();
    }
});

})();
