/* ============================================================
   CHECKOUT PAGE (js/pages/checkout.js)
============================================================ */

(function() {

  window.renderCheckoutPage = async (app) => {
    
    // Auth Guard
    if(!window.authModule?.user) {
       window.utils.toast('Please log in to complete your checkout.', 'error');
       return window.router.navigate('/auth');
    }

    const cart = JSON.parse(localStorage.getItem('bharatcraft_cart') || '[]');
    if(cart.length === 0) {
       return window.router.navigate('/cart');
    }

    let checkoutTotals = JSON.parse(localStorage.getItem('bharatcraft_checkout_totals')) || {
       subtotal: cart.reduce((s,i)=>s+(i.price*i.quantity),0),
       discount: 0,
       delivery: 0,
       total: cart.reduce((s,i)=>s+(i.price*i.quantity),0)
    };
    
    // Safety verification of total
    if(checkoutTotals.total === 0) checkoutTotals.total = checkoutTotals.subtotal;

    let currentStep = 1;
    let formData = {};

    app.innerHTML = `
      <div class="checkout-page animate-in">
        <div class="checkout-header">
          <h1>Secure Checkout</h1>
        </div>
        
        <div class="checkout-progress">
          <div class="progress-fill" style="width: 0%;"></div>
          
          <div class="step-indicator active" id="ind-1">
            <div class="step-circle">1</div>
            <div class="step-label">Delivery</div>
          </div>
          <div class="step-indicator" id="ind-2">
            <div class="step-circle">2</div>
            <div class="step-label">Review</div>
          </div>
          <div class="step-indicator" id="ind-3">
            <div class="step-circle">3</div>
            <div class="step-label">Payment</div>
          </div>
        </div>

        <div class="checkout-body">
          <!-- STEP 1: DELIVERY -->
          <div class="checkout-step-content active" id="step-1">
            <div class="checkout-card">
              <h2>Delivery Address</h2>
              <form id="address-form" class="form-grid">
                <div class="form-group">
                  <label>Full Name *</label>
                  <input type="text" id="chk-name" value="${window.authModule.user.displayName||''}" required>
                  <span class="form-error">Please enter your full name.</span>
                </div>
                <div class="form-group">
                  <label>Mobile Number *</label>
                  <input type="tel" id="chk-phone" placeholder="10-digit number" required pattern="[0-9]{10}">
                  <span class="form-error">Valid 10-digit mobile number required.</span>
                </div>
                
                <div class="form-group">
                  <label>Pincode *</label>
                  <input type="text" id="chk-pin" placeholder="e.g. 110001" required pattern="[0-9]{6}">
                  <span class="form-error">Valid 6-digit Pincode required.</span>
                </div>
                <div class="form-group">
                  <label>City & State</label>
                  <input type="text" id="chk-city" placeholder="Auto-filled via Pincode" required readonly style="background:#f8fafc;">
                </div>

                <div class="form-group full">
                  <label>Address Line 1 (House No, Building, Street) *</label>
                  <input type="text" id="chk-addr1" required>
                  <span class="form-error">Street address is required.</span>
                </div>
                <div class="form-group full">
                  <label>Address Line 2 / Landmark (Optional)</label>
                  <input type="text" id="chk-addr2">
                </div>
              </form>
            </div>
            <div class="checkout-actions">
              <button class="btn-back" onclick="window.router.navigate('/cart')">← Return to Cart</button>
              <button class="btn-next" id="btn-next-1">Continue to Review</button>
            </div>
          </div>

          <!-- STEP 2: REVIEW -->
          <div class="checkout-step-content" id="step-2">
            <div class="checkout-card">
              <h2>Review Your Order</h2>
              <div id="review-list">
                ${cart.map(i => `
                  <div class="review-item">
                    <img src="${i.image}" class="ri-img">
                    <div class="ri-info">
                      <div class="ri-title">${i.name}</div>
                      <div class="ri-meta">Qty: ${i.quantity} • By ${i.artisanName}</div>
                    </div>
                    <div class="ri-price">${window.utils.formatCurrency(i.price * i.quantity)}</div>
                  </div>
                `).join('')}
              </div>
              <div class="review-totals">
                <div class="rt-line"><span>Subtotal (${cart.length} items)</span><span>${window.utils.formatCurrency(checkoutTotals.subtotal)}</span></div>
                ${checkoutTotals.discount > 0 ? `<div class="rt-line" style="color:#2ECC71;"><span>Discount Applied</span><span>-${window.utils.formatCurrency(checkoutTotals.discount)}</span></div>` : ''}
                <div class="rt-line"><span>Delivery Estimate (5-7 days)</span><span>${checkoutTotals.delivery===0?'FREE':window.utils.formatCurrency(checkoutTotals.delivery)}</span></div>
                <div class="rt-line total"><span>Total to Pay</span><span>${window.utils.formatCurrency(checkoutTotals.total)}</span></div>
              </div>
            </div>
            <div class="checkout-actions">
              <button class="btn-back" id="btn-back-2">← Back to Address</button>
              <button class="btn-next" id="btn-next-2">Continue to Payment</button>
            </div>
          </div>

          <!-- STEP 3: PAYMENT -->
          <div class="checkout-step-content" id="step-3">
            <div class="checkout-card">
              <h2>Select Payment Method</h2>
              <div class="payment-methods">
                
                <div class="pm-card active" data-method="card">
                  <div class="pm-header"><div class="pm-radio active"></div> Credit / Debit Card</div>
                  <div class="pm-body" style="display:block;">
                    <div class="form-group full">
                      <label>Card Number</label>
                      <input type="text" id="cc-num" placeholder="XXXX XXXX XXXX XXXX" maxlength="19">
                      <span class="form-error" id="cc-err">Invalid card number.</span>
                    </div>
                    <div class="cc-row">
                      <div class="form-group">
                        <label>Expiry (MM/YY)</label>
                        <input type="text" placeholder="MM/YY" maxlength="5" id="cc-exp">
                      </div>
                      <div class="form-group">
                        <label>CVV</label>
                        <input type="password" placeholder="***" maxlength="3" id="cc-cvv">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pm-card" data-method="upi">
                  <div class="pm-header"><div class="pm-radio"></div> UPI (GPay, PhonePe, Paytm)</div>
                  <div class="pm-body">
                    <div class="form-group full">
                      <label>Enter UPI ID</label>
                      <input type="text" placeholder="username@bank">
                    </div>
                  </div>
                </div>

                <div class="pm-card" data-method="cod">
                  <div class="pm-header"><div class="pm-radio"></div> Cash on Delivery</div>
                  <div class="pm-body">
                    <p style="font-size:0.9rem; color:var(--text-secondary);">Pay in cash or via UPI scan when the package arrives at your doorstep.</p>
                  </div>
                </div>

              </div>
            </div>
            <div class="checkout-actions">
              <button class="btn-back" id="btn-back-3">← Back to Review</button>
              <button class="btn-next" id="btn-pay-now" style="background:#2ECC71;">Pay ${window.utils.formatCurrency(checkoutTotals.total)}</button>
            </div>
          </div>

        </div>
      </div>

      <div class="pay-loader" id="pay-loader">
        <span class="spinner" style="width:50px; height:50px; border-width:4px;"></span>
        <h3>Processing your secure payment...</h3>
        <p style="color:var(--text-secondary); margin-top:10px;">Please do not refresh or close this window.</p>
      </div>
      
      <div id="confetti-container"></div>
    `;

    // Flow Management
    function goToStep(s) {
      document.querySelectorAll('.checkout-step-content').forEach(el => el.classList.remove('active'));
      document.getElementById('step-'+s).classList.add('active');
      
      const pFill = document.querySelector('.progress-fill');
      if(s === 1) pFill.style.width = '0%';
      if(s === 2) pFill.style.width = '50%';
      if(s === 3) pFill.style.width = '100%';

      document.querySelectorAll('.step-indicator').forEach((ind, i) => {
        ind.classList.remove('active', 'complete');
        if(i+1 === s) ind.classList.add('active');
        else if(i+1 < s) ind.classList.add('complete');
      });
      currentStep = s;
      window.scrollTo({top:0, behavior:'smooth'});
    }

    // Step 1: Logic
    document.getElementById('chk-pin').addEventListener('input', (e) => {
      // Mock API pin code fetch logic
      if(e.target.value.length === 6) {
        document.getElementById('chk-city').value = "Jaipur, Rajasthan"; // Demo mock
      } else {
        document.getElementById('chk-city').value = "";
      }
    });

    document.getElementById('btn-next-1').addEventListener('click', () => {
      let valid = true;
      const reqIds = ['chk-name', 'chk-phone', 'chk-pin', 'chk-addr1'];
      reqIds.forEach(id => {
        const el = document.getElementById(id);
        const group = el.closest('.form-group');
        if(!el.value.trim() || !el.checkValidity()) {
          group.classList.add('error'); valid = false;
        } else {
          group.classList.remove('error');
        }
      });
      if(valid) {
        formData.address = {
          name: document.getElementById('chk-name').value,
          phone: document.getElementById('chk-phone').value,
          pin: document.getElementById('chk-pin').value,
          cityState: document.getElementById('chk-city').value,
          line1: document.getElementById('chk-addr1').value,
          line2: document.getElementById('chk-addr2').value
        };
        goToStep(2);
      } else {
        window.utils.toast('Please fill all required fields correctly.', 'error');
      }
    });

    // Step 2: Logic
    document.getElementById('btn-back-2').addEventListener('click', () => goToStep(1));
    document.getElementById('btn-next-2').addEventListener('click', () => goToStep(3));

    // Step 3: Payment UI
    let activePayment = 'card';
    document.querySelectorAll('.pm-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.pm-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        activePayment = card.dataset.method;
      });
    });

    document.getElementById('btn-back-3').addEventListener('click', () => goToStep(2));
    
    // Automatic CC spacing logic
    document.getElementById('cc-num').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      document.getElementById('cc-num').closest('.form-group').classList.remove('error');
    });

    function luhnCheck(num) {
      let arr = (num + '')
        .replace(/\D/g, '')
        .split('')
        .reverse()
        .map(x => parseInt(x));
      let lastDigit = arr.splice(0, 1)[0];
      let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
      sum += lastDigit;
      return sum % 10 === 0;
    }

    document.getElementById('btn-pay-now').addEventListener('click', async () => {
      if(activePayment === 'card') {
        const numExtracted = document.getElementById('cc-num').value.replace(/\D/g, '');
        if(!luhnCheck(numExtracted) || numExtracted.length < 13) {
          document.getElementById('cc-num').closest('.form-group').classList.add('error');
          return window.utils.toast('Invalid Credit Card number.', 'error');
        }
      }

      // FIREBASE INTEGRATION & MOCK PROCESSING
      document.getElementById('pay-loader').style.display = 'flex';
      
      // Simulate network request
      await new Promise(r => setTimeout(r, 2500));
      
      try {
        if(window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
          await window.fbDB.collection('orders').add({
             userId: window.authModule.user.uid,
             items: cart,
             totals: checkoutTotals,
             shippingAddress: formData.address,
             paymentMethod: activePayment,
             status: 'confirmed',
             createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          // Clear remote cart safely
          await window.fbDB.collection('users').doc(window.authModule.user.uid).update({ cart: [] });
        }
      } catch(e) { console.error('Order Fallback saving:', e); }

      // Finish flow natively
      localStorage.setItem('bharatcraft_cart', '[]');
      localStorage.removeItem('bharatcraft_discount');
      localStorage.removeItem('bharatcraft_checkout_totals');
      document.getElementById('nav-cart-count').style.display = 'none';
      
      document.getElementById('pay-loader').style.display = 'none';

      // Confetti Launch
      launchConfetti();

      window.utils.toast('Order Placed Successfully! 🎉', 'success');
      setTimeout(() => {
        window.router.navigate('/orders');
      }, 3000);
    });

    // Pure CSS/JS Confetti Engine
    function launchConfetti() {
      const colors = ['#f39c12', '#2ECC71', '#e74c3c', '#9b59b6', '#3498db'];
      const cont = document.getElementById('confetti-container');
      cont.style.display = 'block';
      for(let i=0; i<80; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'absolute';
        conf.style.width = Math.random()*10 + 5 + 'px';
        conf.style.height = Math.random()*10 + 5 + 'px';
        conf.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.top = '-10px';
        conf.style.opacity = Math.random() + 0.5;
        conf.style.transform = `rotate(${Math.random()*360}deg)`;
        conf.style.transition = `top ${Math.random()*2 + 2}s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${Math.random()*2 + 2}s linear`;
        cont.appendChild(conf);

        setTimeout(() => {
          conf.style.top = '110vh';
          conf.style.transform = `rotate(${Math.random()*720}deg)`;
        }, 50);
      }
      setTimeout(() => { cont.style.display = 'none'; cont.innerHTML = ''; }, 4000);
    }

  };
})();
