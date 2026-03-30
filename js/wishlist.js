// ============================================================
//  BHARATCRAFT – Wishlist Module (Firestore)
// ============================================================

window.wishlistModule = (() => {
  let _wishlistProducts = new Set();
  let _wishlistArtisans = new Set();
  let _unsubscribe = null;

  // ── Listen to wishlist changes ────────────────────────────
  window.addEventListener('authStateChanged', ({ detail }) => {
    if (_unsubscribe) _unsubscribe();
    if (!detail.user) {
      _wishlistProducts.clear();
      _wishlistArtisans.clear();
      return;
    }
    _unsubscribe = window.fbDB.collection('users').doc(detail.user.uid).onSnapshot(snap => {
      if (snap.exists) {
        const data = snap.data();
        _wishlistProducts = new Set(data.wishlistProducts || []);
        _wishlistArtisans = new Set(data.wishlistArtisans || []);
      }
    });
  });

  // ── Toggle Product ─────────────────────────────────────────
  async function toggle(productId, buttonEl) {
    const user = window.authModule.getCurrentUser();
    if (!user) { utils.toast('Sign in to save to wishlist', 'info'); window.router.navigate('/auth'); return; }
    const isIn = _wishlistProducts.has(productId);
    try {
      await window.fbDB.collection('users').doc(user.uid).update({
        wishlistProducts: isIn
          ? firebase.firestore.FieldValue.arrayRemove(productId)
          : firebase.firestore.FieldValue.arrayUnion(productId)
      });
      if (isIn) {
        _wishlistProducts.delete(productId);
        if (buttonEl) { buttonEl.textContent = '🤍'; buttonEl.classList.remove('active'); }
        utils.toast('Removed from wishlist', 'info');
      } else {
        _wishlistProducts.add(productId);
        if (buttonEl) { buttonEl.textContent = '❤️'; buttonEl.classList.add('active'); }
        utils.toast('Added to wishlist ❤️', 'success');
      }
    } catch (e) {
      utils.toast('Error: ' + e.message, 'error');
    }
  }

  // ── Toggle Artisan ─────────────────────────────────────────
  async function toggleArtisan(artisanId) {
    const user = window.authModule.getCurrentUser();
    if (!user) { utils.toast('Sign in to follow artisans', 'info'); return; }
    const isIn = _wishlistArtisans.has(artisanId);
    await window.fbDB.collection('users').doc(user.uid).update({
      wishlistArtisans: isIn
        ? firebase.firestore.FieldValue.arrayRemove(artisanId)
        : firebase.firestore.FieldValue.arrayUnion(artisanId)
    });
    utils.toast(isIn ? 'Removed from following' : 'Now following artisan!', isIn ? 'info' : 'success');
  }

  function hasProduct(productId) { return _wishlistProducts.has(productId); }
  function hasArtisan(artisanId) { return _wishlistArtisans.has(artisanId); }
  function getProducts() { return [..._wishlistProducts]; }
  function getArtisans() { return [..._wishlistArtisans]; }

  return { toggle, toggleArtisan, hasProduct, hasArtisan, getProducts, getArtisans };
})();
