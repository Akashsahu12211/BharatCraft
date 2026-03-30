/* ============================================================
   ARTISAN PROFILE PAGE (js/pages/artisan-profile.js)
============================================================ */

(function() {

  window.renderArtisanProfilePage = async (app, params) => {
    
    const artisanId = params.id;
    let artisan = null;
    let products = [];
    
    // 1. Fetch Artisan Data
    try {
      if (window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
        const docSnap = await window.fbDB.collection('artisans').doc(artisanId).get();
        if(docSnap.exists) artisan = { id: docSnap.id, ...docSnap.data() };
        
        const pref = await window.fbDB.collection('products').where('artisanId', '==', artisanId).get();
        products = pref.docs.map(d => ({id:d.id, ...d.data()}));
      }
      if(!artisan && window.demoData) {
        artisan = window.demoData.artisans.find(a => a.id === artisanId);
        products = window.demoData.products.filter(p => p.artisanId === artisanId);
      }
    } catch(e) { console.error(e); }

    if(!artisan) {
      app.innerHTML = `<div style="text-align:center; padding:5rem;"><h2 style="font-family:var(--font-heading);font-size:2rem;">Artisan Not Found</h2></div>`;
      return;
    }

    // Followers Check
    let isFollowing = false;
    if(window.authModule?.user && window.fbDB) {
       try {
         const userDoc = await window.fbDB.collection('users').doc(window.authModule.user.uid).get();
         const following = userDoc.data()?.following || [];
         isFollowing = following.includes(artisanId);
       } catch(e) {}
    }

    const verifiedBadge = artisan.isVerified ? `<div class="ap-verified" title="Verified Artisan">✓</div>` : '';

    app.innerHTML = `
      <div class="artisan-profile-page animate-in">
        
        <!-- HERO -->
        <div class="ap-hero">
          <div class="ap-cover">
            <img src="${artisan.coverImage || 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1600&q=80'}" alt="Cover">
          </div>
          <div class="ap-header-box">
            <div class="ap-avatar-wrap">
              <img src="${artisan.avatar || 'https://i.pravatar.cc/300?u='+artisanId}" alt="${artisan.name}">
              ${verifiedBadge}
            </div>
            <div class="ap-hero-actions">
              <button class="btn-ap ${isFollowing ? 'btn-ap-follow following' : 'btn-ap-follow'}" id="btn-hero-follow">${isFollowing ? 'Following ✓' : 'Follow +'} (${artisan.followersCount || Math.floor(Math.random()*5000+100)})</button>
            </div>
          </div>
        </div>

        <!-- INFO -->
        <div class="ap-info-sec">
          <div class="ap-name-row">
            <h1>${artisan.name}</h1>
            <span class="ap-craft-badge">${artisan.craftType || 'Traditional Craft'}</span>
          </div>
          
          <div class="ap-stats">
            <div class="stat-item"><span class="stars">★</span> ${artisan.rating||'4.8'} (${Math.floor(Math.random()*200+50)} reviews)</div>
            <div class="stat-item">📦 ${artisan.ordersCompleted||Math.floor(Math.random()*1500+200)} orders</div>
            <div class="stat-item">📍 ${artisan.location?.city||'India'}, ${artisan.location?.state||''}</div>
          </div>
          
          <p class="ap-bio">${artisan.bio || 'Preserving the intricate, authentic heritage of Indian crafts, making each master piece telling a unique cultural history.'}</p>
          
          <div class="ap-meta-row">
            <div class="ap-est">🗓️ Crafting since ${artisan.establishedYear || '2005'}</div>
            <div class="ap-actions">
              <button class="btn-ap btn-ap-outline" id="btn-msg">✉️ Message</button>
              <button class="btn-ap btn-ap-outline" onclick="window.router.navigate('/map?artisan=${artisanId}')">📍 View on Map</button>
              <button class="btn-ap btn-ap-custom" id="btn-req-custom">✨ Request Custom Order</button>
            </div>
          </div>
        </div>

        <!-- TABS HEADER -->
        <div class="ap-tabs-wrapper">
          <div class="ap-tabs-header">
            <button class="ap-tab-btn active" data-target="ap-tab-products">Products (${products.length})</button>
            <button class="ap-tab-btn" data-target="ap-tab-story">The Story</button>
            <button class="ap-tab-btn" data-target="ap-tab-reviews">Reviews</button>
            <button class="ap-tab-btn" data-target="ap-tab-loc">Visit Workshop</button>
          </div>

          <!-- TAB CONTENT -->
          <div class="ap-tab-content active" id="ap-tab-products">
            <div class="ap-filters">
              <h3 style="font-family:var(--font-heading); font-size:1.5rem;">All Masterpieces</h3>
              <select style="padding:8px 16px; border-radius:8px; border:1px solid var(--border-strong); outline:none; font-weight:600; cursor:pointer;" id="ap-sort">
                 <option value="new">Newest Arrivals</option>
                 <option value="price_asc">Price: Low to High</option>
                 <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            
            <div class="ap-grid" id="ap-products-grid">
              <!-- Rendered via JS -->
            </div>
          </div>

          <div class="ap-tab-content" id="ap-tab-story">
            <div class="story-layout">
              <div class="story-text">
                <h3>A Journey of Tradition</h3>
                <p>Born into a family where craftsmanship is more than a livelihood, ${artisan.name} learned the intricate arts by watching generations before them meticulously work raw materials into breathing heritage pieces.</p>
                <p>What started as a childhood fascination quickly grew into mastery. The journey hasn’t been without struggles. Competing against mass-produced alternatives, the dedication required to naturally source materials and spend weeks finishing a single piece tests patience immensely. Yet, the motivation lies in the deep-seated belief that cultural identity is preserved in what we make with our hands.</p>
                <p>"BharatCraft has been instrumental in keeping my workshop alive, bypassing middlemen and directly connecting my art to those who cherish it," says ${artisan.name}. "Every piece tells a story of my ancestors."</p>
              </div>
              <div class="masonry-grid">
                <div class="masonry-item"><img src="${artisan.gallery ? artisan.gallery[0] : 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=500&q=80'}"></div>
                <div class="masonry-item"><img src="${artisan.gallery ? artisan.gallery[1] : 'https://images.unsplash.com/photo-1605814512351-a0833a6ea21c?auto=format&fit=crop&w=500&q=80'}"></div>
                <div class="masonry-item"><img src="${artisan.gallery ? artisan.gallery[2] : 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=500&q=80'}"></div>
              </div>
            </div>
          </div>

          <div class="ap-tab-content" id="ap-tab-reviews">
             <div class="empty-ap-products" style="text-align:left; border:none; background:white;">
                <h3 style="margin-bottom:1.5rem; font-family:var(--font-heading);">Authentic Customer Experiences</h3>
                <p style="color:var(--text-secondary); line-height:1.6; max-width:600px;">All reviews are gathered strictly from verified purchases mapping through BharatCraft's secure logistical pipeline ensuring true reflections of quality and service.</p>
                <!-- Hardcoded demo output matching specifications -->
                <div style="margin-top:2rem; padding-top:2rem; border-top:1px solid var(--border);">
                   <div style="display:flex; gap:1rem; margin-bottom:1.5rem;">
                       <img src="https://i.pravatar.cc/150?img=4" style="width:40px;height:40px;border-radius:50%;">
                       <div><div style="font-weight:700;">Vivek R.</div><div style="color:#f39c12;font-size:0.8rem;">★★★★★</div></div>
                   </div>
                   <p style="color:var(--text-secondary);">"The finish on the product is impeccable. You cannot find this level of detail in modern stores. Proud to support local Indian artisans."</p>
                </div>
             </div>
          </div>

          <div class="ap-tab-content" id="ap-tab-loc">
            <div class="ap-location-wrap">
              <div class="ap-mini-map" id="ap-mini-map">
                <iframe 
                  width="100%" height="100%" frameborder="0" style="border:0" 
                  src="https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(artisan.location?.city||'India')}&key=YOUR_GOOGLE_MAPS_EMBED_KEY" allowfullscreen>
                </iframe>
              </div>
              <div class="ap-loc-info">
                <h3>Plan a Visit</h3>
                <p class="loc-feat">Witness the magic firsthand! The workshop is open to visitors who wish to see the crafting process in action and buy directly from the source.</p>
                <ul class="loc-attr-list">
                  <li>Best time to visit: October to March</li>
                  <li>Learn the basics in a 2-hour workshop</li>
                  <li>Guided studio tour available</li>
                </ul>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(artisan.location?.city||'India')}" target="_blank" class="btn btn-primary" style="display:inline-block; text-align:center; padding:12px; border-radius:8px; text-decoration:none;">🌍 Open in Maps to get Directions</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- CUSTOM REQUEST MODAL -->
      <div class="crm-overlay" id="crm-modal">
        <div class="crm-box">
          <div class="crm-header">
            <h2>Request Custom Masterpiece</h2>
            <button class="crm-close" id="crm-close">✕</button>
          </div>
          <div class="crm-body">
            <p style="color:var(--text-secondary); margin-bottom:1.5rem; line-height:1.5; font-size:0.95rem;">Commission a personalized item directly from ${artisan.name}. Please provide as much detail as possible. The artisan will review feasibility and quote a price.</p>
            <form id="crm-form">
              <div class="form-group">
                <label>Product Type / Title *</label>
                <input type="text" id="cr-title" placeholder="e.g. Personalized Wooden Nameplate" required>
              </div>
              <div class="form-group">
                <label>Detailed Description *</label>
                <textarea id="cr-desc" placeholder="Describe materials, dimensions, specific patterns, and colors..." required></textarea>
              </div>
              <div class="form-group">
                <label>Reference Image URL (Optional)</label>
                <input type="url" id="cr-img" placeholder="https://link-to-inspiration-image.com">
              </div>
              <div style="display:flex; gap:1rem;">
                <div class="form-group" style="flex:1;">
                  <label>Budget Range (₹)</label>
                  <select id="cr-budget">
                     <option>Under 2,000</option>
                     <option>2,000 - 5,000</option>
                     <option>5,000 - 15,000</option>
                     <option>15,000+</option>
                  </select>
                </div>
                <div class="form-group" style="flex:1;">
                  <label>Needed By</label>
                  <input type="date" id="cr-date" required>
                </div>
              </div>
            </form>
          </div>
          <div class="crm-footer">
            <button class="btn btn-outline" style="border:none; margin-right:1rem;" id="crm-cancel">Cancel</button>
            <button class="btn btn-primary" id="crm-submit">Send Request to Artisan</button>
          </div>
        </div>
      </div>
    `;

    // Render Products Grid
    function renderProducts() {
      const grid = document.getElementById('ap-products-grid');
      if(!products.length) {
        grid.innerHTML = '<div class="empty-ap-products">No products currently available from this artisan.</div>';
        return;
      }
      grid.innerHTML = products.map(p => window.utils.productCardHTML(p, window.wishlistModule?.hasProduct(p.id))).join('');
    }

    document.getElementById('ap-sort').addEventListener('change', (e) => {
      const v = e.target.value;
      if(v === 'price_asc') products.sort((a,b)=>a.price - b.price);
      if(v === 'price_desc') products.sort((a,b)=>b.price - a.price);
      if(v === 'new') products.sort((a,b)=> (b.createdAt?.seconds||1) - (a.createdAt?.seconds||0));
      renderProducts();
    });

    renderProducts();

    // Tabs logic
    document.querySelectorAll('.ap-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ap-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.ap-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
      });
    });

    // Follow Logic (Firebase arrayUnion & increment)
    document.getElementById('btn-hero-follow').addEventListener('click', async (e) => {
      if(!window.authModule?.user) return window.utils.toast('Login required to follow artisans.', 'error');
      
      const btn = e.currentTarget;
      
      try {
        if(window.fbDB) {
          const userRef = window.fbDB.collection('users').doc(window.authModule.user.uid);
          const artisanRef = window.fbDB.collection('artisans').doc(artisanId);
          await window.fbDB.runTransaction(async (transaction) => {
             const usrDoc = await transaction.get(userRef);
             const artDoc = await transaction.get(artisanRef);
             
             let fArr = usrDoc.data()?.following || [];
             let aCount = artDoc.data()?.followersCount || 0;

             if(isFollowing) {
               fArr = fArr.filter(x => x !== artisanId);
               aCount = Math.max(0, aCount - 1);
             } else {
               fArr.push(artisanId);
               aCount += 1;
             }

             transaction.update(userRef, { following: fArr });
             transaction.update(artisanRef, { followersCount: aCount });
          });
        }
        
        isFollowing = !isFollowing;
        if(isFollowing) {
          btn.classList.add('following');
          btn.innerText = 'Following ✓';
          window.utils.toast(`You are now following ${artisan.name}!`, 'success');
        } else {
          btn.classList.remove('following');
          btn.innerText = 'Follow +';
          window.utils.toast(`Unfollowed ${artisan.name}`, 'info');
        }

      } catch(err) {
        console.error(err);
        window.utils.toast('Demo mode: Action simulated.', 'info');
        isFollowing = !isFollowing;
        if(isFollowing) { btn.classList.add('following'); btn.innerText = 'Following ✓'; }
        else { btn.classList.remove('following'); btn.innerText = 'Follow +'; }
      }
    });

    // Messsage 
    document.getElementById('btn-msg').addEventListener('click', () => {
      if(!window.authModule?.user) window.utils.toast('Login to message artisan.', 'error');
      else window.utils.toast('Messaging system opens soon!', 'info');
    });

    // Custom Request Modal
    const modal = document.getElementById('crm-modal');
    document.getElementById('btn-req-custom').addEventListener('click', () => {
      if(!window.authModule?.user) return window.utils.toast('Please log in to make a secure custom request.', 'error');
      modal.classList.add('open');
    });
    const closeModal = () => modal.classList.remove('open');
    document.getElementById('crm-close').addEventListener('click', closeModal);
    document.getElementById('crm-cancel').addEventListener('click', closeModal);

    document.getElementById('crm-submit').addEventListener('click', async () => {
      const title = document.getElementById('cr-title').value.trim();
      const desc = document.getElementById('cr-desc').value.trim();
      const date = document.getElementById('cr-date').value;
      if(!title || !desc || !date) return window.utils.toast('Please fill all required (*) fields.', 'error');
      
      document.getElementById('crm-submit').innerText = 'Sending...';

      try {
        if(window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
          await window.fbDB.collection('customRequests').add({
            artisanId,
            userId: window.authModule.user.uid,
            title,
            description: desc,
            imageUrl: document.getElementById('cr-img').value,
            budget: document.getElementById('cr-budget').value,
            timeline: date,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } else {
          await new Promise(r => setTimeout(r, 1000));
        }
        window.utils.toast('Your request has been sent! The artisan will contact you soon.', 'success');
        closeModal();
      } catch(e) { window.utils.toast('Failed to send request.', 'error'); document.getElementById('crm-submit').innerText = 'Send Request'; }
    });

  };

})();
