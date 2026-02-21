import { executeMusicCommand } from "./music.js";

// DOM Elements
const htmlTag = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
const navBtns = document.querySelectorAll('.nav-btn[data-target]');
const pages = document.querySelectorAll('.page');
const navIndicator = document.getElementById('nav-indicator');
const mainNav = document.getElementById('main-nav');
const searchTrigger = document.getElementById('search-trigger');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');
const searchWrapper = document.getElementById('search-wrapper');
const filterContainer = document.getElementById('filter-container');
const filterTrack = document.getElementById('filter-track');
const modal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');

// Constants
const filterCategories = ['Popular', 'Editing', 'Enhancer', 'Music', 'Film', 'Anime'];

let isDraggingFilter = false;
let filterPauseTimer;

export function hideGlobalLoader() {
    const loader = document.getElementById('global-loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        document.body.classList.add('loaded-state');
    }
}

export function showProductModal(product) {
  document.getElementById('modal-img').src = product.imageUrl || '';
  document.getElementById('modal-title').textContent =
    product.name || product.title || '';
    
  // Handle priceText as array or string
  let priceHtml = '<li>-</li>';
  if (Array.isArray(product.priceText) && product.priceText.length > 0) {
    priceHtml = product.priceText.map(price => `<li>${price}</li>`).join('');
  } else if (product.priceText) {
    priceHtml = `<li>${product.priceText}</li>`;
  }
    
  // 1. Ganti pembacaan harga & tambah struktur LIST HARGA
  document.getElementById('modal-prices').innerHTML = `
    <div style="font-weight: bold; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 6px; text-transform: uppercase;">LIST HARGA</div>
    <ul class="modal-list" style="text-align: left; padding-left: 20px; font-weight: normal; color: var(--text-main); font-size: 0.95rem;">
      ${priceHtml}
    </ul>
  `;

  // 2. Ganti pembacaan deskripsi & tambah struktur DESKRIPSI PRODUK
  document.getElementById('modal-desc').innerHTML = `
    <div style="font-weight: bold; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 6px; text-transform: uppercase;">DESKRIPSI PRODUK</div>
    <p style="text-align: left;">${product.description || '-'}</p>
  `;

  // 3. Tombol Order via WhatsApp membaca whatsappLink dengan fallback targetLink
  const waBtn = document.getElementById('modal-wa-btn');
  if (waBtn) {
    waBtn.href = product.whatsappLink || product.targetLink || '#';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
  }

  modal.classList.add('show');
}

export function initUI() {
  // Initial global loader timeout fail-safe
  setTimeout(hideGlobalLoader, 6000);

  // Theme toggle logic (KODE ANIMASI MULUS)
  themeBtn.addEventListener('click', () => {
    const isDark = htmlTag.getAttribute('data-theme') === 'dark';
    
    // Cukup ganti attributenya, CSS akan mengurus animasi crossfade-nya secara otomatis dan bersamaan
    if (isDark) {
      htmlTag.setAttribute('data-theme', 'light');
    } else {
      htmlTag.setAttribute('data-theme', 'dark');
    }
  });

  // Navigation Logic (Fungsi Klik Bottom Nav)
  navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          navBtns.forEach(b => b.classList.remove('active'));
          pages.forEach(p => p.classList.remove('active'));
          
          btn.classList.add('active');
          document.getElementById(btn.dataset.target).classList.add('active');
          
          updateIndicator(btn);
          if (mainNav.classList.contains('nav-search-active')) closeSearch();
      });
  });

  // Handle Window Resize and Load
  window.addEventListener('load', () => {
      const activeBtn = document.querySelector('.nav-btn.active[data-target]');
      setTimeout(() => updateIndicator(activeBtn), 300);
      buildFilters();
  });
  
  window.addEventListener('resize', () => {
      const activeBtn = document.querySelector('.nav-btn.active[data-target]');
      updateIndicator(activeBtn);
  });

  // Search Logic
  searchTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mainNav.classList.contains('nav-search-active')) {
          if (executeMusicCommand(searchInput.value)) {
              triggerExistingSearchClose();
          }
          return;
      }
      mainNav.classList.add('nav-search-active');
      updateIndicator(null);
      setTimeout(() => searchInput.focus(), 300);
  });

  searchClose.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); closeSearch(); }, {passive: false});
  searchClose.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); closeSearch(); });
  searchClose.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeSearch(); });
  
  document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('nav-search-active') && !searchWrapper.contains(e.target)) closeSearch();
  });
  
  searchWrapper.addEventListener('click', (e) => e.stopPropagation());
  searchInput.addEventListener('input', (e) => triggerFilter(e.target.value.toLowerCase()));

  searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
          if (executeMusicCommand(searchInput.value)) triggerExistingSearchClose();
      }
  });

  // Filters Interaction
  if(filterContainer) {
      filterContainer.addEventListener('touchstart', pauseFilterAutoScroll, {passive: true});
      filterContainer.addEventListener('mousedown', pauseFilterAutoScroll);
      filterContainer.addEventListener('touchend', resumeFilterAutoScroll);
      filterContainer.addEventListener('mouseup', resumeFilterAutoScroll);
      filterContainer.addEventListener('mouseleave', resumeFilterAutoScroll);
      filterContainer.addEventListener('wheel', pauseFilterAutoScroll, {passive: true});
  }

  // Modal Events
  closeModalBtn.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
}

// Local helper functions
function updateIndicator(btn) {
    if (!btn) return;
    if (mainNav.classList.contains('nav-search-active')) {
        navIndicator.style.opacity = '0';
        return;
    }
    const navRect = mainNav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const width = 72;
    const left = (btnRect.left - navRect.left) + (btnRect.width / 2) - (width / 2);
    navIndicator.style.width = `${width}px`;
    navIndicator.style.left = `${left}px`;
    navIndicator.style.opacity = '1';
}

function closeSearch() {
    if (!mainNav.classList.contains('nav-search-active')) return;
    mainNav.classList.remove('nav-search-active');
    searchInput.value = '';
    triggerFilter('');
    searchInput.blur();
    setTimeout(() => {
        const activeBtn = document.querySelector('.nav-btn.active[data-target]');
        updateIndicator(activeBtn);
    }, 400); 
}

function triggerExistingSearchClose() {
    searchClose.click();
}

function triggerFilter(query) {
    let homeVisible = 0;
    document.querySelectorAll('.app-item').forEach(item => {
        if(item.dataset.name.toLowerCase().includes(query)) {
            item.style.display = 'flex';
            homeVisible++;
        } else item.style.display = 'none';
    });
    const hNoRes = document.getElementById('home-no-results');
    if (hNoRes) hNoRes.style.display = (homeVisible === 0) ? 'block' : 'none';

    let storeVisible = 0;
    document.querySelectorAll('.store-item').forEach(item => {
        if(item.dataset.name.toLowerCase().includes(query)) {
            item.style.display = 'flex';
            storeVisible++;
        } else item.style.display = 'none';
    });
    const sNoRes = document.getElementById('store-no-results');
    if (sNoRes) sNoRes.style.display = (storeVisible === 0) ? 'block' : 'none';
}

function buildFilters() {
    const arr = ['All', ...filterCategories];
    const fullArr = [...arr, ...arr]; 
    fullArr.forEach(cat => {
        const btn = document.createElement('div');
        btn.className = `filter-tag ${cat === 'All' ? 'active' : ''}`;
        btn.textContent = cat;
        btn.dataset.cat = cat;
        btn.addEventListener('click', () => {
            selectFilter(cat);
            pauseFilterAutoScroll();
            resumeFilterAutoScroll();
        });
        filterTrack.appendChild(btn);
    });
    requestAnimationFrame(autoScrollFilter);
}

function autoScrollFilter() {
    if (!isDraggingFilter && filterContainer) {
        filterContainer.scrollLeft += 0.8; 
        if (filterContainer.scrollLeft >= filterTrack.scrollWidth / 2) filterContainer.scrollLeft = 0; 
    }
    requestAnimationFrame(autoScrollFilter);
}

function pauseFilterAutoScroll() { isDraggingFilter = true; clearTimeout(filterPauseTimer); }

function resumeFilterAutoScroll() {
    clearTimeout(filterPauseTimer);
    filterPauseTimer = setTimeout(() => { isDraggingFilter = false; }, 1000);
}

// LOGIKA FILTER DIPERBARUI MENDUKUNG ARRAY/MULTIPLE CATEGORY
function selectFilter(category) {
    const cat = category.toLowerCase();
    
    // Update active class on filter buttons
    document.querySelectorAll('.filter-tag').forEach(t => {
        t.classList.toggle('active', t.dataset.cat.toLowerCase() === category.toLowerCase());
    });
    
    let visibleCount = 0;
    document.querySelectorAll('.app-item').forEach(item => {
        // Karena dataset.category sekarang digabung dengan koma, kita pecah kembali jadi array
        const itemCategories = item.dataset.category ? item.dataset.category.split(',') : [];
        
        // Cek apakah item mengandung filter yang dipilih
        if (cat === 'all' || itemCategories.includes(cat)) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/Hide "No Results" text
    const hNoRes = document.getElementById('home-no-results');
    if (hNoRes) hNoRes.style.display = visibleCount === 0 ? 'block' : 'none';
}
