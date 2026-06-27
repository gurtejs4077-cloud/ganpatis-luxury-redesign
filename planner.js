/* ======================================================
   GANPATIS — OCCASIONAL PLANNER
   Step-by-step outfit recommendation engine
====================================================== */

// ─────────────────────────────────────────────
//  OUTFIT CATALOGUE
//  Each outfit has tags that map to planner answers
// ─────────────────────────────────────────────
const OUTFITS = [
  {
    id: 'bridal-red-lehenga',
    name: 'Scarlet Bridal Lehenga',
    type: 'Bridal Lehenga',
    price: '₹ 1,85,000',
    img: 'https://ganpatis.in/cdn/shop/files/39_2.jpg?crop=region&crop_height=1925&crop_left=0&crop_top=185&crop_width=1290&v=1782479377&width=900',
    link: 'women.html?filter=lehenga',
    colorPalette: ['#7a0c0c','#c0392b','#e8bfa0'],
    paletteLabels: ['Deep Red','Crimson','Blush Gold'],
    tags: {
      events: ['wedding','reception','sangeet'],
      time: ['night'],
      season: ['winter','all-season'],
      style: ['traditional','royal'],
      budget: ['premium','luxury']
    },
    why: 'Deep crimson silk with heavy zardozi work catches evening light beautifully — a timeless bridal choice.',
    accessories: [
      { name: 'Kundan Bridal Set', img: 'https://ganpatis.in/cdn/shop/files/GoStudio_8842.jpg?crop=region&crop_height=4002&crop_left=229&crop_top=0&crop_width=2681&v=1777967177&width=400', price: '₹ 1,25,000', link: 'women.html?filter=necklace' },
      { name: 'Maang Tikka', img: 'assets/jewelry_closeup.png', price: '₹ 35,000', link: 'women.html?filter=maang' }
    ]
  },
  {
    id: 'ivory-organza-saree',
    name: 'Noor Ivory Organza Saree',
    type: 'Bridal Saree',
    price: '₹ 38,000',
    img: 'https://ganpatis.in/cdn/shop/files/35_1.jpg?crop=region&crop_height=1925&crop_left=0&crop_top=309&crop_width=1290&v=1782281093&width=900',
    link: 'women.html?filter=saree',
    colorPalette: ['#f5ede0','#d4bc90','#c8a87a'],
    paletteLabels: ['Ivory','Champagne Gold','Warm Beige'],
    tags: {
      events: ['wedding','reception','cocktail'],
      time: ['day'],
      season: ['summer','all-season'],
      style: ['traditional','contemporary'],
      budget: ['mid','premium']
    },
    why: 'Gossamer organza in ivory catches daylight with a luminous glow — effortlessly elegant and airy.',
    accessories: [
      { name: 'Polki Drop Earrings', img: 'assets/jewelry_closeup.png', price: '₹ 45,000', link: 'women.html?filter=earrings' },
      { name: 'Pearl Bracelet', img: 'assets/lookbook_detail.png', price: '₹ 18,000', link: 'women.html?filter=bracelets' }
    ]
  },
  {
    id: 'emerald-velvet-lehenga',
    name: 'Rania Emerald Velvet Lehenga',
    type: 'Lehenga',
    price: '₹ 1,10,000',
    img: 'https://ganpatis.in/cdn/shop/files/31_1.jpg?crop=region&crop_height=2400&crop_left=92&crop_top=0&crop_width=1608&v=1781867654&width=720',
    link: 'women.html?filter=lehenga',
    colorPalette: ['#0d4a2e','#1a7a4a','#d4bc90'],
    paletteLabels: ['Forest Emerald','Jade Green','Gold'],
    tags: {
      events: ['reception','cocktail','sangeet'],
      time: ['night'],
      season: ['winter'],
      style: ['royal','contemporary'],
      budget: ['premium','luxury']
    },
    why: 'Emerald velvet with gold zari embroidery absorbs evening light magnificently — commanding and regal.',
    accessories: [
      { name: 'Polki Gold Choker', img: 'https://ganpatis.in/cdn/shop/files/GoStudio_8842.jpg?crop=region&crop_height=4002&crop_left=229&crop_top=0&crop_width=2681&v=1777967177&width=400', price: '₹ 95,000', link: 'women.html?filter=necklace' },
      { name: 'Kundan Maang Tikka', img: 'assets/jewelry_closeup.png', price: '₹ 28,000', link: 'women.html?filter=maang' }
    ]
  },
  {
    id: 'yellow-mehendi-sharara',
    name: 'Basant Yellow Sharara Set',
    type: 'Sharara',
    price: '₹ 52,000',
    img: 'https://ganpatis.in/cdn/shop/files/37_1.jpg?crop=region&crop_height=1925&crop_left=0&crop_top=308&crop_width=1290&v=1782291335&width=720',
    link: 'women.html?filter=sharara',
    colorPalette: ['#f5c518','#f7a800','#e8f5a0'],
    paletteLabels: ['Sunshine Yellow','Marigold','Lime Zest'],
    tags: {
      events: ['mehendi','haldi'],
      time: ['day'],
      season: ['summer','all-season'],
      style: ['traditional','contemporary'],
      budget: ['mid','premium']
    },
    why: 'Bright yellows and greens are considered auspicious for Mehendi rituals and glow in natural light.',
    accessories: [
      { name: 'Floral Jhumkas', img: 'assets/jewelry_closeup.png', price: '₹ 12,000', link: 'women.html?filter=earrings' },
      { name: 'Floral Potli Bag', img: 'assets/lookbook_detail.png', price: '₹ 8,500', link: 'women.html?filter=bags' }
    ]
  },
  {
    id: 'blush-anarkali',
    name: 'Amaira Blush Anarkali',
    type: 'Anarkali',
    price: '₹ 85,000',
    img: 'https://ganpatis.in/cdn/shop/files/38_1.jpg?crop=region&crop_height=1925&crop_left=0&crop_top=310&crop_width=1290&v=1782291741&width=720',
    link: 'women.html?filter=anarkali',
    colorPalette: ['#f2b5a0','#e8967a','#f5ede0'],
    paletteLabels: ['Dusty Blush','Rose Terracotta','Ivory'],
    tags: {
      events: ['wedding','reception','cocktail','festive'],
      time: ['day'],
      season: ['summer','all-season'],
      style: ['traditional'],
      budget: ['mid','premium']
    },
    why: 'Blush tones with delicate embroidery create a soft, graceful silhouette perfect for daytime ceremonies.',
    accessories: [
      { name: 'Pearl & Kundan Earrings', img: 'assets/jewelry_closeup.png', price: '₹ 22,000', link: 'women.html?filter=earrings' },
      { name: 'Embroidered Clutch', img: 'assets/lookbook_detail.png', price: '₹ 9,500', link: 'women.html?filter=bags' }
    ]
  },
  {
    id: 'navy-silk-gown',
    name: 'Kavya Midnight Silk Gown',
    type: 'Gown',
    price: '₹ 96,000',
    img: 'https://ganpatis.in/cdn/shop/files/33_1.jpg?crop=region&crop_height=2400&crop_left=92&crop_top=0&crop_width=1608&v=1781946085&width=720',
    link: 'women.html?filter=gown',
    colorPalette: ['#1a2a4a','#2a3a6a','#d4bc90'],
    paletteLabels: ['Midnight Navy','Royal Ink','Gold Trim'],
    tags: {
      events: ['cocktail','reception','sangeet'],
      time: ['night'],
      season: ['winter','all-season'],
      style: ['contemporary','royal'],
      budget: ['premium','luxury']
    },
    why: 'Deep navy silk with gold accents is quintessentially glamorous for evening cocktail events.',
    accessories: [
      { name: 'Diamond Drop Earrings', img: 'assets/jewelry_closeup.png', price: '₹ 65,000', link: 'women.html?filter=earrings' },
      { name: 'Gold Minaudière', img: 'assets/lookbook_detail.png', price: '₹ 18,000', link: 'women.html?filter=bags' }
    ]
  },
  {
    id: 'silk-festive-saree',
    name: 'Riya Zari Festive Saree',
    type: 'Saree',
    price: '₹ 58,000',
    img: 'https://ganpatis.in/cdn/shop/files/34_1.jpg?crop=region&crop_height=1925&crop_left=0&crop_top=307&crop_width=1290&v=1782280794&width=720',
    link: 'women.html?filter=saree',
    colorPalette: ['#8b0000','#d4bc90','#2a1a0a'],
    paletteLabels: ['Deep Maroon','Zari Gold','Ebony'],
    tags: {
      events: ['festive','wedding','reception'],
      time: ['night','day'],
      season: ['winter','all-season'],
      style: ['traditional'],
      budget: ['mid','premium']
    },
    why: 'Classic silk saree with zari border — versatile enough for both day and evening events with a timeless appeal.',
    accessories: [
      { name: 'Temple Gold Set', img: 'assets/jewelry_closeup.png', price: '₹ 55,000', link: 'women.html?filter=necklace' },
      { name: 'Zari Potli', img: 'assets/lookbook_detail.png', price: '₹ 11,000', link: 'women.html?filter=bags' }
    ]
  },
  {
    id: 'mint-co-ord',
    name: 'Meera Mint Chanderi Co-ord',
    type: 'Co-ord Set',
    price: '₹ 44,000',
    img: 'https://ganpatis.in/cdn/shop/files/32_1.jpg?crop=region&crop_height=2400&crop_left=92&crop_top=0&crop_width=1608&v=1781868577&width=720',
    link: 'women.html?filter=co-ord',
    colorPalette: ['#a8d5c2','#6bbfa0','#e8f5ef'],
    paletteLabels: ['Seafoam Mint','Jade Teal','Pale Aqua'],
    tags: {
      events: ['mehendi','casual','festive','cocktail'],
      time: ['day'],
      season: ['summer'],
      style: ['contemporary'],
      budget: ['budget','mid']
    },
    why: 'Cool mint tones feel refreshing in warm weather and photograph stunningly in natural daylight.',
    accessories: [
      { name: 'Silver Oxidised Earrings', img: 'assets/jewelry_closeup.png', price: '₹ 6,500', link: 'women.html?filter=earrings' },
      { name: 'Embroidered Sling Bag', img: 'assets/lookbook_detail.png', price: '₹ 7,000', link: 'women.html?filter=bags' }
    ]
  },
  {
    id: 'burgundy-bridal-lehenga',
    name: 'Ruhaani Burgundy Silk Lehenga',
    type: 'Bridal Lehenga',
    price: '₹ 72,000',
    img: 'https://ganpatis.in/cdn/shop/files/36_1.jpg?crop=region&crop_height=1925&crop_left=0&crop_top=310&crop_width=1290&v=1782283131&width=720',
    link: 'women.html?filter=lehenga',
    colorPalette: ['#6b0c2a','#a01840','#e8bfa0'],
    paletteLabels: ['Burgundy Wine','Deep Rose','Peach Gold'],
    tags: {
      events: ['wedding','sangeet','reception'],
      time: ['night'],
      season: ['winter','all-season'],
      style: ['traditional','royal'],
      budget: ['mid','premium']
    },
    why: 'Wine-burgundy silk with mirror-work sequins creates a mesmerizing shimmer under evening lights.',
    accessories: [
      { name: 'Polki Rani Haar', img: 'https://ganpatis.in/cdn/shop/files/GoStudio_8842.jpg?crop=region&crop_height=4002&crop_left=229&crop_top=0&crop_width=2681&v=1777967177&width=400', price: '₹ 82,000', link: 'women.html?filter=necklace' },
      { name: 'Bangles Set', img: 'assets/jewelry_closeup.png', price: '₹ 16,000', link: 'women.html?filter=bracelets' }
    ]
  }
];

// ─────────────────────────────────────────────
//  PLANNER STATE
// ─────────────────────────────────────────────
const planner = {
  currentStep: 0,
  answers: {
    event: null,
    time: null,
    season: null,
    style: null,
    budget: null
  },
  totalSteps: 5
};

// ─────────────────────────────────────────────
//  BUDGET TAG MAP
// ─────────────────────────────────────────────
const BUDGET_MAP = {
  'under-30k': 'budget',
  '30k-75k': 'mid',
  '75k-200k': 'premium',
  '200k-plus': 'luxury'
};

// ─────────────────────────────────────────────
//  RECOMMENDATION ENGINE
// ─────────────────────────────────────────────
function getRecommendations() {
  const { event, time, season, style, budget } = planner.answers;
  const budgetTag = BUDGET_MAP[budget] || 'mid';

  const scored = OUTFITS.map(outfit => {
    let score = 0;
    const t = outfit.tags;

    if (t.events.includes(event)) score += 4;
    if (t.time.includes(time)) score += 3;
    if (t.season.includes(season) || t.season.includes('all-season')) score += 2;
    if (t.style.includes(style)) score += 2;
    if (t.budget.includes(budgetTag)) score += 1;

    return { outfit, score };
  });

  // Sort descending, return top 3
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.outfit);
}

// ─────────────────────────────────────────────
//  DOM HELPERS
// ─────────────────────────────────────────────
function showStep(index) {
  const steps = document.querySelectorAll('.planner-step');
  steps.forEach((step, i) => {
    step.classList.remove('planner-step--active', 'planner-step--exit');
    if (i < index) step.classList.add('planner-step--exit');
  });
  if (steps[index]) steps[index].classList.add('planner-step--active');

  // Update progress
  const dots = document.querySelectorAll('.planner-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('planner-dot--active', i <= index);
  });

  // Update step counter
  const counter = document.getElementById('planner-step-counter');
  if (counter) counter.textContent = `${index + 1} / ${planner.totalSteps}`;

  // Back button visibility
  const backBtn = document.getElementById('planner-back');
  if (backBtn) backBtn.style.display = index > 0 ? 'flex' : 'none';
}

function markSelected(step, value) {
  const options = step.querySelectorAll('.step-option');
  options.forEach(opt => {
    opt.classList.toggle('step-option--selected', opt.dataset.value === value);
  });
}

// ─────────────────────────────────────────────
//  RESULTS RENDERER
// ─────────────────────────────────────────────
function renderResults() {
  const recs = getRecommendations();
  const grid = document.getElementById('planner-results-grid');
  if (!grid) return;

  // Build event label for summary
  const eventLabels = {
    'wedding': 'Wedding', 'reception': 'Reception', 'cocktail': 'Cocktail Party',
    'mehendi': 'Mehendi', 'haldi': 'Haldi', 'sangeet': 'Sangeet',
    'casual': 'Casual Outing', 'festive': 'Festive Occasion'
  };
  const timeLabel = planner.answers.time === 'day' ? 'Day' : 'Evening';
  const summary = document.getElementById('planner-summary');
  if (summary) {
    summary.textContent = `Your curated looks for a ${timeLabel} ${eventLabels[planner.answers.event] || ''}.`;
  }

  grid.innerHTML = recs.map((outfit, index) => `
    <div class="result-card" style="animation-delay: ${index * 0.15}s">
      <div class="result-img-wrap">
        <img src="${outfit.img}" alt="${outfit.name}" loading="lazy">
        <div class="result-img-overlay">
          <a href="${outfit.link}" class="result-shop-btn">Shop This Look →</a>
        </div>
        <div class="result-type-badge">${outfit.type}</div>
      </div>
      <div class="result-info">
        <h4>${outfit.name}</h4>
        <p class="result-price">${outfit.price}</p>
        <p class="result-why">"${outfit.why}"</p>
        <div class="result-palette">
          ${outfit.colorPalette.map((c, i) => `
            <div class="palette-chip" title="${outfit.paletteLabels[i]}" style="background:${c}"></div>
          `).join('')}
          <span class="palette-label">${outfit.paletteLabels.join(' · ')}</span>
        </div>
        <div class="result-accessories">
          <p class="result-acc-heading">Pair With</p>
          <div class="result-acc-list">
            ${outfit.accessories.map(acc => `
              <a href="${acc.link}" class="result-acc-item">
                <img src="${acc.img}" alt="${acc.name}">
                <div>
                  <span class="acc-name">${acc.name}</span>
                  <span class="acc-price">${acc.price}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Show results panel
  const resultsPanel = document.getElementById('planner-results');
  if (resultsPanel) {
    resultsPanel.classList.add('planner-results--visible');
  }
  const stepsWrap = document.getElementById('planner-steps-wrap');
  if (stepsWrap) stepsWrap.style.display = 'none';
  const navWrap = document.getElementById('planner-nav');
  if (navWrap) navWrap.style.display = 'none';
}

// ─────────────────────────────────────────────
//  STEP NAVIGATION
// ─────────────────────────────────────────────
function nextStep() {
  const answerKey = ['event','time','season','style','budget'][planner.currentStep];
  if (!planner.answers[answerKey]) {
    // Shake the step to prompt selection
    const activeStep = document.querySelector('.planner-step--active');
    if (activeStep) {
      activeStep.classList.add('planner-step--shake');
      setTimeout(() => activeStep.classList.remove('planner-step--shake'), 500);
    }
    return;
  }

  if (planner.currentStep < planner.totalSteps - 1) {
    planner.currentStep++;
    showStep(planner.currentStep);
  } else {
    // Final step — show results
    const stepsWrap = document.getElementById('planner-steps-wrap');
    const progressBar = document.querySelector('.planner-progress');
    const header = document.querySelector('.planner-header');
    if (stepsWrap) stepsWrap.style.opacity = '0';
    setTimeout(() => {
      if (stepsWrap) stepsWrap.style.display = 'none';
      if (progressBar) progressBar.style.display = 'none';
      if (header) header.classList.add('planner-header--results');
      renderResults();
    }, 400);
  }
}

function prevStep() {
  if (planner.currentStep > 0) {
    planner.currentStep--;
    showStep(planner.currentStep);
  }
}

function resetPlanner() {
  planner.currentStep = 0;
  planner.answers = { event: null, time: null, season: null, style: null, budget: null };

  const resultsPanel = document.getElementById('planner-results');
  if (resultsPanel) resultsPanel.classList.remove('planner-results--visible');

  const stepsWrap = document.getElementById('planner-steps-wrap');
  if (stepsWrap) { stepsWrap.style.display = ''; stepsWrap.style.opacity = ''; }

  const progressBar = document.querySelector('.planner-progress');
  if (progressBar) progressBar.style.display = '';

  const navWrap = document.getElementById('planner-nav');
  if (navWrap) navWrap.style.display = '';

  const header = document.querySelector('.planner-header');
  if (header) header.classList.remove('planner-header--results');

  // Clear all selections
  document.querySelectorAll('.step-option--selected').forEach(el => el.classList.remove('step-option--selected'));

  showStep(0);
}

// ─────────────────────────────────────────────
//  MODAL OPEN / CLOSE
// ─────────────────────────────────────────────
function openPlanner() {
  const modal = document.getElementById('planner-modal');
  if (!modal) return;
  modal.classList.add('planner-modal--open');
  document.body.style.overflow = 'hidden';
  resetPlanner();
}

function closePlanner() {
  const modal = document.getElementById('planner-modal');
  if (!modal) return;
  modal.classList.remove('planner-modal--open');
  document.body.style.overflow = '';
}

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Open triggers
  document.querySelectorAll('[data-open-planner]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openPlanner(); });
  });

  // Close button
  const closeBtn = document.getElementById('planner-close');
  if (closeBtn) closeBtn.addEventListener('click', closePlanner);

  // Close on backdrop click
  const modal = document.getElementById('planner-modal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closePlanner();
    });
  }

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePlanner();
  });

  // Next / Back buttons
  const nextBtn = document.getElementById('planner-next');
  if (nextBtn) nextBtn.addEventListener('click', nextStep);

  const backBtn = document.getElementById('planner-back');
  if (backBtn) backBtn.addEventListener('click', prevStep);

  // Restart button
  const restartBtn = document.getElementById('planner-restart');
  if (restartBtn) restartBtn.addEventListener('click', resetPlanner);

  // Option selections — delegated
  document.getElementById('planner-steps-wrap')?.addEventListener('click', e => {
    const opt = e.target.closest('.step-option');
    if (!opt) return;

    const step = opt.closest('.planner-step');
    const answerKey = step?.dataset.answerKey;
    if (!answerKey) return;

    planner.answers[answerKey] = opt.dataset.value;
    markSelected(step, opt.dataset.value);

    // Auto-advance after short delay
    setTimeout(nextStep, 360);
  });

  // Init step
  showStep(0);
});
