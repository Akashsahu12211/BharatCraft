/* ============================================================
   PRODUCTS LISTING PAGE (js/pages/products.js)
============================================================ */
(function() {
  const CATEGORIES = ['Pottery', 'Textiles', 'Painting', 'Jewelry', 'Woodwork', 'Metal', 'Leather', 'Toys'];
  const STATES = ['Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka', 'Kerala', 'Tamil Nadu', 'West Bengal', 'Odisha', 'Kashmir', 'Uttar Pradesh'];

  window.renderProductsPage = async (app, params) => {
    
    // 1. Initial State
    let state = {
      categories: params.category ? [params.category] : [],
      search: params.search || '',
      minPrice: 0,
      maxPrice: 50000,
      rating: 0,
      stateLoc: params.location || '',
      handmade: false,
      inStock: false,
      sort: 'featured',
      view: window.innerWidth > 800 ? 'grid' : 'grid',
      page: 1
    };

    let allProductsCache = []; // Master list
    let filteredProducts = [];
    let displayedProducts = [];
    const PAGE_SIZE = 12;

    // 2. Render Shell
    app.innerHTML = `
      <div class="products-page animate-in">
        <div class="mobile-filter-overlay" id="mobile-filter-overlay"></div>
        
        <!-- SIDEBAR -->
        <aside class="filter-sidebar" id="filter-sidebar">
          <div class="mobile-close-filter" id="mobile-close"></div>
          <div class="filter-header">
            <h2>Filters</h2>
            <button class="btn-clear" id="filter-clear">Clear All</button>
          </div>

          <div class="filter-group">
            <h3 class="filter-title">Price Range</h3>
            <div class="price-slider-wrap">
              <div class="slider-track"></div>
              <div class="slider-range" id="slider-range"></div>
              <input type="range" id="price-min" class="price-input" min="0" max="50000" value="${state.minPrice}" step="500">
              <input type="range" id="price-max" class="price-input" min="0" max="50000" value="${state.maxPrice}" step="500">
            </div>
            <div class="price-display">
              <span id="price-min-display">₹${state.minPrice}</span>
              <span id="price-max-display">₹50,000</span>
            </div>
          </div>

          <div class="filter-group">
            <h3 class="filter-title">Category</h3>
            <div id="filter-cats">
              ${CATEGORIES.map(c => `
                <label class="filter-checkbox">
                  <div class="fc-left">
                    <input type="checkbox" value="${c}" ${state.categories.includes(c) ? 'checked' : ''}>
                    <span class="fc-label">${c}</span>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-group">
            <h3 class="filter-title">Location</h3>
            <select class="state-select" id="filter-state">
              <option value="">All Regions</option>
              ${STATES.map(s => `<option value="${s}" ${state.stateLoc === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>

          <div class="filter-group">
            <h3 class="filter-title">Rating</h3>
            <div id="filter-ratings">
              ${[4,3,2,1].map(r => `
                <button class="rating-btn ${state.rating===r?'active':''}" data-val="${r}">
                  <span class="stars">${'★'.repeat(r)}${'☆'.repeat(5-r)}</span> & up
                </button>
              `).join('')}
            </div>
          </div>

          <div class="filter-group">
            <h3 class="filter-title">Preferences</h3>
            <label class="toggle-row">
              <span class="toggle-label">Handmade Only</span>
              <div class="switch">
                <input type="checkbox" id="filter-handmade" ${state.handmade?'checked':''}>
                <span class="slider-toggle"></span>
              </div>
            </label>
            <label class="toggle-row">
              <span class="toggle-label">In Stock</span>
              <div class="switch">
                <input type="checkbox" id="filter-instock" ${state.inStock?'checked':''}>
                <span class="slider-toggle"></span>
              </div>
            </label>
          </div>
          
          <button class="btn btn-primary" id="btn-apply-mobile" style="width:100%; margin-top: 1rem; display:none;">Apply Filters</button>
        </aside>

        <!-- MAIN AREA -->
        <main class="products-main" id="products-main">
          <div class="products-topbar">
            <div class="topbar-header">
              <div class="results-count" id="results-count">Loading products...</div>
              <div class="topbar-actions">
                <button class="btn-mobile-filter" id="btn-mobile-filter">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path></svg>
                  Filters
                </button>
                <select class="sort-select" id="sort-select">
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div class="view-toggles">
                  <button class="view-btn ${state.view==='grid'?'active':''}" id="view-grid"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></button>
                  <button class="view-btn ${state.view==='list'?'active':''}" id="view-list"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></button>
                </div>
              </div>
            </div>
            <div class="active-filters" id="active-filters"></div>
          </div>

          <div class="product-grid ${state.view==='list'?'list-view':''}" id="main-grid">
             <!-- Products populate here -->
             ${window.utils.skeletonHTML(8)}
          </div>
          
          <div class="empty-products" id="empty-state" style="display:none;">
            <h3>No products found</h3>
            <p>Try adjusting your category, price range, or search criteria.</p>
            <button class="btn btn-outline" id="btn-empty-clear">Clear All Filters</button>
          </div>

          <div class="loading-more" id="loading-more">
            <span class="spinner"></span>
            <div style="margin-top:10px; color:var(--text-muted); font-size:0.9rem;">Loading more...</div>
          </div>
        </main>
      </div>
    `;

    // ── SLIDER & BINDINGS ──────────────────────────────────────
    const minInput = document.getElementById('price-min');
    const maxInput = document.getElementById('price-max');
    const minDisplay = document.getElementById('price-min-display');
    const maxDisplay = document.getElementById('price-max-display');
    const sliderRange = document.getElementById('slider-range');
    const gap = 1000;

    function updateSliderUI() {
      let min = parseInt(minInput.value);
      let max = parseInt(maxInput.value);
      if (max - min < gap) {
        if (event?.target.id === 'price-min') { minInput.value = max - gap; min = max - gap; }
        else { maxInput.value = min + gap; max = min + gap; }
      }
      minDisplay.innerText = '₹' + min.toLocaleString();
      maxDisplay.innerText = '₹' + (max===50000 ? '50,000+' : max.toLocaleString());
      const minPercent = (min / 50000) * 100;
      const maxPercent = (max / 50000) * 100;
      sliderRange.style.left = minPercent + '%';
      sliderRange.style.width = (maxPercent - minPercent) + '%';
      
      state.minPrice = min;
      state.maxPrice = max===50000 ? Infinity : max;
    }
    minInput.addEventListener('input', updateSliderUI);
    maxInput.addEventListener('input', updateSliderUI);
    
    // Desktop: Live Filter, Mobile: Wait for Apply button
    const isMobile = () => window.innerWidth <= 1024;
    function triggerFilter() {
      if (!isMobile()) applyFilters();
    }
    
    minInput.addEventListener('change', triggerFilter);
    maxInput.addEventListener('change', triggerFilter);

    // Categories
    document.querySelectorAll('#filter-cats input').forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) state.categories.push(e.target.value);
        else state.categories = state.categories.filter(c => c !== e.target.value);
        triggerFilter();
      });
    });

    // Rating / State / Toggles
    document.getElementById('filter-state').addEventListener('change', (e) => { state.stateLoc = e.target.value; triggerFilter(); });
    document.getElementById('filter-handmade').addEventListener('change', (e) => { state.handmade = e.target.checked; triggerFilter(); });
    document.getElementById('filter-instock').addEventListener('change', (e) => { state.inStock = e.target.checked; triggerFilter(); });
    
    document.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Toggle off if already active
        const val = parseInt(e.currentTarget.dataset.val);
        if(state.rating === val) { state.rating = 0; e.currentTarget.classList.remove('active'); }
        else {
          document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          state.rating = val;
        }
        triggerFilter();
      });
    });

    // Clear All
    function clearFilters() {
      state.categories = [];
      state.minPrice = 0; state.maxPrice = 50000;
      state.rating = 0; state.stateLoc = ''; state.handmade = false; state.inStock = false;
      state.search = '';
      
      // Reset UI
      document.querySelectorAll('#filter-cats input').forEach(cb => cb.checked = false);
      minInput.value = 0; maxInput.value = 50000; updateSliderUI();
      document.getElementById('filter-state').value = '';
      document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('filter-handmade').checked = false;
      document.getElementById('filter-instock').checked = false;
      
      applyFilters();
    }
    document.getElementById('filter-clear').addEventListener('click', clearFilters);
    document.getElementById('btn-empty-clear').addEventListener('click', clearFilters);

    // Sort & View
    document.getElementById('sort-select').addEventListener('change', (e) => {
      state.sort = e.target.value;
      applyFilters();
    });
    
    const gridEl = document.getElementById('main-grid');
    document.getElementById('view-grid').addEventListener('click', (e) => {
      state.view = 'grid'; gridEl.classList.remove('list-view');
      e.currentTarget.classList.add('active'); document.getElementById('view-list').classList.remove('active');
    });
    document.getElementById('view-list').addEventListener('click', (e) => {
      state.view = 'list'; gridEl.classList.add('list-view');
      e.currentTarget.classList.add('active'); document.getElementById('view-grid').classList.remove('active');
    });

    // Mobile Sheet
    const sidebar = document.getElementById('filter-sidebar');
    const overlay = document.getElementById('mobile-filter-overlay');
    function openMobileFilter() { sidebar.classList.add('open'); overlay.classList.add('open'); document.getElementById('btn-apply-mobile').style.display='block'; }
    function closeMobileFilter() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }
    document.getElementById('btn-mobile-filter').addEventListener('click', openMobileFilter);
    overlay.addEventListener('click', closeMobileFilter);
    document.getElementById('btn-apply-mobile').addEventListener('click', () => { closeMobileFilter(); applyFilters(); });

    // ── DATA FETCH & FILTERING ────────────────────────────────
    
    // We fetch everything once or rely on a broad query limit, then client-filter
    // This provides exact, real-time feedback with zero Firestore composite index crashes.
    async function initData() {
      try {
        if (window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
          const snap = await window.fbDB.collection('products').limit(100).get(); // fetch up to 100 for catalog
          allProductsCache = snap.docs.map(d => ({id: d.id, ...d.data()}));
          // if empty, use demo
          if(!allProductsCache.length) allProductsCache = window.demoData.products;
        } else {
          allProductsCache = window.demoData.products;
        }
      } catch (e) {
        console.error("Products fallback:", e);
        allProductsCache = window.demoData.products;
      }
      applyFilters();
    }

    function applyFilters() {
      // Setup Active Tags UI
      renderActiveTags();

      // Filter Logic
      filteredProducts = allProductsCache.filter(p => {
        // Search
        if (state.search) {
          const s = state.search.toLowerCase();
          if (!p.name.toLowerCase().includes(s) && !p.category?.toLowerCase().includes(s)) return false;
        }
        // Category
        if (state.categories.length > 0 && !state.categories.includes(p.category)) return false;
        // Price
        if (p.price < state.minPrice || p.price > state.maxPrice) return false;
        // State
        if (state.stateLoc && p.artisanState !== state.stateLoc) return false;
        // Rating
        if (state.rating > 0 && (p.rating || 0) < state.rating) return false;
        // Toggles
        if (state.handmade && !p.isHandmade) return false;
        if (state.inStock && p.stock === 0) return false;
        return true;
      });

      // Sort
      filteredProducts.sort((a, b) => {
        if (state.sort === 'price_asc') return a.price - b.price;
        if (state.sort === 'price_desc') return b.price - a.price;
        if (state.sort === 'rating') return (b.rating||0) - (a.rating||0);
        if (state.sort === 'newest') return (b.createdAt?.toMillis() || Date.now()) - (a.createdAt?.toMillis() || Date.now());
        // 'featured' -> push true to top
        if (state.sort === 'featured') return (a.isFeatured === b.isFeatured) ? 0 : a.isFeatured ? -1 : 1;
        return 0;
      });

      state.page = 1;
      displayedProducts = [];
      gridEl.innerHTML = '';
      
      document.getElementById('results-count').innerText = `Showing ${filteredProducts.length} products`;
      
      if (filteredProducts.length === 0) {
        document.getElementById('empty-state').style.display = 'block';
      } else {
        document.getElementById('empty-state').style.display = 'none';
        loadMore(); // Loads first page
      }
    }

    function renderActiveTags() {
      const tagsWrap = document.getElementById('active-filters');
      tagsWrap.innerHTML = '';
      let tags = [];
      if (state.search) tags.push({l: `Search: "${state.search}"`, action: () => {state.search=''; applyFilters();} });
      state.categories.forEach(c => tags.push({l: c, action: () => {state.categories = state.categories.filter(x=>x!==c); document.querySelector(`input[value="${c}"]`).checked=false; applyFilters();}}));
      if (state.minPrice > 0 || state.maxPrice !== Infinity) tags.push({l: `₹${state.minPrice} - ${state.maxPrice===Infinity?'50K+':'₹' + state.maxPrice}`, action: () => {minInput.value=0; maxInput.value=50000; updateSliderUI(); triggerFilter();}});
      if (state.stateLoc) tags.push({l: state.stateLoc, action: () => {document.getElementById('filter-state').value=''; state.stateLoc=''; applyFilters();}});
      if (state.rating > 0) tags.push({l: `${state.rating}★ & above`, action: () => {state.rating=0; document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active')); applyFilters();}});
      
      tags.forEach(t => {
        const el = document.createElement('div');
        el.className = 'filter-chip';
        el.innerHTML = `${t.l} <span class="chip-close">×</span>`;
        el.querySelector('.chip-close').addEventListener('click', t.action);
        tagsWrap.appendChild(el);
      });
    }

    // ── INFINITE SCROLL & RENDER ───────────────────────────────
    function loadMore() {
      const startIndex = (state.page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const slice = filteredProducts.slice(startIndex, endIndex);
      
      if (slice.length === 0) return; // No more
      
      displayedProducts = [...displayedProducts, ...slice];
      
      slice.forEach(p => {
        const div = document.createElement('div');
        div.innerHTML = extendedProductCardHTML(p, window.wishlistModule?.hasProduct(p.id));
        gridEl.appendChild(div.firstElementChild);
      });
      
      state.page++;
      
      // Bind Cart clicks for new elements
      gridEl.querySelectorAll('.btn-add-cart:not(.bound)').forEach(btn => {
        btn.classList.add('bound');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = e.currentTarget.dataset.id;
          const p = displayedProducts.find(x => x.id === pId);
          if(p) {
            window.cartModule.addToCart(p);
            e.currentTarget.innerHTML = '✔ Added';
            e.currentTarget.classList.add('added');
            setTimeout(() => { e.currentTarget.innerHTML = 'Add to Cart'; e.currentTarget.classList.remove('added'); }, 1500);
          }
        });
      });
    }

    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        if(displayedProducts.length < filteredProducts.length) {
          document.getElementById('loading-more').style.display = 'block';
          setTimeout(() => {
            loadMore();
            document.getElementById('loading-more').style.display = 'none';
          }, 600); // Artificial delay to show smooth loading
        }
      }
    }, { rootMargin: '100px' });
    
    // Create an invisible target at the bottom for scroll observer
    const sentinel = document.createElement('div');
    document.getElementById('products-main').appendChild(sentinel);
    observer.observe(sentinel);


    function extendedProductCardHTML(product, isWishlisted) {
      const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
      let extraImages = '';
      if(product.images && product.images.length > 1) {
        extraImages = `<img class="prod-img-hover" src="${product.images[1]}" alt="${product.name}">`;
      }
      return `
        <div class="prod-card" data-id="${product.id}">
          ${product.isHandmade ? '<div class="badge-handmade">Handmade</div>' : ''}
          ${discount > 0 ? `<div class="badge-discount">${discount}% OFF</div>` : ''}
          <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick="window.wishlistModule.toggle('${product.id}', this); event.stopPropagation();">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
          
          <div class="prod-img-wrap" onclick="window.router.navigate('/product/${product.id}')">
            <img class="prod-img-main" src="${product.images ? product.images[0] : 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80'}" alt="${product.name}">
            ${extraImages}
            <div class="quick-view">Quick View</div>
          </div>
          
          <div class="prod-body">
            <span class="prod-cat">${product.category || 'Craft'}</span>
            <div class="pb-left">
              <h3 class="prod-name" onclick="window.router.navigate('/product/${product.id}')">${product.name}</h3>
              <span class="prod-artisan">${product.artisanName || 'BharatCraft Artisan'}, ${product.artisanState || 'India'}</span>
              <div class="prod-stars">
                ${window.utils.generateStars(product.rating || 0)} 
                <span>(${product.reviewCount || 0} reviews)</span>
              </div>
            </div>
            <div class="prod-desc">${product.description || 'A beautiful handcrafted piece made with love.'}</div>
            
            <div class="pb-right">
              <div class="prod-pricing">
                <span class="price-curr">${window.utils.formatCurrency(product.price)}</span>
                ${product.originalPrice ? `<span class="price-orig">${window.utils.formatCurrency(product.originalPrice)}</span>` : ''}
              </div>
              <button class="btn-add-cart" data-id="${product.id}">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
    }

    // Initialize UI and Fetch
    updateSliderUI();
    initData();

  };
})();
