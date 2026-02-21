import { hideGlobalLoader, showProductModal } from "./ui.js";

export function renderApps(apps) {
    const container = document.getElementById('home-list');
    container.innerHTML = ''; 
    
    apps.forEach((app, index) => {
        const el = document.createElement('a');
        el.href = app.targetLink || '#';
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.className = 'item-card glass app-item stagger-card'; 
        el.style.animationDelay = `${index * 0.08}s`; 
        
        // Atribut untuk filter dan pencarian
        // Membaca category sebagai array sesuai data dari database
        el.dataset.category = Array.isArray(app.category)
            ? app.category.map(c => c.toLowerCase()).join(',')
            : (app.category || 'all').toLowerCase();
            
        el.dataset.name = app.name || '';
        
        // 1. Menyiapkan Teks Tanggal
        let dateString = '';
        if (app.updateDate?.toDate) {
            // Memformat menjadi seperti: "20 Feb 2026"
            const dateObj = app.updateDate.toDate();
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString('en-US', { month: 'short' });
            const year = dateObj.getFullYear();
            dateString = `${day} ${month} ${year}`;
        } else if (app.updateDate) {
            dateString = app.updateDate;
        }

        // 2. Menyiapkan Teks Category Display
        let categoryDisplay = '';
        if (Array.isArray(app.category) && app.category.length > 0) {
             categoryDisplay = app.category.join(' - '); // Menggabungkan misal: Popular - Enhancer
        } else if (typeof app.category === 'string' && app.category.toLowerCase() !== 'all' && app.category !== '') {
             categoryDisplay = app.category;
        }

        // 3. Menggabungkan Tanggal dan Category
        let dateCategoryHtml = dateString;
        if (dateString && categoryDisplay) {
            dateCategoryHtml += ` - ${categoryDisplay}`;
        } else if (categoryDisplay) {
            dateCategoryHtml = categoryDisplay;
        }

        el.innerHTML = `
            <img src="${app.imageUrl || 'https://via.placeholder.com/50'}" class="item-icon" alt="Icon">
            <div class="item-info">
                <div class="item-title">
                    ${app.name || app.title || ''}
                    ${app.version ? `<span style="color: var(--text-muted); font-size: 0.85rem; font-weight: normal; margin-left: 6px;">${app.version}</span>` : ''}
                </div>
                <div class="item-date">${dateCategoryHtml}</div>
            </div>
            <div class="item-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
        `;
        container.appendChild(el);
    });
    hideGlobalLoader();
}

export function renderProducts(products) {
    const container = document.getElementById('store-list');
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const el = document.createElement('div');
        el.className = 'item-card glass store-item stagger-card';
        el.style.animationDelay = `${index * 0.08}s`;
        el.dataset.name = product.name || '';
        
        el.innerHTML = `
            <img src="${product.imageUrl || 'https://via.placeholder.com/50'}" class="item-icon" alt="Icon">
            <div class="item-info">
                <div class="item-title">${product.name || 'Product'}</div>
                <div class="item-date">${product.price || '-'}</div>
            </div>
            <div class="item-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
        `;
        
        el.addEventListener('click', () => {
            showProductModal(product);
        });
        
        container.appendChild(el);
    });
    hideGlobalLoader();
}

export function renderSocials(socials) {
    const container = document.getElementById('profile-list');
    container.innerHTML = '';
    
    socials.filter(s => s.isActive !== false)
           .sort((a, b) => (a.order || 0) - (b.order || 0))
           .forEach((social, index) => {
        const el = document.createElement('a');
        el.href = social.targetLink || social.link || '#';
        el.target = '_blank';
        el.rel = 'noopener noreferrer'; 
        el.className = 'social-card glass stagger-card';
        el.style.animationDelay = `${index * 0.08}s`;
        
        // Menambahkan properti CSS Flexbox untuk mengatur tata letak dengan benar
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'space-between';
        el.style.padding = '12px 18px';
        el.style.marginBottom = '12px';
        el.style.textDecoration = 'none'; // Menghilangkan garis bawah link
        el.style.color = '#ffffff'; // Mencegah tulisan menjadi warna biru default
        
        // Mempersiapkan fallback gambar jika url kosong / link gambar sudah mati
        const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(social.name || 'Link')}&background=random&color=fff`;
        const imgSrc = social.imageUrl || fallbackImg;
        
        // Membungkus logo & judul di kiri, dan panah di kanan
        el.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <img src="${imgSrc}" onerror="this.onerror=null;this.src='${fallbackImg}';" class="social-icon" alt="${social.name || 'Icon'}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                <span class="social-name" style="font-weight: bold; font-size: 16px; text-transform: uppercase;">${social.name || 'Link'}</span>
            </div>
            <span class="social-arrow" style="display: flex; align-items: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z"></path></svg>
            </span>
        `;
        container.appendChild(el);
    });
    hideGlobalLoader();
}
