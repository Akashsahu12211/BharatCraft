// ============================================================
//  BHARATCRAFT – Google Maps Module
// ============================================================

window.mapsModule = (() => {
  let _mapInstance = null;
  let _markers = [];
  let _infoWindow = null;
  let _loaded = false;

  // ── Load Maps Script ──────────────────────────────────────
  function loadScript() {
    return new Promise((resolve, reject) => {
      if (_loaded || window.google?.maps) { _loaded = true; resolve(); return; }
      const key = window.GOOGLE_MAPS_API_KEY || '';
      if (!key || key === 'YOUR_GOOGLE_MAPS_API_KEY') {
        reject(new Error('NO_API_KEY'));
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.async = true;
      script.onload = () => { _loaded = true; resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // ── Init Map ──────────────────────────────────────────────
  async function initMap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    try {
      await loadScript();
    } catch (e) {
      // Render fallback static map
      container.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1rem;color:var(--text-muted);text-align:center;padding:2rem;">
          <div style="font-size:3rem">🗺️</div>
          <h3 style="color:var(--text-primary)">Google Maps Unavailable</h3>
          <p style="font-size:.85rem;max-width:340px">Please add your Google Maps API key to <code>index.html</code> → <code>window.GOOGLE_MAPS_API_KEY</code></p>
          ${renderDemoArtisanPins()}
        </div>`;
      return null;
    }

    _mapInstance = new google.maps.Map(container, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
      styles: darkMapStyles(),
      mapTypeControl: false,
      streetViewControl: false,
    });
    _infoWindow = new google.maps.InfoWindow();
    return _mapInstance;
  }

  // ── Add Artisan Markers ───────────────────────────────────
  function addArtisanMarkers(artisans, onMarkerClick) {
    if (!_mapInstance) return;
    clearMarkers();
    artisans.forEach(a => {
      if (!a.location?.lat) return;
      const marker = new google.maps.Marker({
        position: { lat: a.location.lat, lng: a.location.lng },
        map: _mapInstance,
        title: a.name,
        label: { text: getCraftEmoji(a.craftType), fontSize: '20px' },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: '#FF9933',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2,
        }
      });
      marker.addListener('click', () => {
        const initial = (a.name || 'A')[0];
        _infoWindow.setContent(`
          <div class="map-info-window">
            <div class="miw-avatar" style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#FF9933,#C1440E);display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:700;color:#000;margin-bottom:.5rem;">${a.avatar ? `<img src="${a.avatar}" style="width:100%;height:100%;border-radius:50%;" />` : initial}</div>
            <div class="miw-name">${a.name}</div>
            <div class="miw-craft">${a.craftType || 'Artisan'}</div>
            <div class="miw-loc">📍 ${a.location?.city || ''}, ${a.location?.state || 'India'}</div>
            <a class="miw-btn" href="#/artisan/${a.id}">View Profile →</a>
          </div>`);
        _infoWindow.open(_mapInstance, marker);
        onMarkerClick && onMarkerClick(a);
      });
      _markers.push(marker);
    });
  }

  function clearMarkers() {
    _markers.forEach(m => m.setMap(null));
    _markers = [];
  }

  function panToArtisan(artisan) {
    if (!_mapInstance || !artisan.location?.lat) return;
    _mapInstance.panTo({ lat: artisan.location.lat, lng: artisan.location.lng });
    _mapInstance.setZoom(13);
  }

  // ── Dark map styles ────────────────────────────────────────
  function darkMapStyles() {
    return [
      { elementType: 'geometry', stylers: [{ color: '#1a1000' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0a00' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#8e7b5e' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a1e00' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d2a00' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
      { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e1500' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    ];
  }

  // ── Craft emoji helper ────────────────────────────────────
  function getCraftEmoji(craft = '') {
    const map = { pottery: '🏺', textiles: '🧵', jewelry: '💍', painting: '🎨', woodwork: '🪵', leather: '👜', bamboo: '🎋', stone: '🪨', metal: '⚒️' };
    return map[craft?.toLowerCase()] || '🎨';
  }

  // ── Demo fallback when no API key ─────────────────────────
  function renderDemoArtisanPins() {
    const artisans = window.demoData?.artisans || [];
    if (!artisans.length) return '';
    return `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-top:1rem;width:100%;max-width:500px;">
      ${artisans.slice(0,6).map(a => `
        <a href="#/artisan/${a.id}" style="display:flex;align-items:center;gap:.5rem;background:rgba(255,153,51,.08);border:1px solid rgba(255,153,51,.2);border-radius:8px;padding:.5rem;text-decoration:none;">
          <span style="font-size:1.4rem;">${getCraftEmoji(a.craftType)}</span>
          <div>
            <div style="font-size:.7rem;color:#F5EDD6;font-weight:600;">${a.name}</div>
            <div style="font-size:.6rem;color:#8E7B5E;">${a.location?.city || 'India'}</div>
          </div>
        </a>`).join('')}
    </div>`;
  }

  return { initMap, addArtisanMarkers, clearMarkers, panToArtisan, getCraftEmoji };
})();
