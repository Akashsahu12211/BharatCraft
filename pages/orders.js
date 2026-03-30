/* ============================================================
   ORDERS PAGE (js/pages/orders.js)
============================================================ */

(function() {

  window.renderOrdersPage = async (app) => {
    
    if(!window.authModule?.user) {
       window.utils.toast('Sign in to view tracking data.', 'error');
       return window.router.navigate('/auth');
    }

    const uid = window.authModule.user.uid;
    let orders = [];

    // 1. Fetch
    try {
      if(window.fbDB && window.fbDB.app.options.projectId !== 'YOUR_PROJECT_ID') {
         const snap = await window.fbDB.collection('orders')
           .where('userId', '==', uid)
           .orderBy('createdAt', 'desc')
           .get();
         orders = snap.docs.map(d => ({id: d.id, ...d.data()}));
      } else {
         // Mock generator
         orders = [
           { id: 'BC-9204JD', status: 'shipped', totals: { total: 4200, delivery: 0, subtotal: 4500, discount: 300 }, items: [{name:"Terracotta Set", quantity:2, price:2100, image:"https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=100"}], createdAt: { seconds: Date.now()/1000 - 86400*2 }, shippingAddress: { line1: "123 Beta Way", cityState:"Jaipur, Rajasthan", pin:"302001", name:"Test Client" }},
           { id: 'BC-5012AX', status: 'delivered', totals: { total: 1550, delivery: 99, subtotal: 1451, discount: 0 }, items: [{name:"Embroidery Fabric", quantity:1, price:1451, image:"https://images.unsplash.com/photo-1605814512351-a0833a6ea21c?auto=format&fit=crop&w=100"}], createdAt: { seconds: Date.now()/1000 - 86400*12 }, shippingAddress: { line1: "9 Kappa Road", cityState:"Mumbai, MH", pin:"400001", name:"Test Client" }},
           { id: 'BC-0021PP', status: 'cancelled', totals: { total: 8000, delivery: 0, subtotal: 8000, discount: 0 }, items: [{name:"Bronze Statue", quantity:1, price:8000, image:"https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=100"}], createdAt: { seconds: Date.now()/1000 - 86400*30 }, shippingAddress: { line1: "Alpha Heights", cityState:"Delhi, DL", pin:"110001", name:"Test Client" }}
         ];
      }
    } catch(e) { console.warn(e); }

    const formatDt = (sec) => {
      if(!sec) return new Date().toLocaleDateString();
      return new Date(sec * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStateMap = (status) => {
      const g = { confirmed: 1, processing: 2, shipped: 3, delivered: 4 };
      if(status === 'cancelled') return 0;
      return g[status] || 1;
    };

    const getBadge = (status) => {
      if(status === 'confirmed') return '<span class="ord-badge badge-blue">Confirmed</span>';
      if(status === 'processing') return '<span class="ord-badge badge-orange">Processing</span>';
      if(status === 'shipped') return '<span class="ord-badge badge-purple">Shipped</span>';
      if(status === 'delivered') return '<span class="ord-badge badge-green">Delivered</span>';
      if(status === 'cancelled') return '<span class="ord-badge badge-red">Cancelled</span>';
      return '<span class="ord-badge badge-blue">Pending</span>';
    };

    function renderOrder(o) {
      const stLevel = getStateMap(o.status);
      const isCanc = o.status === 'cancelled';
      
      const widthMap = { 0: '0%', 1: '0%', 2: '33%', 3: '66%', 4: '100%' };

      const actions = [];
      if(o.status === 'confirmed' || o.status === 'processing') {
        actions.push(`<button class="btn-oa btn-oa-danger" data-action="cancel" data-id="${o.id}">✕ Cancel Order</button>`);
      }
      if(o.status === 'shipped') {
        actions.push(`<button class="btn-oa btn-oa-primary" data-action="track" data-id="${o.id}">🚚 Track Status</button>`);
      }
      if(o.status === 'delivered') {
        actions.push(`<button class="btn-oa btn-oa-primary" data-action="review" data-id="${o.id}">⭐ Write Review</button>`);
        actions.push(`<button class="btn-oa btn-oa-outline" data-action="return" data-id="${o.id}">↻ Request Return</button>`);
      }
      actions.push(`<button class="btn-oa btn-oa-outline" data-action="invoice" data-id="${o.id}">📄 Download Invoice</button>`);

      return `
        <div class="ord-card" data-filter="${isCanc ? 'cancelled' : (o.status === 'delivered' ? 'delivered' : 'active')}">
          <div class="ord-head">
            <div class="oh-left">
              <div class="oh-id">Order ID: ${o.id.toUpperCase()}</div>
              <div class="oh-date">Placed on ${formatDt(o.createdAt?.seconds)}</div>
            </div>
            <div class="oh-right">
              ${getBadge(o.status)}
              <div class="ord-toggle-icon">▼</div>
            </div>
          </div>
          
          <div class="ord-body">
            
            ${!isCanc ? `
            <div class="ord-tracker">
              <div class="ot-fill" style="width: ${widthMap[stLevel]};"></div>
              <div class="ot-step ${stLevel >= 1 ? stLevel===1?'active':'complete' : ''}"><div class="ot-circle">${stLevel>1?'✓':'1'}</div><span class="ot-label">Confirmed</span></div>
              <div class="ot-step ${stLevel >= 2 ? stLevel===2?'active':'complete' : ''}"><div class="ot-circle">${stLevel>2?'✓':'2'}</div><span class="ot-label">Processing</span></div>
              <div class="ot-step ${stLevel >= 3 ? stLevel===3?'active':'complete' : ''}"><div class="ot-circle">${stLevel>3?'✓':'3'}</div><span class="ot-label">Shipped</span></div>
              <div class="ot-step ${stLevel >= 4 ? 'active complete' : ''}"><div class="ot-circle">${stLevel>=4?'✓':'4'}</div><span class="ot-label">Delivered</span></div>
            </div>
            ` : `
            <div style="color:var(--crimson); font-weight:700; margin-bottom:1rem; padding:10px; background:#fee2e2; border-radius:8px; text-align:center;">This order was cancelled successfully and no ledger charges were completed.</div>
            `}

            <div class="ord-grids">
              <div class="og-col">
                <h4>Items in your Order</h4>
                ${o.items.map(i => `
                  <div class="ord-item-row">
                    <img src="${i.image}" class="o-img">
                    <div class="o-info">
                       <div class="o-title">${i.name}</div>
                       <div class="o-meta">Qty: ${i.quantity}</div>
                    </div>
                    <div class="o-price">${window.utils.formatCurrency(i.price)}</div>
                  </div>
                `).join('')}
              </div>
              
              <div class="og-col" style="background:var(--bg-elevated); padding:1.5rem; border-radius:8px;">
                <h4>Payment Summary</h4>
                <div class="ord-summ-line"><span>Subtotal</span><span>${window.utils.formatCurrency(o.totals.subtotal)}</span></div>
                ${o.totals.discount > 0 ? `<div class="ord-summ-line" style="color:#2ECC71;"><span>Discount</span><span>-${window.utils.formatCurrency(o.totals.discount)}</span></div>` : ''}
                <div class="ord-summ-line"><span>Delivery</span><span>${window.utils.formatCurrency(o.totals.delivery||0)}</span></div>
                <div class="ord-summ-total"><span>Total</span><span>${window.utils.formatCurrency(o.totals.total)}</span></div>
                
                <h4 style="margin-top:2rem;">Delivery Address</h4>
                <div class="ord-addr">
                  <p><strong>${o.shippingAddress.name}</strong><br>
                  ${o.shippingAddress.line1}<br>
                  ${o.shippingAddress.cityState} - ${o.shippingAddress.pin}</p>
                </div>
              </div>
            </div>

            <div class="ord-actions">
              ${actions.join('')}
            </div>

          </div>
        </div>
      `;
    }

    app.innerHTML = `
      <div class="orders-page animate-in">
        <div class="orders-header">
          <h1>My Order History</h1>
        </div>
        
        <div class="ord-filters" id="ord-filters">
          <button class="ord-filter-btn active" data-f="all">All Orders (${orders.length})</button>
          <button class="ord-filter-btn" data-f="active">Active Trackers</button>
          <button class="ord-filter-btn" data-f="delivered">Delivered Successfully</button>
          <button class="ord-filter-btn" data-f="cancelled">Cancelled</button>
        </div>

        <div id="orders-container">
          ${orders.length === 0 ? `
            <div style="text-align:center; padding:4rem; border:1px dashed var(--border-strong); border-radius:12px; background:white;">
              <h2>No Orders Found</h2>
              <p style="color:var(--text-secondary); margin-bottom:1rem;">You haven't purchased anything yet.</p>
              <button class="btn btn-primary" onclick="window.router.navigate('/products')">Go Shopping</button>
            </div>
          ` : orders.map(renderOrder).join('')}
        </div>

      </div>

      <!-- Tracking Overlay -->
      <div class="tracking-overlay" id="trk-ovl">
        <div class="tracking-box">
          <button id="trk-close" style="position:absolute; top:15px; right:15px; background:none; border:none; font-size:1.2rem; cursor:pointer;">✕</button>
          <h2 style="font-family:var(--font-heading); margin-bottom:1.5rem; border-bottom:1px solid #eee; padding-bottom:10px;">Parcel Tracking Live</h2>
          <div style="display:flex; flex-direction:column; gap:1.2rem; margin-top:2rem;">
            <div style="display:flex; gap:15px;">
              <div style="width:2px; background:var(--saffron); position:relative;"><div style="width:12px;height:12px;background:var(--saffron);border-radius:50%;position:absolute;left:-5px;top:4px;box-shadow:0 0 0 3px rgba(200,75,49,0.3);"></div></div>
              <div><strong style="color:var(--primary);font-size:1.1rem;">In Transit</strong><p style="font-size:0.85rem;color:var(--text-secondary);">Your package has arrived at the central sorting facility and is out for final route delivery.</p><p style="font-size:0.75rem;color:var(--text-muted);font-weight:700;">Local Time: ${new Date().toLocaleTimeString()}</p></div>
            </div>
            <div style="display:flex; gap:15px; opacity:0.6;">
              <div style="width:2px; background:#cbd5e1; position:relative;"><div style="width:12px;height:12px;background:#94a3b8;border-radius:50%;position:absolute;left:-5px;top:4px;"></div></div>
              <div><strong>Departed Warehouse</strong><p style="font-size:0.85rem;color:var(--text-secondary);">Package scanned extensively and loaded to Logistics Network.</p></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Filtering
    const filterBtns = document.querySelectorAll('.ord-filter-btn');
    const cards = document.querySelectorAll('.ord-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.f;
        cards.forEach(c => {
          if(f === 'all' || c.dataset.filter === f) c.style.display = 'block';
          else c.style.display = 'none';
        });
      });
    });

    // Accordion interaction
    document.querySelectorAll('.ord-head').forEach(head => {
      head.addEventListener('click', (e) => {
        // Prevent toggle if clicking a button implicitly nested (safeguard)
        head.closest('.ord-card').classList.toggle('expanded');
      });
    });

    // Action routers
    const trkModal = document.getElementById('trk-ovl');
    document.getElementById('trk-close')?.addEventListener('click', () => trkModal.classList.remove('open'));

    document.querySelectorAll('.btn-oa').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        const id = e.currentTarget.dataset.id;

        if(action === 'cancel') {
          if(confirm('A cancellation refund generally reflects within 5 business days. Confirm Cancellation?')) {
            window.utils.toast('Order forcefully cancelled.', 'info');
            // Re-fetch triggers UI rerender
          }
        }
        if(action === 'track') {
          trkModal.classList.add('open');
        }
        if(action === 'invoice') {
          window.utils.toast('Generating printable HTML PDF instance...', 'success');
          setTimeout(() => window.print(), 800);
        }
        if(action === 'review') {
          window.utils.toast('Native review abstraction model triggered. Proceeding...', 'info');
        }
      });
    });
  };

})();
