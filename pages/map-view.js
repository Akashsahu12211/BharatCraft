/* ============================================================
   MAP VIEW PAGE (js/pages/map-view.js)
============================================================ */

(function() {

  // Dynamic Google Maps Loader
  function loadGoogleMapsAPI() {
    return new Promise((resolve) => {
      if (window.google && window.google.maps) { resolve(); return; }
      window.googleMapsInitCb = () => { resolve(); delete window.googleMapsInitCb; };
      const script = document.createElement('script');
      // Using standard map libraries. 
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDummyKeyForDemoPurposesOnly&libraries=places,geometry&callback=googleMapsInitCb`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      // Load Clusterer CDN alongside
      const clusterScript = document.createElement('script');
      clusterScript.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
      document.head.appendChild(clusterScript);
    });
  }

  // Elegant Muted Map Style configuration
  const mapStyle = [
    { "elementType": "geometry", "stylers": [{"color": "#f5f5f5"}] },
    { "elementType": "labels.icon", "stylers": [{"visibility": "off"}] },
    { "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}] },
    { "elementType": "labels.text.stroke", "stylers": [{"color": "#f5f5f5"}] },
    { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{"color": "#bdbdbd"}] },
    { "featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#eeeeee"}] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{"color": "#757575"}] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{"color": "#e5e5e5"}] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{"color": "#ffffff"}] },
    { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{"color": "#9ca5b3"}] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{"color": "#dadada"}] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}] },
    { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{"color": "#9e9e9e"}] },
    { "featureType": "transit.line", "elementType": "geometry", "stylers": [{"color": "#e5e5e5"}] },
    { "featureType": "transit.station", "elementType": "geometry", "stylers": [{"color": "#eeeeee"}] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{"color": "#c9c9c9"}] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{"color": "#9e9e9e"}] }
  ];

  window.renderMapPage = async (app, params) => {
    
    // Layout injection
    app.innerHTML = `
      <div class="map-page animate-in">
        
        <!-- SIDEBAR -->
        <aside class="map-sidebar" id="map-sidebar">
          <div class="map-sidebar-header">
            <div class="mobile-handle" id="mobile-drag-handle"></div>
            <div class="map-search-box">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="map-search-in" placeholder="Search artisans, crafts, cities...">
            </div>
            <div class="map-filters" id="map-chips">
              <div class="map-filter-chip active" data-cat="">All</div>
              <div class="map-filter-chip" data-cat="Pottery">Pottery</div>
              <div class="map-filter-chip" data-cat="Textiles">Textiles</div>
              <div class="map-filter-chip" data-cat="Painting">Painting</div>
              <div class="map-filter-chip" data-cat="Jewelry">Jewelry</div>
              <div class="map-filter-chip" data-cat="Woodwork">Woodwork</div>
            </div>
          </div>
          
          <div class="artisan-list-wrap" id="artisan-list">
            <div style="padding:2rem; text-align:center;"><span class="spinner" style="width:24px;height:24px;border-width:2px;display:inline-block; border: 2px solid rgba(0,0,0,0.1); border-top-color:var(--saffron); border-radius:50%; animation:spin 1s linear infinite;"></span></div>
          </div>
        </aside>

        <!-- MAP AREA -->
        <main class="map-area">
          <div id="google-map"></div>
          
          <!-- Controls -->
          <div class="map-controls-top">
            <button class="map-btn" id="btn-my-loc" title="My Location"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="8"></circle></svg></button>
            <button class="map-btn" id="btn-zoom-in" title="Zoom In"><b>+</b></button>
            <button class="map-btn" id="btn-zoom-out" title="Zoom Out"><b>−</b></button>
            <button class="map-btn" id="btn-map-type" title="Toggle Map Type"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path></svg></button>
          </div>

          <div class="map-search-overlay">
             <div class="map-search-box" style="margin:0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="map-places-input" placeholder="Jump to a specific region or city...">
             </div>
          </div>
          
          <!-- Mobile Map Toggle Btn -->
          <button class="mobile-map-toggle" id="btn-mobile-sheet">
             <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg> View List
          </button>

          <!-- Custom Popup HTML injected here dynamically -->
        </main>

      </div>
    `;

    // Ensure Maps API is loaded
    await loadGoogleMapsAPI();

    // Map DOM elements
    const mapEl = document.getElementById('google-map');
    const artisanList = document.getElementById('artisan-list');
    const searchIn = document.getElementById('map-search-in');
    
    // State
    const indiaCenter = { lat: 20.5937, lng: 78.9629 };
    let map;
    let customOverlays = [];
    let currentPopup = null;
    let artisansData = [];
    let visibleArtisans = [];
    let myLocMarker = null;

    // Default Seed Lat Lng mapping for artisans lacking coords based on City
    const cityCoords = {
      'Jaipur': { lat: 26.9124, lng: 75.7873 },
      'Kutch': { lat: 23.7337, lng: 69.8597 },
      'Varanasi': { lat: 25.3176, lng: 82.9739 },
      'Srinagar': { lat: 34.0837, lng: 74.7973 },
      'Mysore': { lat: 12.2958, lng: 76.6394 },
      'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
      'Kanchipuram': { lat: 12.3051, lng: 76.6413 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Agra': { lat: 25.1462, lng: 82.9961 } // Mock displacement for spread
    };

    // ── 1. MAP INIT ──
    map = new google.maps.Map(mapEl, {
      center: indiaCenter,
      zoom: 5,
      styles: mapStyle,
      disableDefaultUI: true, // We use custom controls
      gestureHandling: 'greedy'
    });

    // Custom Controls Listeners
    document.getElementById('btn-zoom-in').addEventListener('click', () => map.setZoom(map.getZoom() + 1));
    document.getElementById('btn-zoom-out').addEventListener('click', () => map.setZoom(map.getZoom() - 1));
    document.getElementById('btn-map-type').addEventListener('click', () => {
      const type = map.getMapTypeId() === 'roadmap' ? 'satellite' : 'roadmap';
      map.setMapTypeId(type);
    });

    // ── 2. FETCH ARTISAN DATA ──
    async function fetchArtisans() {
      try {
        if (window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
          const snap = await window.fbDB.collection('artisans').get();
          artisansData = snap.docs.map(d => ({id:d.id, ...d.data()}));
          if(!artisansData.length) artisansData = window.demoData.artisans;
        } else {
          artisansData = window.demoData.artisans;
        }
      } catch(e) { artisansData = window.demoData.artisans; }

      // Map coordinates fallback mapping
      artisansData = artisansData.map((a, i) => {
        let latlng = a.coordinates;
        if(!latlng) {
          const base = cityCoords[a.location?.city] || indiaCenter;
          // Add slight random jitter so markers don't overlap perfectly if in same city
          latlng = { lat: base.lat + (Math.random()-0.5)*0.5, lng: base.lng + (Math.random()-0.5)*0.5 };
        }
        return { ...a, latlng };
      });
      
      visibleArtisans = [...artisansData];
      renderMarkers();
      renderList();
    }

    // ── 3. CUSTOM HTML OVERLAY (Marker Replacement) ──
    class HTMLMarker extends google.maps.OverlayView {
      constructor(artisan, mapInstance) {
        super();
        this.artisan = artisan;
        this.latlng = new google.maps.LatLng(artisan.latlng.lat, artisan.latlng.lng);
        this.div = null;
        this.setMap(mapInstance);
      }
      onAdd() {
        this.div = document.createElement('div');
        this.div.className = 'custom-map-marker';
        this.div.innerHTML = `<img src="${this.artisan.avatar || 'https://i.pravatar.cc/150?u='+this.artisan.id}" loading="lazy">`;
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div);

        // Click Handler
        google.maps.event.addDomListener(this.div, 'click', () => {
          openPopup(this.artisan);
          map.panTo(this.latlng);
          map.setZoom(Math.max(map.getZoom(), 8)); // zoom in nicely if too far
        });
      }
      draw() {
        const overlayProjection = this.getProjection();
        const pos = overlayProjection.fromLatLngToDivPixel(this.latlng);
        if(this.div) {
          this.div.style.left = pos.x + 'px';
          this.div.style.top = pos.y + 'px';
        }
      }
      onRemove() {
        if(this.div) { this.div.parentNode.removeChild(this.div); this.div = null; }
      }
      getPosition() { return this.latlng; } // Required for MarkerClusterer
      getVisible() { return true; } // Required for MarkerClusterer
    }

    let globalClusterer = null;

    function renderMarkers() {
      // Clear existing
      customOverlays.forEach(o => o.setMap(null));
      customOverlays = [];
      if(globalClusterer) globalClusterer.clearMarkers();

      if(typeof MarkerClusterer === 'undefined') {
        // Fallback to overlay rendering without clustering
        visibleArtisans.forEach(a => {
          customOverlays.push(new HTMLMarker(a, map));
        });
      } else {
        // Since MarkerClusterer works natively with standard Marker arrays,
        // and Custom OverlayView doesn't easily implement the standard Marker interface,
        // we'll stick to non-clustered OverlayView for rich avatars since total count is ~20 for demo.
        visibleArtisans.forEach(a => {
          customOverlays.push(new HTMLMarker(a, map));
        });
      }
    }

    // ── 4. INFO POPUP ──
    const popupManager = document.createElement('div');
    document.querySelector('.map-area').appendChild(popupManager);

    function openPopup(artisan) {
      // Clean previous
      popupManager.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'custom-map-popup';
      div.innerHTML = `
        <button class="popup-close">✕</button>
        <div class="pop-top">
          <img src="${artisan.avatar || 'https://i.pravatar.cc/150?u='+artisan.id}" class="pop-avatar">
          <div class="pop-info">
            <h4>${artisan.name}</h4>
            <p>${artisan.craftType || 'Artisan'}</p>
            <div class="pop-rating">${window.utils.generateStars(artisan.rating||0)}</div>
          </div>
        </div>
        <div class="pop-tag">${Math.floor(Math.random()*15)+3} products available</div>
        <div class="pop-actions">
          <button class="pop-btn-primary" onclick="window.router.navigate('/artisan/${artisan.id}')">View Profile</button>
          <a class="pop-btn-secondary" href="https://www.google.com/maps/dir/?api=1&destination=${artisan.latlng.lat},${artisan.latlng.lng}" target="_blank">Go to Maps Directions ↗</a>
        </div>
      `;

      // Assign position via Maps Overlay Projection to pin it physically above marker
      // But a cleaner way for absolute positioning: place it in DOM, track map pans
      // Actually pinning overlay locally within map viewport logic:
      popupManager.appendChild(div);
      
      div.querySelector('.popup-close').addEventListener('click', () => { popupManager.innerHTML=''; });

      // Highlight in list
      const cards = document.querySelectorAll('.map-artisan-card');
      cards.forEach(c => c.classList.remove('highlight'));
      const activeCard = document.querySelector(`.map-artisan-card[data-id="${artisan.id}"]`);
      if(activeCard) {
        activeCard.classList.add('highlight');
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Hide mobile sheet if open
      document.getElementById('map-sidebar').classList.remove('open');
      document.getElementById('btn-mobile-sheet').innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg> View List';
    }


    // ── 5. RENDER LEFT PANEL LIST ──
    function renderList() {
      if(!visibleArtisans.length) {
        artisanList.innerHTML = '<div class="list-empty">No artisans found locally in this map area matching your search. Try panning the map or zooming out!</div>';
        return;
      }
      
      artisanList.innerHTML = visibleArtisans.map(a => `
        <div class="map-artisan-card" data-id="${a.id}">
          <img src="${a.avatar || 'https://i.pravatar.cc/150?u='+a.id}" class="mac-avatar">
          <div class="mac-info">
            <div class="mac-name">${a.name}</div>
            <div class="mac-craft">${a.craftType || 'Crafts'}</div>
            <div class="mac-loc">📍 ${a.location?.city||'India'}</div>
            <div class="mac-meta">
              <span class="mac-rating">★ ${a.rating||0}</span>
            </div>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.map-artisan-card').forEach(card => {
        card.addEventListener('click', () => {
          const a = visibleArtisans.find(x => x.id === card.dataset.id);
          if(a) {
             map.panTo(a.latlng);
             map.setZoom(Math.max(map.getZoom(), 8)); // ensure zoom
             openPopup(a);
          }
        });
      });
    }

    // ── 6. FILTERING LOGIC ──
    function applyFilters(searchTerm, category) {
      popupManager.innerHTML = ''; // close popups
      visibleArtisans = artisansData.filter(a => {
        if(category && category !== '') {
          if(!a.craftType?.toLowerCase().includes(category.toLowerCase())) return false;
        }
        if(searchTerm) {
          const t = searchTerm.toLowerCase();
          if(!a.name?.toLowerCase().includes(t) && !a.craftType?.toLowerCase().includes(t) && !a.location?.city?.toLowerCase().includes(t)) return false;
        }
        return true;
      });
      renderMarkers();
      renderList();
    }

    searchIn.addEventListener('input', (e) => {
      const activeCat = document.querySelector('.map-filter-chip.active').dataset.cat;
      applyFilters(e.target.value.trim(), activeCat);
    });

    document.querySelectorAll('.map-filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.map-filter-chip').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        applyFilters(searchIn.value.trim(), e.currentTarget.dataset.cat);
      });
    });

    // Event updating list on map drag/zoom constraints
    map.addListener('idle', () => {
      const bounds = map.getBounds();
      if(bounds) {
        // Filter visible components natively
        // const visible = artisansData.filter(a => bounds.contains(a.latlng));
        // Disabled active filtering here because user might search generically across India. 
        // We'll leave list unfiltered strictly by bounds for better discovery, 
        // or apply purely UI highlights. Let's keep the full list active relative to Search parameters.
      }
    });

    // ── 7. MY LOCATION (Geolocation) ──
    document.getElementById('btn-my-loc').addEventListener('click', () => {
      if(navigator.geolocation) {
        window.utils.toast('Acquiring physical location...', 'info');
        navigator.geolocation.getCurrentPosition((pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          map.panTo(loc);
          map.setZoom(9);
          
          if(myLocMarker) myLocMarker.setMap(null);
          // Draw standard blue dot
          myLocMarker = new google.maps.OverlayView();
          myLocMarker.onAdd = function() {
            const div = document.createElement('div');
            div.className = 'blue-dot';
            this.getPanes().overlayMouseTarget.appendChild(div);
            myLocMarker.div = div;
          };
          myLocMarker.draw = function() {
            const posPx = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(loc.lat, loc.lng));
            if(myLocMarker.div) { myLocMarker.div.style.left = posPx.x + 'px'; myLocMarker.div.style.top = posPx.y + 'px'; }
          };
          myLocMarker.onRemove = function() { if(myLocMarker.div) myLocMarker.div.parentNode.removeChild(myLocMarker.div); };
          myLocMarker.setMap(map);

        }, () => {
          window.utils.toast('Location access denied or unavailable.', 'error');
        });
      }
    });

    // ── 8. PLACES SEARCH MAP BOX ──
    const placesInput = document.getElementById('map-places-input');
    if(window.google.maps.places) {
      const autocomplete = new google.maps.places.Autocomplete(placesInput, { componentRestrictions: { country: "in" } });
      autocomplete.bindTo('bounds', map);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if(!place.geometry || !place.geometry.location) return;
        if(place.geometry.viewport) map.fitBounds(place.geometry.viewport);
        else { map.setCenter(place.geometry.location); map.setZoom(10); }
      });
    }

    // ── 9. MOBILE SHEET INTERACTIONS ──
    let isSheetOpen = false;
    const sidebar = document.getElementById('map-sidebar');
    const sheetBtn = document.getElementById('btn-mobile-sheet');
    
    sheetBtn.addEventListener('click', () => {
      isSheetOpen = !isSheetOpen;
      if(isSheetOpen) {
        sidebar.classList.add('open');
        sheetBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg> Close List';
      } else {
        sidebar.classList.remove('open');
        sheetBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg> View List';
      }
    });

    // Fetch!
    setTimeout(fetchArtisans, 500);

  };

})();
