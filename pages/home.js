// ============================================================
//  BHARATCRAFT - PREMIUM HOME PAGE
// ============================================================
(function() {
  const HERO_SLIDES = [
    { img: 'https://images.unsplash.com/photo-1490216717540-02c3bbbe6d5b?auto=format&fit=crop&w=1600&q=80', label: 'Rajasthani Pottery' },
    { img: 'https://images.unsplash.com/photo-1582560475093-ba66cefeca8e?auto=format&fit=crop&w=1600&q=80', label: 'Madhubani Painting' },
    { img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1600&q=80', label: 'Kashmir Shawls' },
    { img: 'https://images.unsplash.com/photo-1610398642234-bc2c6767702e?auto=format&fit=crop&w=1600&q=80', label: 'Dhokra Metal' },
    { img: 'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=1600&q=80', label: 'Warli Art' }
  ];

  const CATEGORIES = [
    { name: 'Pottery', icon: '🏺', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=200&q=80' },
    { name: 'Textiles', icon: '🧵', img: 'https://images.unsplash.com/photo-1584985223019-2144d03d3c8c?auto=format&fit=crop&w=200&q=80' },
    { name: 'Paintings', icon: '🖼️', img: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=200&q=80' },
    { name: 'Jewelry', icon: '💎', img: 'https://images.unsplash.com/photo-1599643478514-4a4be5a43b27?auto=format&fit=crop&w=200&q=80' },
    { name: 'Woodcraft', icon: '🪵', img: 'https://images.unsplash.com/photo-1611077544520-a04005b610fa?auto=format&fit=crop&w=200&q=80' },
    { name: 'Metalwork', icon: '⚒️', img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=200&q=80' },
    { name: 'Leather', icon: '👜', img: 'https://images.unsplash.com/photo-1593014168571-0c5a08db142a?auto=format&fit=crop&w=200&q=80' },
    { name: 'Toys', icon: '🪀', img: 'https://images.unsplash.com/photo-1558021149-61fc37f19119?auto=format&fit=crop&w=200&q=80' }
  ];

  const REGIONS = [
    { name: 'Rajasthan', count: 1200, img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kashmir', count: 450, img: 'https://images.unsplash.com/photo-1566838814772-8f94f923ce3e?auto=format&fit=crop&w=600&q=80' },
    { name: 'West Bengal', count: 890, img: 'https://images.unsplash.com/photo-1582239459039-bdf8e98ec76c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Gujarat', count: 760, img: 'https://images.unsplash.com/photo-1590050752117-238cb00ddaac?auto=format&fit=crop&w=600&q=80' },
    { name: 'Tamil Nadu', count: 540, img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' },
    { name: 'Odisha', count: 320, img: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&w=600&q=80' }
  ];

  const TESTIMONIALS = [
    { name: 'Priya Sharma', loc: 'Delhi', quote: '"The pure Pashmina shawl I ordered is breathtaking. Knowing exactly which artisan family made it adds so much incredible soul to the piece."', img: 'https://i.pravatar.cc/150?img=5', stars: '★★★★★' },
    { name: 'Arjun Menon', loc: 'Bangalore', quote: '"BharatCraft is doing incredible work preserving our heritage. The Channapatna toys I got for my niece are safe, vibrant, and beautifully crafted."', img: 'https://i.pravatar.cc/150?img=11', stars: '★★★★★' },
    { name: 'Sarah Jenkins', loc: 'London, UK', quote: '"Shipping was surprisingly fast! The Madhubani painting arrived internationally in perfect condition. A tiny piece of India in my living room."', img: 'https://i.pravatar.cc/150?img=47', stars: '★★★★☆' }
  ];

  function skelProducts() {
    return Array(4).fill(0).map(() => `
      <div class="skel-card">
        <div class="skel-img"></div>
        <div class="skel-body">
          <div class="skel-line w-50"></div>
          <div class="skel-line w-75"></div>
          <div class="skel-line w-50" style="margin-top:20px;"></div>
        </div>
      </div>
    `).join('');
  }

  function skelArtisans() {
    return Array(3).fill(0).map(() => `
      <div class="skel-card">
        <div class="skel-img" style="height:140px;"></div>
        <div class="skel-body" style="text-align:center; padding-top:40px;">
          <div class="skel-line w-50" style="margin:0 auto 10px;"></div>
          <div class="skel-line w-75" style="margin:0 auto;"></div>
        </div>
      </div>
    `).join('');
  }

  window.renderHomePage = async (app) => {
    // Render initial structure immediately (Skeleton First + Static UI)
    app.innerHTML = `
      <!-- 1. HERO SECTION -->
      <section class="hero-slider" id="hero-slider">
        ${HERO_SLIDES.map((s,i) => `
          <div class="slide ${i===0?'active':''}" style="background-image: url('${s.img}')"></div>
        `).join('')}
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-tag">🇮🇳 Celebrating Indian Heritage</div>
          <h1 class="hero-title">Discover the Soul of India's Craft</h1>
          <p class="hero-subtitle">Shop directly from 5,000+ artisans across 28 states.</p>
          <div class="hero-actions">
            <a href="#/products" class="btn btn-primary" style="padding:0.8rem 2.5rem; font-size:1rem; border-radius:30px;">Explore Products</a>
            <a href="#/map" class="btn-outline-white">Meet Artisans</a>
          </div>
        </div>
        <div class="slider-dots">
          ${HERO_SLIDES.map((s,i) => `<div class="dot ${i===0?'active':''}" data-idx="${i}"></div>`).join('')}
        </div>
        <div class="hero-stats-bar">
          <div class="stat-item"><span class="stat-icon">👩‍🎨</span><div class="stat-text"><span class="stat-val">5,000+</span><span class="stat-label">Artisans</span></div></div>
          <div class="stat-item"><span class="stat-icon">🗺️</span><div class="stat-text"><span class="stat-val">28</span><span class="stat-label">States</span></div></div>
          <div class="stat-item"><span class="stat-icon">🏺</span><div class="stat-text"><span class="stat-val">10,000+</span><span class="stat-label">Products</span></div></div>
          <div class="stat-item"><span class="stat-icon">😊</span><div class="stat-text"><span class="stat-val">50,000+</span><span class="stat-label">Happy Customers</span></div></div>
        </div>
      </section>

      <!-- 2. CATEGORY STRIP -->
      <section class="animate-on-scroll">
        <div class="category-scroller">
          ${CATEGORIES.map(c => `
            <a href="#/products?category=${encodeURIComponent(c.name)}" class="category-circle">
              <div class="cat-img-wrap"><img src="${c.img}" alt="${c.name}" loading="lazy"></div>
              <span>${c.name}</span>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- 3. FEATURED PRODUCTS -->
      <section class="products-wrapper">
        <div class="section-title-wrap animate-on-scroll">
          <h2 class="section-title">Handpicked for You</h2>
          <div class="title-divider"></div>
        </div>
        <div class="product-grid animate-on-scroll" id="featured-grid">
          ${skelProducts()}
        </div>
        <div class="text-center animate-on-scroll" style="margin-top: 3rem;">
          <a href="#/products" class="btn btn-outline">View All Products →</a>
        </div>
      </section>

      <!-- 4. ARTISAN SPOTLIGHT -->
      <section class="artisan-section">
        <div class="section-title-wrap animate-on-scroll">
          <h2 class="section-title">The Hands Behind the Magic</h2>
          <div class="title-divider"></div>
        </div>
        <div class="artisan-grid animate-on-scroll" id="spotlight-grid">
          ${skelArtisans()}
        </div>
      </section>

      <!-- 5. CULTURAL MAP TEASER -->
      <section class="map-teaser animate-on-scroll">
        <div class="map-svg-bg"></div>
        <div class="pulse-dot-container">
          <div class="pulse-dot" style="top:30%; left:35%;"></div>
          <div class="pulse-dot" style="top:45%; left:65%;"></div>
          <div class="pulse-dot" style="top:75%; left:45%;"></div>
          <div class="pulse-dot" style="top:55%; left:25%;"></div>
        </div>
        <div class="map-content animate-on-scroll">
          <h2>Explore Artisans Across India</h2>
          <p>From the mountains of Kashmir to the beaches of Kerala, discover unique regional crafts tied directly to their glorious geographical roots.</p>
          <a href="#/map" class="btn btn-primary" style="padding:1rem 3rem; border-radius:30px; font-size:1.1rem; box-shadow:0 10px 20px rgba(200,75,49,0.3);">Open Interactive Map</a>
        </div>
      </section>

      <!-- 6. TRENDING REGIONS -->
      <section class="regions-section">
        <div class="section-title-wrap animate-on-scroll">
          <h2 class="section-title">Trending Regions</h2>
          <div class="title-divider"></div>
        </div>
        <div class="regions-grid animate-on-scroll">
          ${REGIONS.map(r => `
            <div class="r-card" onclick="window.router.navigate('/products?location=${encodeURIComponent(r.name)}')">
              <img src="${r.img}" alt="${r.name}" loading="lazy">
              <div class="r-overlay">
                <div class="r-name">${r.name}</div>
                <div class="r-count">${r.count} crafts available</div>
                <button class="r-btn">Explore →</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 7. CUSTOM ORDER CTA -->
      <section class="custom-order-banner animate-on-scroll">
        <h2>Have something specific in mind?</h2>
        <p>Request a custom piece directly from artisans, made just exactly as you envision it.</p>
        <button class="btn-white-solid" onclick="window.utils.toast('Custom Requests rolling out soon!', 'info')">Make a Custom Request</button>
      </section>

      <!-- 8. TESTIMONIALS -->
      <section class="testimonials">
        <div class="section-title-wrap animate-on-scroll">
          <h2 class="section-title">Voices of Our Community</h2>
          <div class="title-divider"></div>
        </div>
        <div class="testi-grid animate-on-scroll">
          ${TESTIMONIALS.map(t => `
            <div class="testi-card">
              <div class="testi-stars">${t.stars}</div>
              <div class="testi-quote">${t.quote}</div>
              <div class="testi-user">
                <img src="${t.img}" alt="${t.name}" loading="lazy">
                <div>
                  <div class="testi-name">${t.name}</div>
                  <div class="testi-loc">${t.loc}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    // ── SLIDESHOW LOGIC ──────────────────────────────────────
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    function showSlide(idx) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = idx;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }
    
    let slideInterval = setInterval(() => {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }, 4000);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(i);
        slideInterval = setInterval(() => showSlide((currentSlide + 1) % slides.length), 4000);
      });
    });

    // ── SCROLL ANIMATIONS (Intersection Observer) ─────────────
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate exactly once
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // ── FETCH FIRESTORE DATA ──────────────────────────────────
    async function fetchHomeData() {
      // Products
      try {
        let pDocs = [];
        if (window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
          // Attempt where query, fallback to limit if indexes fail
          try {
            const snap = await window.fbDB.collection('products').where('isFeatured','==',true).limit(8).get();
            pDocs = snap.docs;
            if(pDocs.length === 0) throw new Error('Empty');
          } catch(e) {
            const snap = await window.fbDB.collection('products').limit(8).get();
            pDocs = snap.docs;
          }
          const products = pDocs.map(d => ({id: d.id, ...d.data()}));
          document.getElementById('featured-grid').innerHTML = products.map(p => window.utils.productCardHTML(p, window.wishlistModule?.hasProduct(p.id))).join('');
        } else {
          // Fallback demo data
          const products = window.demoData.products.slice(0, 8);
          document.getElementById('featured-grid').innerHTML = products.map(p => window.utils.productCardHTML(p, false)).join('');
        }
      } catch (err) {
        console.error('Home Products Fetch Error:', err);
        document.getElementById('featured-grid').innerHTML = '<p class="text-muted">Unable to load products.</p>';
      }

      // Artisans
      try {
        let artisans = [];
        if (window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
            const snap = await window.fbDB.collection('artisans').orderBy('rating','desc').limit(3).get();
            artisans = snap.docs.map(d => ({id: d.id, ...d.data()}));
        } else {
            artisans = window.demoData.artisans.slice(0, 3);
        }
        
        document.getElementById('spotlight-grid').innerHTML = artisans.map(a => `
          <div class="artisan-card" onclick="window.router.navigate('/artisan/${a.id}')">
            <img class="artisan-cover" src="${a.coverImage || 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=600&q=80'}" alt="Cover" loading="lazy">
            <div class="artisan-avatar-wrap">
              <img src="${a.avatar || 'https://i.pravatar.cc/150?u='+a.id}" alt="${a.name}" loading="lazy">
            </div>
            <div class="artisan-info">
              <h3 class="artisan-name">${a.name}</h3>
              <p class="artisan-craft">${a.craftType || a.craft}</p>
              <p class="artisan-loc">📍 ${a.location?.city||'India'}, ${a.location?.state||''}</p>
              <div class="artisan-rating">
                ${window.utils.generateStars(a.rating)} <span style="color:var(--text-muted);font-weight:400;">(${a.reviewCount || a.totalOrders || 0})</span>
              </div>
              <button class="btn-view-profile">View Profile</button>
            </div>
          </div>
        `).join('');
      } catch (err) {
        console.error('Home Artisans Fetch Error:', err);
        document.getElementById('spotlight-grid').innerHTML = '<p class="text-muted">Unable to load artisans.</p>';
      }
    }

    // Call async fetch
    fetchHomeData();
  };
})();
