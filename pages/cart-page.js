/* ============================================================
   CART PAGE (js/pages/cart-page.js)
============================================================ */

(function() {

  window.renderCartPage = async (app) => {
    
    let cart = JSON.parse(localStorage.getItem('bharatcraft_cart') || '[]');
    let discountPercent = 0;
    
    const calculateTotals = () => {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = Math.floor(subtotal * (discountPercent / 100));
      const afterDiscount = subtotal - discount;
      const delivery = (afterDiscount > 999 || afterDiscount === 0) ? 0 : 99;
      const total = afterDiscount + delivery;
      return { subtotal, discount, delivery, total };
    };

    function renderEmptyCart() {
      app.innerHTML = `
        <div class="cart-page animate-in">
          <div class="cart-header">
            <h1>Shopping Cart</h1>
            <span class="cart-count-hdr">0 Items</span>
          </div>
          <div class="empty-cart-wrap">
            <div class="empty-bag-art"></div>
            <h2>Your cart is currently empty</h2>
            <p>Looks like you haven't added any handcrafted treasures to your cart yet.</p>
            <button class="btn btn-primary" style="padding: 1rem 3rem; font-size: 1.1rem; border-radius: 30px;" onclick="window.router.navigate('/products')">Start Exploring</button>
          </div>
        </div>
      `;
      document.getElementById('nav-cart-count').style.display = 'none';
      document.getElementById('nav-cart-count').innerText = '0';
    }

    async function syncFbCart() {
      if (window.authModule?.user && window.fbDB) {
        try {
          await window.fbDB.collection('users').doc(window.authModule.user.uid).update({ cart });
        } catch(e) { /* ignore silently */ }
      }
      localStorage.setItem('bharatcraft_cart', JSON.stringify(cart));
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      const navEl = document.getElementById('nav-cart-count');
      if(navEl) { navEl.innerText = count; navEl.style.display = count > 0 ? 'flex' : 'none'; }
    }

    function renderCart() {
      if(cart.length === 0) return renderEmptyCart();

      const totals = calculateTotals();
      
      app.innerHTML = `
        <div class="cart-page animate-in">
          <div class="cart-header">
            <h1>Shopping Cart</h1>
            <span class="cart-count-hdr">${cart.length} ${cart.length===1?'Item':'Items'}</span>
          </div>

          <div class="cart-layout">
            <div class="cart-items">
              ${cart.map((item, index) => `
                <div class="cart-item" data-idx="${index}">
                  <div class="ci-img-wrap">
                     <img src="${item.image || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=200&q=80'}" alt="${item.name}">
                  </div>
                  <div class="ci-details">
                     <a href="#/product/${item.id}" class="ci-title">${item.name}</a>
                     <div class="ci-artisan">By ${item.artisanName || 'BharatCraft Artisan'}</div>
                     <div class="ci-cat">Artisan Craft</div>
                     <div class="ci-actions">
                       <button class="ci-action-btn ci-action-remove" data-idx="${index}">✕ Remove</button>
                       <span style="color:var(--border-strong);">|</span>
                       <button class="ci-action-btn ci-action-save" data-idx="${index}">❤️ Save for Later</button>
                     </div>
                  </div>
                  <div class="ci-right">
                     <div class="ci-price">${window.utils.formatCurrency(item.price)}</div>
                     <div class="ci-qty-strip">
                       <button class="ci-qty-btn minus" data-idx="${index}">−</button>
                       <input type="text" class="ci-qty-input" value="${item.quantity}" readonly>
                       <button class="ci-qty-btn plus" data-idx="${index}">+</button>
                     </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <aside class="order-summary" id="order-summary-box">
              <h3>Order Summary</h3>
              <div class="os-line"><span>Subtotal (${cart.reduce((s,i)=>s+i.quantity,0)} items)</span><span id="os-subtotal">${window.utils.formatCurrency(totals.subtotal)}</span></div>
              <div class="os-line discount" id="os-discount-line" style="${totals.discount > 0 ? '' : 'display:none;'}">
                <span>Discount (${discountPercent}%)</span>
                <span id="os-discount">-${window.utils.formatCurrency(totals.discount)}</span>
              </div>
              <div class="os-line"><span>Delivery Details</span><span id="os-delivery">${totals.delivery === 0 ? 'FREE' : window.utils.formatCurrency(totals.delivery)}</span></div>
              
              <div class="coupon-box">
                <input type="text" id="coupon-input" class="coupon-input" placeholder="Enter coupon code">
                <button class="btn-apply" id="btn-apply">Apply</button>
              </div>
              <div class="coupon-msg" id="coupon-msg"></div>

              <div class="os-total"><span>Total</span><span id="os-total" style="color:var(--saffron);">${window.utils.formatCurrency(totals.total)}</span></div>
              
              <button class="btn-checkout" id="btn-checkout">Proceed to Checkout</button>
              <a href="#/products" class="continue-shop">← Continue Shopping</a>

              <div class="secure-badges">
                <div class="secure-badge">🔒 100% Secure Checkout</div>
                <div class="secure-badge">✓ 7-Day Easy Returns</div>
                <div class="secure-badge">🚚 Fast & Reliable Delivery</div>
              </div>
            </aside>
          </div>
        </div>
      `;

      bindEvents();
    }

    function updateSummaryPanel() {
      const totals = calculateTotals();
      document.getElementById('os-subtotal').innerText = window.utils.formatCurrency(totals.subtotal);
      
      const discLine = document.getElementById('os-discount-line');
      if(totals.discount > 0) {
        discLine.style.display = 'flex';
        discLine.querySelector('span').innerText = `Discount (${discountPercent}%)`;
        document.getElementById('os-discount').innerText = '-' + window.utils.formatCurrency(totals.discount);
      } else {
        discLine.style.display = 'none';
      }

      document.getElementById('os-delivery').innerText = totals.delivery === 0 ? 'FREE' : window.utils.formatCurrency(totals.delivery);
      document.getElementById('os-total').innerText = window.utils.formatCurrency(totals.total);
      
      const itemsCount = cart.reduce((s,i)=>s+i.quantity,0);
      document.querySelector('.cart-count-hdr').innerText = `${itemsCount} ${itemsCount===1?'Item':'Items'}`;
      document.querySelector('.os-line span').innerText = `Subtotal (${itemsCount} items)`;
      
      syncFbCart();
    }

    function bindEvents() {
      // Qty Minus
      document.querySelectorAll('.ci-qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.idx);
          if (cart[idx].quantity > 1) {
            cart[idx].quantity -= 1;
            e.currentTarget.nextElementSibling.value = cart[idx].quantity;
            updateSummaryPanel();
          }
        });
      });

      // Qty Plus
      document.querySelectorAll('.ci-qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.idx);
          if (cart[idx].quantity < 50) { // arbitrary limit
            cart[idx].quantity += 1;
            e.currentTarget.previousElementSibling.value = cart[idx].quantity;
            updateSummaryPanel();
          }
        });
      });

      // Remove
      document.querySelectorAll('.ci-action-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          if(confirm('Are you sure you want to remove this item?')) {
            const idx = parseInt(e.currentTarget.dataset.idx);
            cart.splice(idx, 1);
            if(cart.length === 0) renderEmptyCart();
            else { e.currentTarget.closest('.cart-item').remove(); updateSummaryPanel(); }
            syncFbCart();
          }
        });
      });

      // Save to Wishlist
      document.querySelectorAll('.ci-action-save').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.idx);
          const item = cart[idx];
          if(window.wishlistModule) {
            window.wishlistModule.toggle(item.id, null); // Adds silently
            window.utils.toast(`Moved ${item.name} to wishlist!`, 'success');
          }
          cart.splice(idx, 1);
          if(cart.length === 0) renderEmptyCart();
          else { e.currentTarget.closest('.cart-item').remove(); updateSummaryPanel(); }
          syncFbCart();
        });
      });

      // Coupon logic
      document.getElementById('btn-apply').addEventListener('click', () => {
        const val = document.getElementById('coupon-input').value.toUpperCase().trim();
        const msg = document.getElementById('coupon-msg');
        if (!val) return;

        if (val === 'CRAFT10') { discountPercent = 10; msg.innerText = "Coupon CRAFT10 applied!"; msg.className = "coupon-msg success"; }
        else if (val === 'BHARAT20') { discountPercent = 20; msg.innerText = "Coupon BHARAT20 applied!"; msg.className = "coupon-msg success"; }
        else { discountPercent = 0; msg.innerText = "Invalid or expired coupon."; msg.className = "coupon-msg error"; }
        
        // Save discount memory for checkout passing
        localStorage.setItem('bharatcraft_discount', discountPercent);
        updateSummaryPanel();
      });

      // Checkout Button
      document.getElementById('btn-checkout').addEventListener('click', () => {
        if(!window.authModule?.user) {
          window.utils.toast('Please login to proceed to checkout!', 'info');
          localStorage.setItem('bharatcraft_redirect', '/checkout');
          window.router.navigate('/auth');
        } else {
          // Calculate final totals and save them for the checkout page step 2 validation
          const totals = calculateTotals();
          localStorage.setItem('bharatcraft_checkout_totals', JSON.stringify(totals));
          window.router.navigate('/checkout');
        }
      });
    }

    // Init Page
    discountPercent = parseInt(localStorage.getItem('bharatcraft_discount') || '0');
    renderCart();

  };

})();
