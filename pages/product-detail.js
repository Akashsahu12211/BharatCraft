/* ============================================================
   PRODUCT DETAIL PAGE (js/pages/product-detail.js)
============================================================ */

(function() {

  window.renderProductDetailPage = async (app, params) => {
    const productId = params.id;
    let product = null;

    // 1. Fetch Data
    try {
      if (window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
        const docRef = await window.fbDB.collection('products').doc(productId).get();
        if (docRef.exists) {
          product = { id: docRef.id, ...docRef.data() };
        }
      }
      if (!product && window.demoData) {
        product = window.demoData.products.find(p => p.id === productId);
      }
    } catch(e) { console.error("Error fetching product:", e); }

    if (!product) {
      app.innerHTML = `<div class="product-detail-page"><div class="empty-products" style="text-align:center; padding:5rem;"><h2 style="font-family:var(--font-heading);font-size:3rem;margin-bottom:1rem;">Product Not Found</h2><p style="color:var(--text-secondary);margin-bottom:2rem;">The item you are looking for does not exist or has been removed.</p><a href="#/products" class="btn btn-primary">Browse All</a></div></div>`;
      return;
    }

    // Default Images Setup 
    let images = product.images || [];
    if (images.length === 0) images = ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80'];
    while (images.length < 4) { images.push(`https://picsum.photos/seed/${product.id}${images.length}/800/600`); } // Fill for UI demo

    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const isWishlisted = window.wishlistModule?.hasProduct(product.id) || false;
    let stockStatus = product.stock > 0 ? (product.stock < 10 ? `<span class="pd-stock low">⚠️ Only ${product.stock} left in stock!</span>` : `<span class="pd-stock instock">✓ In Stock</span>`) : `<span class="pd-stock low">Out of Stock</span>`;

    // 2. Main HTML Render
    app.innerHTML = `
      <div class="product-detail-page animate-in">
        
        <!-- Breadcrumb -->
        <div class="pd-breadcrumb">
          <a href="#/">Home</a> &gt; 
          <a href="#/products?category=${encodeURIComponent(product.category || 'All')}">${product.category || 'Crafts'}</a> &gt; 
          <span style="color:var(--text-primary); font-weight:600;">${product.name}</span>
        </div>

        <div class="pd-main">
          <!-- LEFT: Gallery -->
          <div class="pd-gallery">
            <button class="pd-share" id="btn-share" title="Share via link"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
            <div class="main-img-wrap" id="main-img-wrap">
              <img src="${images[0]}" alt="${product.name}" id="main-img">
            </div>
            <div class="thumb-strip" id="thumb-strip">
              ${images.map((img, i) => `
                <div class="thumb-wrap ${i===0?'active':''}" data-idx="${i}">
                  <img src="${img}" alt="Thumbnail">
                </div>
              `).join('')}
            </div>
          </div>

          <!-- RIGHT: Info -->
          <div class="pd-info">
            <div class="pd-badges">
              ${product.isHandmade ? '<span class="pd-badge handmade">Handmade</span>' : ''}
              <span class="pd-badge cat">${product.category || 'Craft'}</span>
            </div>
            <h1 class="pd-title">${product.name}</h1>
            
            <div class="pd-rating-row">
              <span class="stars">${window.utils.generateStars(product.rating || 0)}</span>
              <span style="font-weight:600; color:var(--text-primary);">${parseFloat(product.rating||0).toFixed(1)}</span>
              <a href="#reviews" id="scroll-to-reviews">(${product.reviewCount || 0} reviews)</a>
            </div>

            <div class="pd-price-row">
              <span class="pd-price">${window.utils.formatCurrency(product.price)}</span>
              ${product.originalPrice ? `<span class="pd-orig-price">${window.utils.formatCurrency(product.originalPrice)}</span>` : ''}
              ${discount > 0 ? `<span class="pd-discount">Save ${discount}%</span>` : ''}
            </div>

            <p class="pd-desc">${product.description || 'Experience the authenticity of true Indian craftsmanship. This beautifully hand-finished piece brings heritage directly into your lifestyle.'}</p>
            
            ${stockStatus}

            <div class="pd-qty-actions">
              <div class="qty-selector">
                <button class="qty-btn" id="qty-minus">−</button>
                <input type="number" class="qty-input" id="qty-input" value="1" min="1" max="${product.stock || 50}" readonly>
                <button class="qty-btn" id="qty-plus">+</button>
              </div>
              <div class="pd-buttons">
                <button class="btn btn-primary btn-pd-add" id="btn-add-cart">Add to Cart</button>
                <button class="btn-pd-buy" id="btn-buy-now">Buy Now</button>
                <button class="btn-pd-wish ${isWishlisted?'active':''}" id="btn-pd-wish" title="Toggle Wishlist">${isWishlisted?'❤️':'🤍'}</button>
              </div>
            </div>

            <!-- Artisan Mini Card -->
            <div class="artisan-mini">
              <div class="am-top">
                <img src="${product.artisanAvatar || 'https://i.pravatar.cc/150?u='+product.artisanId}" alt="${product.artisanName||'Artisan'}" class="am-avatar">
                <div class="am-info">
                  <h4>${product.artisanName || 'BharatCraft Master Artisan'}</h4>
                  <p>${product.craftType || 'Traditional Crafts'} • ${product.artisanState || 'India'}</p>
                </div>
              </div>
              <div class="am-actions">
                <button class="am-btn" onclick="window.router.navigate('/artisan/${product.artisanId}')">View Profile</button>
                <button class="am-btn" onclick="window.router.navigate('/map?artisan=${product.artisanId}')">📍 Visit Artisan</button>
                <button class="am-btn" onclick="window.utils.toast('Custom request portal opening soon!', 'info')">✉️ Custom Request</button>
              </div>
            </div>

            <div class="pd-delivery">
              <div class="del-item"><span class="del-icon">🚚</span> Free delivery above ₹999 across India.</div>
              <div class="del-item"><span class="del-icon">📦</span> Estimated arrival: 5-7 business days.</div>
              <div class="del-item"><span class="del-icon">↩️</span> 7-day easy return policy for damaged items.</div>
            </div>
          </div>
        </div>

        <!-- TABS -->
        <div class="pd-tabs-container" id="tabs-section">
          <div class="tabs-header">
            <button class="tab-btn active" data-target="tab-story">Cultural Story</button>
            <button class="tab-btn" data-target="tab-specs">Product Details</button>
            <button class="tab-btn" data-target="tab-reviews" id="reviews">Customer Reviews (${product.reviewCount||0})</button>
          </div>
          
          <div class="tab-content active" id="tab-story">
            <div class="story-content">
              <h3>The Heritage Behind This Piece</h3>
              <p>Every crafted item on BharatCraft carries centuries of history. This tradition, passed down through generations, represents the enduring spirit and creativity of the regional artisans. ${product.description}</p>
              <img src="${images[1] || images[0]}" class="story-img" alt="Craft Process">
              <div class="did-you-know">
                <h4><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a9 9 0 00-6.14 15.54c.73.66 1.14 1.58 1.14 2.46v1A2 2 0 009 23h6a2 2 0 002-2v-1c0-.88.41-1.8 1.14-2.46A9 9 0 0012 2zm1 18h-2v-1h2v1zm2.36-4.22c-.22.2-.42.45-.58.72H9.22c-.16-.27-.36-.52-.58-.72A7 7 0 1115.36 15.78z"></path></svg> Did You Know?</h4>
                <p>Purchasing this handmade artifact directly empowers the artisan community in ${product.artisanState || 'India'}, skipping intermediaries and ensuring fair wages while keeping indigenous art forms alive on the global stage.</p>
              </div>
            </div>
          </div>

          <div class="tab-content" id="tab-specs">
            <table class="specs-table">
              <tr><td>Material</td><td>${product.material || 'Traditional Organic Materials'}</td></tr>
              <tr><td>Dimensions</td><td>${product.dimensions || 'Standard Size'}</td></tr>
              <tr><td>Weight</td><td>${product.weight || 'Varied (Handmade)'}</td></tr>
              <tr><td>Care Instructions</td><td>${product.care || 'Wipe with soft, dry cloth. Keep away from direct moisture.'}</td></tr>
              <tr><td>Origin</td><td>${product.artisanState || 'India'}</td></tr>
              <tr><td>Artisan ID</td><td>${product.artisanId || 'Verified Member'}</td></tr>
            </table>
          </div>

          <div class="tab-content" id="tab-reviews">
            <div class="reviews-layout">
              <div class="reviews-summary">
                <div class="rs-big">
                  <div class="rs-num">${parseFloat(product.rating||0).toFixed(1)}</div>
                  <div class="rs-right">
                    <div class="rs-stars">${window.utils.generateStars(product.rating||0)}</div>
                    <div class="rs-count">Based on ${product.reviewCount||0} reviews</div>
                  </div>
                </div>
                <div class="bar-chart">
                  <div class="bar-row"><span>5★</span><div class="bar-bg"><div class="bar-fill" style="width:75%"></div></div><span>75%</span></div>
                  <div class="bar-row"><span>4★</span><div class="bar-bg"><div class="bar-fill" style="width:15%"></div></div><span>15%</span></div>
                  <div class="bar-row"><span>3★</span><div class="bar-bg"><div class="bar-fill" style="width:7%"></div></div><span>7%</span></div>
                  <div class="bar-row"><span>2★</span><div class="bar-bg"><div class="bar-fill" style="width:2%"></div></div><span>2%</span></div>
                  <div class="bar-row"><span>1★</span><div class="bar-bg"><div class="bar-fill" style="width:1%"></div></div><span>1%</span></div>
                </div>
              </div>
              <div class="reviews-list">
                <div class="write-review-box">
                  <h4>Write a Review</h4>
                  <div class="star-selector" id="star-selector">
                    <span data-val="1">★</span><span data-val="2">★</span><span data-val="3">★</span><span data-val="4">★</span><span data-val="5">★</span>
                  </div>
                  <textarea class="review-textarea" placeholder="Share your experience with this beautiful handcrafted piece..." id="review-text"></textarea>
                  <button class="btn btn-primary" id="btn-submit-review" style="padding:1rem 2.5rem; border-radius:30px;">Submit Review</button>
                </div>
                <!-- Hardcoded Reviews for Demo -->
                <div class="review-card">
                  <div class="rc-top">
                    <div class="rc-user">
                      <img src="https://i.pravatar.cc/150?img=32" alt="User">
                      <div><div class="rc-name">Anjali Deshmukh</div><div class="rc-date">October 12, 2025</div></div>
                    </div>
                  </div>
                  <div class="rc-stars">★★★★★</div>
                  <div class="rc-text">Absolutely in love with the craftsmanship. The intricate details show the level of dedication and years of practice. It arrived safely packaged and exactly as advertised!</div>
                  <button class="rc-helpful">👍 Helpful (12)</button>
                </div>
                <div class="review-card">
                  <div class="rc-top">
                    <div class="rc-user">
                      <img src="https://i.pravatar.cc/150?img=11" alt="User">
                      <div><div class="rc-name">Rohan Gupta</div><div class="rc-date">September 29, 2025</div></div>
                    </div>
                  </div>
                  <div class="rc-stars">★★★★★</div>
                  <div class="rc-text">You can feel the authenticity. Great value for something completely handmade. Makes for an amazing living room centerpiece.</div>
                  <button class="rc-helpful">👍 Helpful (4)</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RELATED PRODUCTS -->
        <div class="related-section">
          <h2>You Might Also Like</h2>
          <div class="related-grid" id="related-grid">
            <div class="skel-card"><div class="skel-img"></div><div class="skel-body"><div class="skel-line w-75"></div></div></div>
            <div class="skel-card"><div class="skel-img"></div><div class="skel-body"><div class="skel-line w-75"></div></div></div>
            <div class="skel-card"><div class="skel-img"></div><div class="skel-body"><div class="skel-line w-75"></div></div></div>
            <div class="skel-card"><div class="skel-img"></div><div class="skel-body"><div class="skel-line w-75"></div></div></div>
          </div>
        </div>

      </div>

      <!-- Fullscreen Lightbox Overlay -->
      <div class="lightbox-overlay" id="lightbox">
        <button class="lightbox-close" id="lb-close">×</button>
        <button class="lightbox-arrow lb-prev" id="lb-prev">‹</button>
        <img src="" class="lightbox-img" id="lb-img" alt="Fullscreen Product">
        <button class="lightbox-arrow lb-next" id="lb-next">›</button>
      </div>
    `;

    // 3. Interactions Binding

    // Main Image Zoom Logic
    const mainWrap = document.getElementById('main-img-wrap');
    const mainImg = document.getElementById('main-img');
    mainWrap.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = mainWrap.getBoundingClientRect();
      const x = (e.clientX - left) / width * 100;
      const y = (e.clientY - top) / height * 100;
      mainImg.style.transformOrigin = `${x}% ${y}%`;
      mainImg.style.transform = 'scale(2)';
    });
    mainWrap.addEventListener('mouseleave', () => {
      mainImg.style.transformOrigin = 'center';
      mainImg.style.transform = 'scale(1)';
    });

    // Thumbnails Logic
    let currentImgIdx = 0;
    const thumbs = document.querySelectorAll('.thumb-wrap');
    thumbs.forEach(t => {
      t.addEventListener('click', (e) => {
        thumbs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        currentImgIdx = parseInt(t.dataset.idx);
        mainImg.src = images[currentImgIdx];
      });
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    mainWrap.addEventListener('click', () => {
      lbImg.src = images[currentImgIdx];
      lightbox.classList.add('open');
    });
    document.getElementById('lb-close').addEventListener('click', () => lightbox.classList.remove('open'));
    document.getElementById('lb-prev').addEventListener('click', () => {
      currentImgIdx = (currentImgIdx - 1 + images.length) % images.length;
      lbImg.src = images[currentImgIdx];
      thumbs.forEach((x,i) => x.classList.toggle('active', i===currentImgIdx));
      mainImg.src = images[currentImgIdx];
    });
    document.getElementById('lb-next').addEventListener('click', () => {
      currentImgIdx = (currentImgIdx + 1) % images.length;
      lbImg.src = images[currentImgIdx];
      thumbs.forEach((x,i) => x.classList.toggle('active', i===currentImgIdx));
      mainImg.src = images[currentImgIdx];
    });

    // Share link
    document.getElementById('btn-share').addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      window.utils.toast('Link copied to clipboard!', 'success');
    });

    // Quantity Selector
    const qtyInput = document.getElementById('qty-input');
    const maxStock = product.stock || 50;
    document.getElementById('qty-minus').addEventListener('click', () => {
      let v = parseInt(qtyInput.value); if(v > 1) qtyInput.value = v - 1;
    });
    document.getElementById('qty-plus').addEventListener('click', () => {
      let v = parseInt(qtyInput.value); if(v < maxStock) qtyInput.value = v + 1;
    });

    // Cart Logic
    function handleAddToCart(buyNow = false) {
      const q = parseInt(qtyInput.value);
      // We push manually to window.cartModule if it exists, otherwise to local storage directly.
      const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        artisanName: product.artisanName || 'Artisan',
        quantity: q
      };
      
      // Merge with cart flow
      if(window.cartModule && window.cartModule.addToCart) {
        // If the module expects a product and pushes 1, we overwrite quantity logic or loop
        // It's safer to read and write directly to localStorage for exact batch amounts, then update Navbar
        let cart = JSON.parse(localStorage.getItem('bharatcraft_cart') || '[]');
        const existing = cart.find(x => x.id === product.id);
        if(existing) existing.quantity += q;
        else cart.push(item);
        localStorage.setItem('bharatcraft_cart', JSON.stringify(cart));
        window.utils.updateCartCount(); // Relying on the global utils helper
      } else {
        // Fallback
        let cart = JSON.parse(localStorage.getItem('bharatcraft_cart') || '[]');
        const existing = cart.find(x => x.id === product.id);
        if(existing) existing.quantity += q;
        else cart.push(item);
        localStorage.setItem('bharatcraft_cart', JSON.stringify(cart));
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const navEl = document.getElementById('nav-cart-count');
        if(navEl) { navEl.innerText = count; navEl.style.display = 'flex'; }
      }

      const btn = document.getElementById('btn-add-cart');
      btn.innerText = '✔ Added to Cart';
      btn.style.background = '#2ECC71';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerText = 'Add to Cart';
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);

      if(!buyNow) window.utils.toast(`Added ${q} to cart!`, 'success');
      if(buyNow) window.router.navigate('/cart');
    }

    document.getElementById('btn-add-cart').addEventListener('click', () => handleAddToCart(false));
    document.getElementById('btn-buy-now').addEventListener('click', () => handleAddToCart(true));

    // Wishlist Toggle
    document.getElementById('btn-pd-wish').addEventListener('click', (e) => {
      if(window.wishlistModule) {
        window.wishlistModule.toggle(product.id, e.currentTarget);
        e.currentTarget.innerText = e.currentTarget.classList.contains('active') ? '❤️' : '🤍';
      }
    });

    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
      });
    });

    // Reviews Interactive Rating Form
    let selectedRating = 0;
    const stars = document.querySelectorAll('#star-selector span');
    stars.forEach(s => {
      s.addEventListener('mouseover', () => {
        const val = parseInt(s.dataset.val);
        stars.forEach(st => st.classList.toggle('hover', parseInt(st.dataset.val) <= val));
      });
      s.addEventListener('mouseout', () => {
        stars.forEach(st => st.classList.remove('hover'));
      });
      s.addEventListener('click', () => {
        selectedRating = parseInt(s.dataset.val);
        stars.forEach(st => st.classList.toggle('active', parseInt(st.dataset.val) <= selectedRating));
      });
    });
    document.getElementById('btn-submit-review').addEventListener('click', () => {
      const text = document.getElementById('review-text').value;
      if(selectedRating === 0) return window.utils.toast('Please select a star rating.', 'error');
      if(text.trim().length <= 5) return window.utils.toast('Review text too short.', 'error');
      
      // Mock Submission
      document.getElementById('btn-submit-review').innerText = 'Submitting...';
      document.getElementById('btn-submit-review').disabled = true;
      setTimeout(() => {
        window.utils.toast('Thank you! Review published.', 'success');
        document.getElementById('review-text').value = '';
        selectedRating = 0;
        stars.forEach(st => st.classList.remove('active', 'hover'));
        document.getElementById('btn-submit-review').innerText = 'Submit Review';
        document.getElementById('btn-submit-review').disabled = false;
      }, 1000);
    });

    // Fetch Related Products (same category)
    async function initRelated() {
      try {
        let rel = [];
        if (window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
           const snap = await window.fbDB.collection('products').where('category','==',product.category).limit(5).get();
           rel = snap.docs.map(d => ({id:d.id, ...d.data()})).filter(x => x.id !== product.id).slice(0,4);
        }
        if(!rel.length && window.demoData) {
           rel = window.demoData.products.filter(p => p.category === product.category && p.id !== product.id).slice(0,4);
        }
        if(!rel.length && window.demoData) {
           rel = window.demoData.products.slice(0,4); // absolute fallback
        }
        document.getElementById('related-grid').innerHTML = rel.map(p => window.utils.productCardHTML(p, window.wishlistModule?.hasProduct(p.id))).join('');
      } catch(e){
        document.getElementById('related-grid').innerHTML = '<p class="text-muted">Unable to load related items.</p>';
      }
    }
    initRelated();

  };
})();
