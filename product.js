/* =========================================
   GANPATIS — PRODUCT DETAIL PAGE JS
   Reads ?id= from URL, loads JSON,
   renders full product detail + related
========================================= */

(() => {

const PDP_INVENTORY_PATH = 'data extraction/ganpatis_inventory.json';

function formatPrice(price) {
    const n = parseFloat(price);
    if (isNaN(n)) return '';
    return '\u20b9 ' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function parseVariants(variants) {
    const colors = new Set();
    const sizes = new Set();
    const fabrics = new Set();
    variants.forEach(v => {
        const parts = v.title.split(' / ');
        if (parts[0] && parts[0] !== 'Default Title') colors.add(parts[0].trim());
        if (parts[1]) sizes.add(parts[1].trim());
        if (parts[2]) fabrics.add(parts[2].trim());
    });
    return {
        colors: [...colors],
        sizes: [...sizes],
        fabrics: [...fabrics]
    };
}

function getPriceForSelection(variants, color, size, fabric) {
    const match = variants.find(v => {
        const p = v.title.split(' / ');
        const c = p[0] ? p[0].trim() : '';
        const s = p[1] ? p[1].trim() : '';
        const f = p[2] ? p[2].trim() : '';
        return (!color || c === color) && (!size || s === size) && (!fabric || f === fabric);
    });
    return match ? match.price : null;
}

function isVariantAvailable(variants, color, size, fabric) {
    return variants.some(v => {
        const p = v.title.split(' / ');
        const c = p[0] ? p[0].trim() : '';
        const s = p[1] ? p[1].trim() : '';
        const f = p[2] ? p[2].trim() : '';
        return (!color || c === color) && (!size || s === size) && (!fabric || f === fabric) && v.available;
    });
}

let currentProduct = null;
let pdpAllProducts = [];
let currentSrc = 'instagram'; // default
let selectedColor = '';
let selectedSize = '';
let selectedFabric = '';

function updatePriceDisplay() {
    const price = getPriceForSelection(currentProduct.variants, selectedColor, selectedSize, selectedFabric);
    const el = document.getElementById('pdp-price');
    if (el && price) {
        el.textContent = formatPrice(price);
    }
}

function renderProduct(product) {
    currentProduct = product;
    document.title = `${product.title} — GANPATIS`;

    // Breadcrumb
    const bc = document.getElementById('breadcrumb-name');
    if (bc) bc.textContent = product.title;

    // Basic info
    document.getElementById('pdp-vendor').textContent = product.vendor || 'Ganpatis';
    document.getElementById('pdp-title').textContent = product.title;
    document.getElementById('pdp-type').textContent = product.product_type || '';

    // Price (base — cheapest variant)
    const prices = product.variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    document.getElementById('pdp-price').textContent = `From ${formatPrice(minPrice)}`;

    // Description
    const desc = document.getElementById('pdp-description');
    if (desc) desc.textContent = (product.description || '').trim();

    // Tags
    const tagsEl = document.getElementById('pdp-tags');
    if (tagsEl && product.tags) {
        tagsEl.innerHTML = product.tags
            .filter(t => !['All Products', 'women', 'men', 'womenswear'].includes(t))
            .map(t => `<span class="pdp-tag">${t}</span>`)
            .join('');
    }

    // Gallery
    const mainImg = document.getElementById('pdp-main-img');
    const thumbsEl = document.getElementById('pdp-thumbs');
    if (mainImg && product.primary_image) {
        mainImg.src = product.primary_image;
        mainImg.alt = product.title;
    }
    if (thumbsEl && product.all_images) {
        thumbsEl.innerHTML = '';
        product.all_images.forEach((src, i) => {
            const img = document.createElement('img');
            img.className = 'pdp-thumb' + (i === 0 ? ' active' : '');
            img.src = src;
            img.alt = `${product.title} — view ${i + 1}`;
            img.addEventListener('click', () => {
                mainImg.src = src;
                document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
                img.classList.add('active');
            });
            thumbsEl.appendChild(img);
        });
    }

    // Variants
    const { colors, sizes, fabrics } = parseVariants(product.variants);

    const colorsWrap = document.getElementById('pdp-colors-wrap');
    const colorsEl = document.getElementById('pdp-colors');
    if (colors.length > 1 && colorsWrap && colorsEl) {
        colorsWrap.style.display = 'block';
        selectedColor = colors[0];
        document.getElementById('selected-color').textContent = selectedColor;
        colors.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'pdp-swatch' + (c === selectedColor ? ' active' : '');
            if (!isVariantAvailable(product.variants, c, '', '')) btn.classList.add('unavailable');
            btn.textContent = c;
            btn.addEventListener('click', () => {
                selectedColor = c;
                document.getElementById('selected-color').textContent = c;
                document.querySelectorAll('.pdp-swatch').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updatePriceDisplay();
            });
            colorsEl.appendChild(btn);
        });
    }

    const sizesWrap = document.getElementById('pdp-sizes-wrap');
    const sizesEl = document.getElementById('pdp-sizes');
    if (sizes.length && sizesWrap && sizesEl) {
        sizesWrap.style.display = 'block';
        selectedSize = sizes[0];
        document.getElementById('selected-size').textContent = selectedSize;
        sizes.forEach(s => {
            const btn = document.createElement('button');
            btn.className = 'pdp-size-chip' + (s === selectedSize ? ' active' : '');
            btn.textContent = s;
            btn.addEventListener('click', () => {
                selectedSize = s;
                document.getElementById('selected-size').textContent = s;
                document.querySelectorAll('.pdp-size-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updatePriceDisplay();
            });
            sizesEl.appendChild(btn);
        });
    }

    const fabricsWrap = document.getElementById('pdp-fabrics-wrap');
    const fabricsEl = document.getElementById('pdp-fabrics');
    if (fabrics.length > 1 && fabricsWrap && fabricsEl) {
        fabricsWrap.style.display = 'block';
        selectedFabric = fabrics[0];
        document.getElementById('selected-fabric').textContent = selectedFabric;
        fabrics.forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'pdp-fabric-chip' + (f === selectedFabric ? ' active' : '');
            btn.textContent = f;
            btn.addEventListener('click', () => {
                selectedFabric = f;
                document.getElementById('selected-fabric').textContent = f;
                document.querySelectorAll('.pdp-fabric-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updatePriceDisplay();
            });
            fabricsEl.appendChild(btn);
        });
    }

    updatePriceDisplay();
}

function renderRelated(product, all) {
    const grid = document.getElementById('related-grid');
    if (!grid) return;

    let related = all.filter(p => p.id !== product.id && p.product_type === product.product_type);
    
    if (related.length < 4) {
        const others = all.filter(p => p.id !== product.id && p.product_type !== product.product_type);
        related = related.concat(others);
    }
    
    related = related.slice(0, 4);

    if (!related.length) {
        const relSection = document.querySelector('.related-section');
        if (relSection) relSection.style.display = 'none';
        return;
    }

    related.forEach(p => {
        const a = document.createElement('a');
        a.href = `product.html?id=${p.id}&src=${currentSrc}`;
        a.className = 'product-tile';
        const hasAlt = p.all_images && p.all_images.length > 1;
        const prices = p.variants.map(v => parseFloat(v.price)).filter(n => !isNaN(n));
        const minPrice = prices.length ? Math.min(...prices) : 0;
        a.innerHTML = `
            <div class="product-tile-img-wrap">
                <img class="product-tile-img" src="${p.primary_image || ''}" alt="${p.title}" loading="lazy">
                ${hasAlt ? `<img class="product-tile-img-alt" src="${p.all_images[1]}" alt="${p.title}" loading="lazy">` : ''}
                <div class="product-tile-overlay"><span>View Look \u2192</span></div>
            </div>
            <div class="product-tile-info">
                <p class="product-tile-type">${p.product_type || ''}</p>
                <p class="product-tile-name">${p.title}</p>
                <p class="product-tile-price"><strong>From ${formatPrice(minPrice)}</strong></p>
            </div>
        `;
        grid.appendChild(a);
    });
}

async function initPdp() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    currentSrc = params.get('src') || 'instagram';

    if (!id) { window.location = 'index.html'; return; }

    const path = 'data extraction/ganpatis_complete_inventory.json';

    try {
        const res = await fetch(path);
        pdpAllProducts = await res.json();
        
        const product = pdpAllProducts.find(p => String(p.id) === String(id));
        if (!product) { window.location = 'index.html'; return; }
        renderProduct(product);
        renderRelated(product, pdpAllProducts);
    } catch (e) {
        console.error('Failed to load product:', e);
    }
}

// --- SIZE ADVISOR LOGIC ---
function initSizeAdvisor() {
    const trigger = document.getElementById('size-advisor-btn');
    const overlay = document.getElementById('size-advisor-overlay');
    const drawer = document.getElementById('size-advisor-drawer');
    const closeBtn = document.getElementById('sa-close');
    const unitBtns = document.querySelectorAll('.sa-unit-btn');
    const calcBtn = document.getElementById('sa-calc-btn');
    const applyBtn = document.getElementById('sa-apply-btn');
    const resultDiv = document.getElementById('sa-result');
    const resultText = document.getElementById('sa-recommended-size');
    const inputs = document.querySelectorAll('.sa-input-group input');
    const labels = document.querySelectorAll('.sa-unit-label');
    
    let currentUnit = 'in'; // 'in' or 'cm'

    if (!trigger || !drawer) return;

    function openAdvisor() {
        overlay.classList.add('active');
        drawer.classList.add('active');
    }
    
    function closeAdvisor() {
        overlay.classList.remove('active');
        drawer.classList.remove('active');
    }

    trigger.addEventListener('click', openAdvisor);
    if(closeBtn) closeBtn.addEventListener('click', closeAdvisor);
    overlay.addEventListener('click', closeAdvisor);

    unitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.classList.contains('active')) return;
            
            unitBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentUnit = e.target.getAttribute('data-unit');
            
            // update labels
            labels.forEach(lbl => lbl.textContent = currentUnit);
            
            // Convert existing values if any
            inputs.forEach(input => {
                if(input.value) {
                    let val = parseFloat(input.value);
                    if (currentUnit === 'cm') {
                        input.value = (val * 2.54).toFixed(1);
                    } else {
                        input.value = (val / 2.54).toFixed(1);
                    }
                }
            });
        });
    });

    calcBtn.addEventListener('click', () => {
        const bustVal = parseFloat(document.getElementById('sa-bust').value);
        if(!bustVal) return alert('Please enter your Bust measurement.');
        
        // Convert to inches for standard calculation
        const bustInches = currentUnit === 'cm' ? bustVal / 2.54 : bustVal;
        
        let recSize = 'M';
        if (bustInches < 33) recSize = 'XS';
        else if (bustInches >= 33 && bustInches < 35) recSize = 'S';
        else if (bustInches >= 35 && bustInches < 37) recSize = 'M';
        else if (bustInches >= 37 && bustInches < 39) recSize = 'L';
        else if (bustInches >= 39 && bustInches < 41) recSize = 'XL';
        else recSize = 'XXL';

        resultText.textContent = recSize;
        resultDiv.style.display = 'block';
    });

    applyBtn.addEventListener('click', () => {
        const size = resultText.textContent;
        // Find the size option and click it
        const sizeBtns = document.querySelectorAll('#pdp-sizes .pdp-option');
        let found = false;
        sizeBtns.forEach(b => {
            if (b.textContent.trim().toUpperCase() === size.toUpperCase()) {
                b.click();
                found = true;
            }
        });
        if (!found && sizeBtns.length > 0) {
            // fallback if size doesn't match exactly
            sizeBtns[0].click();
        }
        closeAdvisor();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPdp();
    initSizeAdvisor();
});
})();
