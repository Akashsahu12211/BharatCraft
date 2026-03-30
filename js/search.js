/* ============================================================
   GLOBAL SEARCH SYSTEM & RESULTS ROUTE (js/search.js)
============================================================ */

(function() {
  
  window.renderSearchPage = async (app) => {
    const urlParams = new URL(window.location.hash.replace('#/search', 'http://localhost/search')).searchParams;
    const query = urlParams.get('q') || '';
    
    // Simulate complex merged fetching
    const products = window.demoData?.products || [];
    const artisans = window.demoData?.artisans || [];
    
    const pRes = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()));
    const aRes = artisans.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.craftType.toLowerCase().includes(query.toLowerCase()));

    let pHTML = '';
    if(pRes.length === 0) {
      pHTML = '<div style="padding:3rem; text-align:center; color:var(--text-muted);">No products found.</div>';
    } else {
      pHTML = '<div class="product-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:1.5rem;">';
      pRes.forEach(p => {
        pHTML += '<div class="product-card" onclick="window.router.navigate(\'/product/' + p.id + '\')" style="cursor:pointer;">' +
                   '<img src="' + p.image + '" class="pd-img" style="width:100%; height:250px; object-fit:cover; border-radius:12px 12px 0 0;">' +
                   '<div style="padding:1rem;">' +
                     '<h3 style="font-size:1.1rem; margin-bottom:5px;">' + p.name + '</h3>' +
                     '<div style="color:var(--primary); font-weight:800;">' + window.utils.formatCurrency(p.price) + '</div>' +
                   '</div>' +
                 '</div>';
      }); 
      pHTML += '</div>';
    }

    app.innerHTML = '<div class="search-page-container animate-in" style="max-width:1200px; margin:0 auto; padding: 2.5rem 1.5rem; min-height:80vh;">' +
        '<h1 style="font-family:var(--font-heading); margin-bottom:1rem; font-weight:800; font-size:2rem;">Search Results for "' + query + '"</h1>' +
        '<p style="color:var(--text-secondary); margin-bottom:2rem; font-weight:600;">Found ' + pRes.length + ' Products and ' + aRes.length + ' Artisans matching your query.</p>' +
        '<div style="display:flex; gap:1.5rem; border-bottom:2px solid var(--border); margin-bottom:2rem;">' +
          '<button class="s-tab active" style="background:none; border:none; padding:10px 0; font-size:1.1rem; font-weight:700; color:var(--primary); border-bottom:3px solid var(--primary); transform:translateY(2px);">Products (' + pRes.length + ')</button>' +
          '<button class="s-tab" style="background:none; border:none; padding:10px 0; font-size:1.1rem; font-weight:700; color:var(--text-muted);">Artisans (' + aRes.length + ')</button>' +
        '</div>' +
        '<div class="s-tab-content active" id="st-prods">' + pHTML + '</div>' +
      '</div>';
  };

  window.render404Page = async (app) => {
    app.innerHTML = '<div class="page-404 animate-in" style="text-align:center; padding: 5rem 1rem; min-height:80vh; display:flex; flex-direction:column; justify-content:center; align-items:center;">' +
       '<div class="bazaar-art" style="font-size:6rem; margin-bottom:1rem; animation: float 3s ease-in-out infinite;">🛖</div>' +
       '<h1 style="font-family:var(--font-heading); font-size:3rem; margin-bottom:10px; color:var(--primary);">404</h1>' +
       '<h2 style="font-weight:700; color:var(--text-primary); margin-bottom:15px;">This page got lost in the bazaar</h2>' +
       '<p style="color:var(--text-secondary); max-width:400px; margin-bottom:2rem;">We searched every stall, but couldn\'t find what you\'re looking for. Let\'s get you back to the main market.</p>' +
       '<div style="display:flex; gap:15px; justify-content:center;">' +
         '<button class="btn btn-primary" onclick="window.router.navigate(\'/\')">Return Home</button>' +
         '<button class="btn btn-outline" onclick="window.router.navigate(\'/products\')">Shop Products</button>' +
       '</div>' +
    '</div>';
  }; 

  // Global search init logic natively runs without route
  document.addEventListener('DOMContentLoaded', () => {
    
    const searchBtn = document.getElementById('nav-search-btn');
    const searchBar = document.getElementById('global-search-bar');
    const searchInput = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('gsb-results');
    
    let debounceTimer;

    const sessionCache = {
      get: (key) => {
        const item = sessionStorage.getItem(key);
        if(!item) return null;
        const parsed = JSON.parse(item);
        if (Date.now() > parsed.expiry) { sessionStorage.removeItem(key); return null; }
        return parsed.data;
      },
      set: (key, data) => {
        sessionStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + 300000 }));
      }
    };

    searchBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      searchBar.classList.toggle('active');
      if(searchBar.classList.contains('active')) {
        searchInput.focus();
        showInitialSearchState();
      }
    });

    document.addEventListener('click', (e) => {
      if(searchBar && searchBar.classList.contains('active') && !searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
        searchBar.classList.remove('active');
      }
    });

    const getHistory = () => JSON.parse(localStorage.getItem('bharat_search_hist') || '[]');
    const saveHistory = (term) => {
      let h = getHistory();
      h = h.filter(x => x !== term);
      h.unshift(term);
      if(h.length > 5) h.pop();
      localStorage.setItem('bharat_search_hist', JSON.stringify(h));
    };

    function showInitialSearchState() {
      const hist = getHistory();
      let html = '<div style="padding: 1rem; color: var(--text-primary);">';
      
      if(hist.length > 0) {
         html += '<div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--text-secondary); margin-bottom:10px;">Recent Searches</div>' +
            '<div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:1.5rem;">';
         hist.forEach(h => html += '<button class="btn btn-outline rs-chip" style="padding:4px 12px; font-size:0.85rem;">' + h + '</button>');
         html += '</div>';
      }

      html += '<div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--text-secondary); margin-bottom:10px;">Popular Right Now</div>' +
        '<div style="display:flex; flex-wrap:wrap; gap:8px;">';
      ['Madhubani', 'Pottery', 'Pashmina', 'Warli', 'Block Print'].forEach(p => html += '<button class="btn btn-outline pop-chip" style="padding:4px 12px; font-size:0.85rem; border-color:var(--saffron); color:var(--saffron);">' + p + '</button>');
      html += '</div></div>';
      
      if(resultsContainer) resultsContainer.innerHTML = html;

      document.querySelectorAll('.rs-chip, .pop-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          searchInput.value = btn.innerText;
          triggerSearch(btn.innerText);
        });
      });
    }

    searchInput?.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if(!query) { showInitialSearchState(); return; }
      
      clearTimeout(debounceTimer);
      resultsContainer.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--text-muted);">' +
         '<div class="loader-spinner" style="margin:0 auto 10px;"></div>Searching artisans and products...</div>';
      
      debounceTimer = setTimeout(() => triggerSearch(query), 300);
    });

    async function triggerSearch(query) {
       saveHistory(query);
       const cacheKey = 'search_' + query.toLowerCase();
       let res = sessionCache.get(cacheKey);

       if(!res) {
          let pList = [], aList = [];
          if(window.demoData) {
            pList = window.demoData.products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0,3);
            aList = window.demoData.artisans.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || a.craftType.toLowerCase().includes(query.toLowerCase())).slice(0,2);
          }
          res = { products: pList, artisans: aList };
          sessionCache.set(cacheKey, res);
       }

       let outHtml = '<div style="padding: 1rem;">';
       
       if(res.products.length > 0) {
         outHtml += '<div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--text-secondary); margin-bottom:10px; border-bottom:1px solid var(--border); padding-bottom:5px;">Products</div>';
         res.products.forEach(p => {
           outHtml += '<div class="search-item" style="display:flex; align-items:center; gap:10px; padding:8px; border-radius:6px; cursor:pointer;" onclick="window.router.navigate(\'/product/' + p.id + '\'); document.getElementById(\'global-search-bar\').classList.remove(\'active\');">' +
                '<img src="' + p.image + '" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">' +
                '<div style="flex:1;">' +
                   '<div style="font-weight:700; font-size:0.9rem; color:var(--text-primary);">' + p.name + '</div>' +
                   '<div style="font-size:0.8rem; color:var(--text-muted);">' + window.utils.formatCurrency(p.price) + '</div>' +
                '</div></div>';
         });
       }

       if(res.artisans.length > 0) {
         outHtml += '<div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--text-secondary); margin:15px 0 10px; border-bottom:1px solid var(--border); padding-bottom:5px;">Artisans</div>';
         res.artisans.forEach(a => {
           outHtml += '<div class="search-item" style="display:flex; align-items:center; gap:10px; padding:8px; border-radius:6px; cursor:pointer;" onclick="window.router.navigate(\'/artisan/' + a.id + '\'); document.getElementById(\'global-search-bar\').classList.remove(\'active\');">' +
                '<img src="' + (a.avatar || 'https://i.pravatar.cc/150?u='+a.id) + '" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">' +
                '<div style="flex:1;">' +
                   '<div style="font-weight:700; font-size:0.9rem; color:var(--text-primary);">' + a.name + '</div>' +
                   '<div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase;">' + a.craftType + '</div>' +
                '</div></div>';
         });
       }

       if(res.products.length === 0 && res.artisans.length === 0) {
         outHtml += '<div style="padding:2rem; text-align:center; color:var(--text-muted);">No results found for "' + query + '"</div>';
       } else {
         outHtml += '<button style="width:100%; border:none; background:var(--bg-elevated); padding:12px; margin-top:10px; border-radius:8px; font-weight:700; color:var(--primary); cursor:pointer; transition:0.2s;" onmouseover="this.style.background=\'#e2e8f0\'" onmouseout="this.style.background=\'var(--bg-elevated)\'" onclick="window.router.navigate(\'/search?q=' + encodeURIComponent(query) + '\'); document.getElementById(\'global-search-bar\').classList.remove(\'active\');">See all results for "' + query + '" →</button>';
       }
       
       outHtml += '</div>';
       if(resultsContainer) resultsContainer.innerHTML = outHtml;
    }

    window.addEventListener('offline', () => window.utils?.toast && window.utils.toast("You're offline — showing cached data.", 'info'));
    window.addEventListener('online', () => window.utils?.toast && window.utils.toast("Back online. Network restored.", 'success'));

    // Intersection observers specifically for lazy-loading elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('visible');
          if(entry.target.tagName === 'IMG' && entry.target.dataset.src) {
             entry.target.src = entry.target.dataset.src;
             entry.target.removeAttribute('data-src');
          }
        }
      });
    }, { rootMargin: '50px' });
    
    setInterval(() => {
      document.querySelectorAll('.animate-in:not(.obs-attached), img[loading="lazy"]:not(.obs-attached)').forEach(el => {
        observer.observe(el);
        el.classList.add('obs-attached');
      });
    }, 1000);

  });

})();
