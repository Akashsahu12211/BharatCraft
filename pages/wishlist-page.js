/* ============================================================
   WISHLIST PAGE (js/pages/wishlist-page.js)
============================================================ */

(function() {

  window.renderWishlistPage = async (app) => {
    
    if(!window.authModule?.user) {
       window.utils.toast('Sign in to view your wishlist collection.', 'error');
       return window.router.navigate('/auth');
    }

    const uid = window.authModule.user.uid;
    let savedProducts = [];
    let savedArtisans = [];
    
    // Fetch directly using FB arrays
    try {
      if(window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
         const usrSnap = await window.fbDB.collection('users').doc(uid).get();
         const ids = usrSnap.data()?.wishlist || [];
         const artIds = usrSnap.data()?.following || [];

         if(ids.length > 0) {
           // Firestore `in` query max is 10, batching simulated
           const chunks = [];
           for(let i=0; i<ids.length; i+=10) chunks.push(ids.slice(i, i+10));
           const resolves = await Promise.all(chunks.map(chk => window.fbDB.collection('products').where(window.firebase.firestore.FieldPath.documentId(), 'in', chk).get()));
           resolves.forEach(snap => { snap.docs.forEach(d => savedProducts.push({id: d.id, ...d.data()})); });
         }
         
         if(artIds.length > 0) {
           const chunks = [];
           for(let i=0; i<artIds.length; i+=10) chunks.push(artIds.slice(i, i+10));
           const resolves = await Promise.all(chunks.map(chk => window.fbDB.collection('artisans').where(window.firebase.firestore.FieldPath.documentId(), 'in', chk).get()));
           resolves.forEach(snap => { snap.docs.forEach(d => savedArtisans.push({id: d.id, ...d.data()})); });
         }
      } else {
         // Demo Mocking
         savedProducts = window.demoData.products.slice(0, 3);
         savedArtisans = window.demoData.artisans.slice(0, 2);
      }
    } catch(e) { console.warn(e); }

    function renderProducts() {
      if(savedProducts.length === 0) {
        return `
          <div class="wl-empty">
            <div class="wl-empty-icon">🤍</div>
            <h3>Your wishlist is empty</h3>
            <p>Explore our handcrafted collections and ❤️ items to save them here for later.</p>
            <button class="btn btn-primary" onclick="window.router.navigate('/products')">Discover Products</button>
          </div>
        `;
      }
      return `
        <div class="wl-actions-row">
          <button class="btn btn-outline" id="btn-move-all" style="font-weight:700;">🛒 Move All to Cart</button>
        </div>
        <div class="wl-grid">
          ${savedProducts.map(p => `
            <div class="wl-card-wrap">
              <div class="wl-prod-card">
                 <img src="${p.image}" class="wl-img" onclick="window.router.navigate('/product/${p.id}')" style="cursor:pointer;">
                 <div class="wl-info">
                   <div class="wl-title">${p.name}</div>
                   <div class="wl-price">${window.utils.formatCurrency(p.price)}</div>
                 </div>
                 <div class="wl-card-actions">
                   <button class="btn-wl-act btn-wl-remove" data-id="${p.id}">✕ Remove</button>
                   <button class="btn-wl-act btn-wl-add" data-id="${p.id}">+ Add to Cart</button>
                 </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    function renderArtisans() {
      if(savedArtisans.length === 0) {
        return `
          <div class="wl-empty">
            <div class="wl-empty-icon" style="color:#38bdf8;">🧑‍🎨</div>
            <h3>You aren't following anyone yet</h3>
            <p>Back the map and follow incredible Indian artisans to track their newest master pieces natively.</p>
            <button class="btn btn-primary" onclick="window.router.navigate('/map')">Explore Map</button>
          </div>
        `;
      }
      return `
        <div class="wl-grid" style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));">
          ${savedArtisans.map(a => `
            <div class="wl-art-card">
               <img src="${a.avatar || 'https://i.pravatar.cc/150?u='+a.id}" class="wl-art-av">
               <div class="wl-art-name">${a.name}</div>
               <div class="wl-art-craft">${a.craftType}</div>
               <div class="wl-art-meta">📍 ${a.location?.city || 'India'} | ★ ${a.rating||4.8}</div>
               <div class="wl-art-actions">
                 <button class="btn btn-primary" style="width:100%;" onclick="window.router.navigate('/artisan/${a.id}')">View Profile</button>
                 <button class="btn btn-outline btn-unfollow" style="width:100%; border-color:#e2e8f0;" data-id="${a.id}">Unfollow ✕</button>
               </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    app.innerHTML = `
      <div class="wl-page animate-in">
        <div class="wl-header">
          <h1>My Collections</h1>
        </div>
        
        <div class="wl-tabs">
          <button class="wl-tab-btn active" data-target="tab-prods">❤️ Saved Products (${savedProducts.length})</button>
          <button class="wl-tab-btn" data-target="tab-arts">🧑‍🎨 Following Artisans (${savedArtisans.length})</button>
        </div>

        <div class="wl-tab-content active" id="tab-prods">
          ${renderProducts()}
        </div>
        
        <div class="wl-tab-content" id="tab-arts">
          ${renderArtisans()}
        </div>
      </div>
    `;

    // Tabs functionality
    const tabs = document.querySelectorAll('.wl-tab-btn');
    const contents = document.querySelectorAll('.wl-tab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
      });
    });

    // Products logic bindings
    document.querySelectorAll('.btn-wl-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        window.wishlistModule?.toggle(id, e.currentTarget);
        // Refresh DOM visually instantly
        e.currentTarget.closest('.wl-card-wrap').remove();
      });
    });

    document.querySelectorAll('.btn-wl-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const p = savedProducts.find(x => x.id === id);
        if(p && window.cartModule) {
          window.cartModule.add(p, 1);
          window.wishlistModule?.toggle(id, null); // remove silently
          e.currentTarget.closest('.wl-card-wrap').remove();
        }
      });
    });

    const moveAll = document.getElementById('btn-move-all');
    if(moveAll) {
      moveAll.addEventListener('click', () => {
        if(window.cartModule && window.wishlistModule) {
           savedProducts.forEach(p => {
             window.cartModule.add(p, 1);
             window.wishlistModule.toggle(p.id, null);
           });
           window.utils.toast('Moved all items to Cart!', 'success');
           document.getElementById('tab-prods').innerHTML = renderProducts(); // force empty re-render
        }
      });
    }

    // Artisans Unfollow logic
    document.querySelectorAll('.btn-unfollow').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if(confirm('Are you sure you want to unfollow this artisan?')) {
           window.utils.toast('Unfollowed cleanly via UI.', 'info');
           e.currentTarget.closest('.wl-art-card').remove();
        }
      });
    });

  };

})();
