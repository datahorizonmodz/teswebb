import { hideGlobalLoader, showProductModal } from "./ui.js";

export function renderApps(apps) {
    const container = document.getElementById('home-list');
    container.innerHTML = ''; 
    
    apps.forEach((app, index) => {
        const el = document.createElement('a');
        el.href = app.link || '#';
        el.className = 'item-card glass app-item stagger-card'; 
        el.style.animationDelay = `${index * 0.08}s`; 
        
        // Atribut untuk filter dan pencarian
        el.dataset.category = (app.category || 'All').toLowerCase();
        el.dataset.name = app.name || '';
        
        el.innerHTML = `
            <img src="${app.imageUrl || 'https://via.placeholder.com/50'}" class="item-icon" alt="Icon">
            <div class="item-info">
                <div class="item-title">${app.name || 'App Name'}</div>
                <div class="item-date">${app.date || 'Update'}</div>
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
        el.href = social.url || '#';
        el.className = 'social-btn glass stagger-card';
        el.style.animationDelay = `${index * 0.08}s`;
        
        el.innerHTML = `
            <span>${social.name || 'Link'}</span>
        `;
        container.appendChild(el);
    });
    hideGlobalLoader();
}
