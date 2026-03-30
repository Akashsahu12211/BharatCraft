// ============================================================
// BHARATCRAFT – Utility Functions (Global Object)
// ============================================================
window.utils = (() => {

    // ── UI Notifications ─────────────────────────────────────────
    function toast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toastEl = document.createElement('div');
        toastEl.className = `toast toast-${type}`;
        toastEl.textContent = message;

        container.appendChild(toastEl);
        
        // Reflow hack to animate in
        requestAnimationFrame(() => requestAnimationFrame(() => toastEl.classList.add('show')));

        setTimeout(() => {
            toastEl.classList.remove('show');
            setTimeout(() => {
                toastEl.remove();
            }, 300); // Wait for transiton
        }, 3000);
    }

    // ── Formatting ───────────────────────────────────────────────
    function formatPrice(amount) {
        if (isNaN(amount) || amount === null) return '₹0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    function formatDate(timestamp) {
        if (!timestamp) return '';
        let d = (timestamp.toDate && typeof timestamp.toDate === 'function') 
            ? timestamp.toDate() 
            : new Date(timestamp);
            
        return new Intl.DateTimeFormat('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        }).format(d);
    }

    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    function truncate(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    function renderStars(rating) {
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let html = '';
        for (let i = 0; i < fullStars; i++) html += '<span class="star full" style="color:var(--accent);">&#9733;</span>';
        if (hasHalfStar) html += '<span class="star half" style="color:var(--accent);">&#9734;</span>';
        for (let i = 0; i < emptyStars; i++) html += '<span class="star empty" style="color:var(--border);">&#9733;</span>';
        
        return `<div class="star-rating d-flex align-items-center" style="gap:2px;">${html}</div>`;
    }

    function getInitials(name) {
        if (!name) return '?';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }

    function slugify(text) {
        if (!text) return '';
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    // ── Navigation & Layout Helpers ──────────────────────────────
    function setActiveNavLink(path) {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (link.getAttribute('href') === '#' + path || link.dataset.route === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function showPageLoading() {
        return `<div class="container d-flex justify-content-center align-items-center" style="min-height:50vh;">
                  <div class="spinner"></div>
                </div>`;
    }

    function scrollTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function statusBadge(status) {
        const s = (status || '').toLowerCase();
        let colorClass = 'tag'; 
        if (s === 'delivered') colorClass = 'badge badge-success';
        else if (s === 'cancelled') colorClass = 'badge badge-danger';
        else if (s === 'shipped') colorClass = 'badge badge-info';
        
        return `<span class="badge ${colorClass}" style="background-color:var(--accent-light); color:var(--text-primary); text-transform:capitalize;">${status}</span>`;
    }

    // ── HTML Generators ──────────────────────────────────────────
    function productCardHTML(p, inWishlist = false) {
        const wishBtnClass = inWishlist ? 'active' : '';
        const wishIcon = inWishlist ? '❤️' : '🤍';
        return `
        <div class="card product-card">
            <div style="position:relative;">
                <a href="#/products/${p.id}">
                    <img src="${p.image || 'https://placehold.co/300x200/FDEBD0/C84B31?text=' + encodeURIComponent(p.name)}" alt="${p.name}" style="width:100%;height:220px;object-fit:cover;" loading="lazy">
                </a>
                <button class="wishlist-btn ${wishBtnClass}" onclick="event.stopPropagation(); window.wishlistModule?.toggleWishlist('${p.id}')" style="position:absolute;top:10px;right:10px;background:white;border:none;border-radius:50%;padding:8px;cursor:pointer;box-shadow:var(--shadow-sm); z-index:2;">${wishIcon}</button>
            </div>
            <div style="padding:16px;">
                <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">${p.category || 'Craft'}</div>
                <h4 style="margin-bottom:8px;font-size:1.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    <a href="#/products/${p.id}" style="color:var(--text-primary); text-decoration:none;">${p.name}</a>
                </h4>
                <div style="margin-bottom:12px;">${renderStars(p.rating || 0)}</div>
                <div class="d-flex justify-content-between align-items-center">
                    <span style="font-weight:700;font-size:1.2rem;color:var(--primary);">${formatPrice(p.price)}</span>
                    <button class="btn btn-primary" style="padding:0.4rem 0.8rem; border-radius:4px; font-size:0.875rem;" onclick="event.stopPropagation(); window.cartModule?.addToCart('${p.id}')">Add to Cart</button>
                </div>
            </div>
        </div>`;
    }

    function artisanCardHTML(a) {
        return `
        <div class="card artisan-card d-flex flex-column align-items-center" style="padding:24px; text-align:center;">
            <img src="${a.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(a.name) + '&background=FDEBD0&color=C84B31'}" alt="${a.name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin-bottom:16px;box-shadow:var(--shadow-sm);">
            <h4 style="margin-bottom:4px;font-size:1.15rem;"><a href="#/artisan/${a.id}" style="color:var(--text-primary); text-decoration:none;">${a.name}</a></h4>
            <div style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:12px;">📍 ${a.location || 'India'}</div>
            <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:16px;">${truncate(a.bio, 60)}</p>
            <a href="#/artisan/${a.id}" class="btn btn-outline" style="border-radius:999px;font-size:0.875rem;padding:0.4rem 1rem;">View Profile</a>
        </div>`;
    }

    // ── Modals & Lightboxes ─────────────────────────────────────
    function openLightbox(images, selectedImage) {
        const overlay = document.getElementById('lightbox-overlay');
        const imgEl = document.getElementById('lightbox-img');
        if (!overlay || !imgEl || !images || images.length === 0) return;
        
        let currentIndex = Math.max(0, images.indexOf(selectedImage));
        imgEl.src = images[currentIndex];
        overlay.style.display = 'flex';

        document.getElementById('lightbox-close').onclick = () => overlay.style.display = 'none';
        document.getElementById('lightbox-prev').onclick = () => {
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            imgEl.src = images[currentIndex];
        };
        document.getElementById('lightbox-next').onclick = () => {
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            imgEl.src = images[currentIndex];
        };
    }

    function openModal(htmlContent) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        if (!overlay || !content) return;
        content.innerHTML = htmlContent;
        overlay.style.display = 'flex';
        document.getElementById('modal-close').onclick = () => overlay.style.display = 'none';
    }

    // ── Functionality Helpers ────────────────────────────────────
    function debounce(fn, delay = 300) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Expose all utilities to window.utils
    return {
        toast,
        formatPrice,
        formatDate,
        capitalize,
        truncate,
        renderStars,
        getInitials,
        slugify,
        setActiveNavLink,
        showPageLoading,
        scrollTop,
        statusBadge,
        productCardHTML,
        artisanCardHTML,
        openLightbox,
        openModal,
        debounce
    };

})();
