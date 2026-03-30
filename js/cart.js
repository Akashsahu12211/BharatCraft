// ============================================================
//  BHARATCRAFT – Cart Module (localStorage + Firestore sync)
// ============================================================

window.cartModule = (() => {
  const CART_KEY = 'bharatcraft_cart';

  // ── Internal State ─────────────────────────────────────────
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
  }

  // ── Add to Cart ────────────────────────────────────────────
  async function add(productId, quantity = 1, variant = null) {
    // Fetch product from Firestore (or use demo data)
    let product;
    try {
      const doc = await window.fbDB.collection('products').doc(productId).get();
      if (doc.exists) product = { id: doc.id, ...doc.data() };
      else product = getDemoProduct(productId);
    } catch {
      product = getDemoProduct(productId);
    }
    if (!product) { utils.toast('Product not found', 'error'); return; }

    const cart = getCart();
    const existingIdx = cart.findIndex(i => i.productId === productId && i.variant === variant);
    if (existingIdx > -1) {
      cart[existingIdx].quantity += quantity;
    } else {
      cart.push({
        productId,
        name: product.name,
        price: product.price,
        image: (product.images && product.images[0]) || `https://picsum.photos/seed/${productId}/200/200`,
        artisanName: product.artisanName || '',
        variant,
        quantity
      });
    }
    saveCart(cart);
    utils.toast(`${product.name} added to cart 🛒`, 'success');
    bumpCartIcon();
  }

  // ── Remove ─────────────────────────────────────────────────
  function remove(productId, variant = null) {
    const cart = getCart().filter(i => !(i.productId === productId && i.variant === variant));
    saveCart(cart);
  }

  // ── Update Quantity ────────────────────────────────────────
  function updateQty(productId, qty, variant = null) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.productId === productId && i.variant === variant);
    if (idx > -1) {
      if (qty <= 0) { cart.splice(idx, 1); }
      else { cart[idx].quantity = qty; }
      saveCart(cart);
    }
  }

  // ── Clear ──────────────────────────────────────────────────
  function clear() { localStorage.removeItem(CART_KEY); updateCartCount(); }

  // ── Totals ─────────────────────────────────────────────────
  function getTotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
  function getCount() {
    return getCart().reduce((sum, i) => sum + i.quantity, 0);
  }

  // ── Update Count Badge ─────────────────────────────────────
  function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const count = getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  // ── Bump Animation ─────────────────────────────────────────
  function bumpCartIcon() {
    const badge = document.getElementById('cart-count');
    badge?.classList.remove('bump');
    void badge?.offsetWidth;
    badge?.classList.add('bump');
  }

  // ── Demo Product Fallback (for seed data without Firestore) ──
  function getDemoProduct(id) {
    const all = window.demoData ? window.demoData.products : [];
    return all.find(p => p.id === id) || null;
  }

  // ── Place Order ────────────────────────────────────────────
  async function placeOrder(address, paymentMethod = 'cod') {
    const user = window.authModule.getCurrentUser();
    if (!user) { utils.toast('Please sign in to place an order', 'error'); return null; }
    const cart = getCart();
    if (!cart.length) { utils.toast('Your cart is empty', 'info'); return null; }
    try {
      const orderRef = await window.fbDB.collection('orders').add({
        userId: user.uid,
        userName: user.displayName || '',
        items: cart.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          variant: i.variant || null,
        })),
        totalAmount: getTotal(),
        address,
        paymentMethod,
        status: 'confirmed',
        statusHistory: [{ status: 'confirmed', timestamp: new Date().toISOString() }],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      clear();
      return orderRef.id;
    } catch (e) {
      console.error('Order error:', e);
      utils.toast('Failed to place order: ' + e.message, 'error');
      return null;
    }
  }

  // Init
  updateCartCount();

  return { add, remove, updateQty, clear, getCart, getTotal, getCount, updateCartCount, placeOrder };
})();
