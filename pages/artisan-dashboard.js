/* ============================================================
   ARTISAN DASHBOARD PAGE (js/pages/artisan-dashboard.js)
============================================================ */

(function() {

  window.renderDashboardPage = async (app) => {
    
    // Auth Role Guard
    if(!window.authModule?.user) {
       window.utils.toast('Access Denied. Please log in as an Artisan.', 'error');
       return window.router.navigate('/auth');
    }
    
    // Assume user is ok if logged in for this scope, ideal check: window.authModule.role === 'artisan'
    const userRole = localStorage.getItem('bharatcraft_role') || 'artisan'; // mock active role
    if(userRole !== 'artisan' && userRole !== 'admin') {
       window.utils.toast('Only verified artisans can access the dashboard port.', 'error');
       // In real flow, redirect to /profile
    }

    const usr = window.authModule.user;

    // Build the Dashboard HTML skeleton
    app.innerHTML = `
      <div class="dashboard-layout animate-in">
        
        <!-- Desktop Sidebar -->
        <aside class="dash-sidebar">
          <div class="dash-user-head">
            <img src="${usr.photoURL || 'https://i.pravatar.cc/150?u='+usr.uid}" alt="Artisan">
            <div>
              <h3>${usr.displayName || 'Artisan Seller'}</h3>
              <span>Dashboard</span>
            </div>
          </div>
          <nav class="dash-nav">
            <button class="dash-nav-btn active" data-tab="tab-overview"><span class="icon">📊</span> Overview</button>
            <button class="dash-nav-btn" data-tab="tab-products"><span class="icon">📦</span> Products Catalog</button>
            <button class="dash-nav-btn" data-tab="tab-orders"><span class="icon">🛒</span> Order Manager</button>
            <button class="dash-nav-btn" data-tab="tab-requests"><span class="icon">✉️</span> Custom Requests</button>
            <button class="dash-nav-btn" data-tab="tab-profile"><span class="icon">📍</span> My Profile Config</button>
            <button class="dash-nav-btn" data-tab="tab-settings" style="margin-top:auto;"><span class="icon">⚙️</span> Settings</button>
          </nav>
        </aside>

        <!-- Mobile Bottom Nav -->
        <nav class="dash-mobile-nav">
          <button class="dm-nav-btn active" data-tab="tab-overview"><span class="icon">📊</span> Home</button>
          <button class="dm-nav-btn" data-tab="tab-products"><span class="icon">📦</span> Products</button>
          <button class="dm-nav-btn" data-tab="tab-orders"><span class="icon">🛒</span> Orders</button>
          <button class="dm-nav-btn" data-tab="tab-requests"><span class="icon">✉️</span> Requests</button>
          <button class="dm-nav-btn" data-tab="tab-profile"><span class="icon">📍</span> Profile</button>
        </nav>

        <!-- Main Content Area -->
        <main class="dash-main">
          
          <!-- OVERVIEW TAB -->
          <div class="dash-tab-content active" id="tab-overview">
            <div class="dash-header">
              <h1>Dashboard Overview</h1>
              <button class="btn btn-primary" id="btn-quick-add">⊕ Add New Product</button>
            </div>
            
            <div class="d-stats-grid">
              <div class="d-stat-card revenue">
                <span class="d-stat-label">Total Revenue</span>
                <span class="d-stat-val">₹4,25,000</span>
              </div>
              <div class="d-stat-card">
                <span class="d-stat-label">Total Orders</span>
                <span class="d-stat-val">342</span>
              </div>
              <div class="d-stat-card">
                <span class="d-stat-label">Products Listed</span>
                <span class="d-stat-val">18</span>
              </div>
              <div class="d-stat-card">
                <span class="d-stat-label">Average Rating</span>
                <span class="d-stat-val">4.9 <span style="font-size:1.2rem;color:#f39c12;">★</span></span>
              </div>
            </div>

            <div class="d-cards-row">
              <div class="d-panel">
                 <h3>Revenue (Last 7 Days)</h3>
                 <div class="chart-container">
                    <canvas id="revenueChart"></canvas>
                 </div>
              </div>
              <div class="d-panel">
                 <h3>Recent Orders</h3>
                 <div id="overview-orders-list">
                    <!-- Populated by JS -->
                 </div>
                 <button class="btn btn-outline" style="width:100%; margin-top:1rem;" id="btn-view-all-orders">View All Orders →</button>
              </div>
            </div>
          </div>

          <!-- PRODUCTS TAB -->
          <div class="dash-tab-content" id="tab-products">
            <div class="dash-header">
              <h1>Products Catalog</h1>
              <button class="btn btn-primary" id="btn-open-prod-modal">⊕ Add New Product</button>
            </div>
            <div class="d-table-wrap">
              <table class="d-table">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="dash-products-tbody">
                  <!-- Hardcoded demo array representing DB -->
                  <tr>
                    <td><div class="dt-prod-cell"><img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=100&q=80" class="dt-img"><span class="dt-name">Handpainted Clay Vase</span></div></td>
                    <td>Pottery</td><td>₹1,200</td><td><span style="color:#2ECC71;font-weight:700;">45</span></td>
                    <td><span class="badge" style="background:#dcfce7; color:#166534;">Active</span></td>
                    <td><div class="dt-actions"><button class="btn-dt-action">Edit</button><button class="btn-dt-action" style="color:var(--crimson);">Delete</button></div></td>
                  </tr>
                  <tr>
                    <td><div class="dt-prod-cell"><img src="https://images.unsplash.com/photo-1605814512351-a0833a6ea21c?auto=format&fit=crop&w=100&q=80" class="dt-img"><span class="dt-name">Silk Embroidered Scarf</span></div></td>
                    <td>Textiles</td><td>₹2,500</td><td><span style="color:var(--crimson);font-weight:700;">2</span></td>
                    <td><span class="badge" style="background:#fef08a; color:#854d0e;">Low Stock</span></td>
                    <td><div class="dt-actions"><button class="btn-dt-action">Edit</button><button class="btn-dt-action" style="color:var(--crimson);">Delete</button></div></td>
                  </tr>
                  <tr>
                     <td colspan="6" style="text-align:center;color:var(--text-muted);padding:2rem;">Remaining items fetched dynamically from backend.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ORDERS TAB -->
          <div class="dash-tab-content" id="tab-orders">
             <div class="dash-header">
               <h1>Order Manager</h1>
             </div>
             <div class="orders-filters">
                <button class="of-btn active">All Orders</button>
                <button class="of-btn">Pending</button>
                <button class="of-btn">Processing</button>
                <button class="of-btn">Shipped</button>
                <button class="of-btn">Delivered</button>
             </div>
             <div id="dash-orders-list">
                <!-- Demo Orders -->
                <div class="d-order-card">
                  <div class="doc-top">
                    <div><span class="doc-id">ORDER #BC-5092A</span> <span class="badge bg-pend" style="margin-left:10px;">Pending</span></div>
                    <div class="doc-date">Placed: Oct 25, 2025 • 14:30 IST</div>
                  </div>
                  <div class="doc-mid">
                    <div class="doc-details">
                       <h4>Items Ordered</h4>
                       <div class="doc-item-row"><img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=100&q=80"> 1x Handpainted Clay Vase (₹1,200)</div>
                       <br><h4>Shipping Address</h4>
                       <p style="font-size:0.95rem; line-height:1.5;">Rohan Gupta<br>14, Lotus Apartment, Sector 5<br>Jaipur, Rajasthan, 302001<br>Ph: +91 9876543210</p>
                    </div>
                    <div class="doc-totals">
                       <h4>Payment Summary</h4>
                       <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.95rem;"><span>Subtotal</span><span>₹1,200</span></div>
                       <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.95rem;"><span>Shipping</span><span>Free</span></div>
                       <div style="display:flex; justify-content:space-between; border-top:1px solid #ccc; padding-top:6px; font-weight:800; font-size:1.1rem; color:var(--text-primary); margin-top:6px;"><span>Total Paid</span><span>₹1,200</span></div>
                       <div style="margin-top:10px; font-size:0.8rem; color:var(--text-muted);">Method: PREPAID (UPI)</div>
                    </div>
                  </div>
                  <div class="doc-actions">
                    <select style="padding:8px; border-radius:6px; border:1px solid var(--border-strong);">
                      <option>Mark as Processing</option>
                      <option>Mark as Shipped</option>
                      <option>Cancel Order</option>
                    </select>
                    <button class="btn btn-primary" onclick="window.utils.toast('Tracking Number requested!', 'info')">Update Status</button>
                  </div>
                </div>
             </div>
          </div>

          <!-- CUSTOM REQUESTS TAB -->
          <div class="dash-tab-content" id="tab-requests">
             <div class="dash-header">
               <h1>Custom Requests Hub</h1>
             </div>
             <div>
               <div class="cr-card">
                  <h3>Commission: Wooden Wall Frame <span>2 hours ago</span></h3>
                  <div class="cr-meta"><span>By: Ananya Sharma</span> <span>Budget: ₹5,000 - ₹15,000</span> <span>Need By: Nov 15, 2025</span></div>
                  <div class="cr-desc">"I am looking for a large 4x3ft wooden carved frame tracing the design of ancient temple pillars. Needs a deep mahogany finish to match our living room. Please let me know if this is achievable!"</div>
                  <div class="cr-actions">
                    <button class="btn btn-primary" onclick="window.utils.toast('Accepted! Linking to messaging gateway...', 'success')">✓ Accept & Message</button>
                    <button class="btn btn-outline" style="color:var(--crimson); border-color:var(--crimson);">Decline</button>
                  </div>
               </div>
             </div>
          </div>

          <!-- PROFILE TAB -->
          <div class="dash-tab-content" id="tab-profile">
            <div class="dash-header">
               <h1>Configure Artisan Profile</h1>
               <button class="btn btn-primary">Save Changes</button>
            </div>
            <div class="d-panel">
               <div class="d-form-grid">
                 <div class="d-form-group">
                   <label>Public Shop Name</label>
                   <input type="text" value="${usr.displayName}">
                 </div>
                 <div class="d-form-group">
                   <label>Primary Craft Type</label>
                   <input type="text" value="Pottery & Ceramics">
                 </div>
                 <div class="d-form-group fg-full">
                   <label>Store Biography / Heritage Story</label>
                   <textarea>Inheriting the art of wheel throwing from generations...</textarea>
                 </div>
                 <div class="d-form-group fg-full">
                   <label>Workshop Location (Pin on Map for Visitors)</label>
                   <div class="d-map-picker">
                     <div class="d-map-picker-mask" onclick="window.utils.toast('Google Maps Geolocation Picker activated', 'info'); this.style.opacity='0';">Tap to Pin Coordinates 📍</div>
                     <iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=India&key=YOUR_GOOGLE_MAPS_EMBED_KEY" allowfullscreen></iframe>
                   </div>
                   <p style="font-size:0.8rem; color:var(--text-muted); margin-top:8px;">Setting this active pushes your profile automatically to the Global Map Discovery feature.</p>
                 </div>
               </div>
            </div>
          </div>

          <!-- SETTINGS -->
          <div class="dash-tab-content" id="tab-settings">
            <div class="dash-header"><h1>Account Settings</h1></div>
            <div class="d-panel" style="max-width:600px;">
               <div class="d-form-group" style="margin-bottom:1.5rem;">
                 <label>Change Login Password</label>
                 <input type="password" placeholder="New Password">
                 <button class="btn btn-outline" style="margin-top:10px;">Update Password</button>
               </div>
               <hr style="border:0; border-top:1px dashed var(--border); margin:2rem 0;">
               <div class="d-form-group" style="margin-bottom:1.5rem;">
                 <label>Email Notification Preferences</label>
                 <label style="display:flex; align-items:center; gap:10px; font-weight:normal; margin-top:10px;"><input type="checkbox" checked> New Order Alerts</label>
                 <label style="display:flex; align-items:center; gap:10px; font-weight:normal; margin-top:10px;"><input type="checkbox" checked> Custom Request Incoming Alerts</label>
                 <label style="display:flex; align-items:center; gap:10px; font-weight:normal; margin-top:10px;"><input type="checkbox"> Marketing & Platform Updates</label>
               </div>
               <hr style="border:0; border-top:1px dashed var(--border); margin:2rem 0;">
               <div style="padding:1.5rem; background:#fee2e2; border-radius:8px; border:1px solid #fca5a5;">
                 <h4 style="color:#b91c1c; margin-bottom:10px;">Danger Zone</h4>
                 <p style="font-size:0.9rem; color:#991b1b; margin-bottom:15px;">Deleting your artisan account will permanently remove your shop, catalogue, and disable active map routing.</p>
                 <button class="btn" style="background:#dc2626; color:white;">Delete Account Permanently</button>
               </div>
            </div>
          </div>

        </main>
      </div>

      <!-- Add Product Modal Form -->
      <div class="d-modal-overlay" id="add-product-modal">
        <div class="d-modal-panel">
          <div class="d-modal-header">
            <h2>Add New Masterpiece</h2>
            <button class="d-modal-close" id="close-modal-btn">✕</button>
          </div>
          <div class="d-modal-body">
            <form class="d-form-grid">
               <div class="d-form-group fg-full">
                 <label>Product Title</label>
                 <input type="text" placeholder="e.g. Hand-carved Sheesham Table" required>
               </div>
               <div class="d-form-group">
                 <label>Category</label>
                 <select><option>Woodwork</option><option>Pottery</option><option>Textiles</option><option>Paintings</option><option>Jewelry</option></select>
               </div>
               <div class="d-form-group">
                 <label>Stock Quantity</label>
                 <input type="number" value="1" min="1">
               </div>
               <div class="d-form-group">
                 <label>Selling Price (₹)</label>
                 <input type="number" required placeholder="e.g. 4500">
               </div>
               <div class="d-form-group">
                 <label>Original Price (₹) for Discount tag</label>
                 <input type="number" placeholder="Optional">
               </div>
               <div class="d-form-group fg-full">
                 <label>Short Description (limit 500 chars)</label>
                 <textarea placeholder="Describe the crafting style, material, etc..." maxlength="500" style="min-height:80px;"></textarea>
               </div>
               <div class="d-form-group fg-full">
                 <label>Cultural Story (Optional Tab Data)</label>
                 <textarea placeholder="Tell your customer the heritage history behind this piece..." style="min-height:100px;"></textarea>
               </div>
               
               <div class="d-form-group fg-full">
                 <label>Upload High-Quality Images (Max 4)</label>
                 <div class="d-dropzone" id="dz-upload">
                   <div class="d-dz-icon">📷</div>
                   <div class="d-dz-text">Drag & Drop images here<br>or <span style="color:var(--saffron);text-decoration:underline;">Browse files</span></div>
                   <input type="file" multiple accept="image/*" class="d-file-input" id="dz-file-input">
                 </div>
                 <div class="d-dz-preview" id="dz-preview"></div>
               </div>

               <div class="d-form-group fg-full">
                 <label>Status</label>
                 <select><option>Active (Published)</option><option>Draft (Hidden)</option></select>
               </div>
            </form>
          </div>
          <div class="d-modal-footer">
            <button class="btn btn-outline" style="border:none;" id="btn-cancel-modal">Cancel</button>
            <button class="btn btn-primary" onclick="window.utils.toast('Product compiled securely and dispatched to fbDB', 'success'); document.getElementById('add-product-modal').classList.remove('open');">Upload Product</button>
          </div>
        </div>
      </div>
    `;

    // Tab Navigation Logic
    const tabs = document.querySelectorAll('.dash-nav-btn, .dm-nav-btn');
    const contents = document.querySelectorAll('.dash-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
        contents.forEach(c => c.classList.toggle('active', c.id === target));
      });
    });

    // Quick Action Navigators
    document.getElementById('btn-view-all-orders').addEventListener('click', () => {
      document.querySelector('[data-tab="tab-orders"]').click();
    });
    
    const productModal = document.getElementById('add-product-modal');
    const openModal = () => productModal.classList.add('open');
    const closeModal = () => productModal.classList.remove('open');
    
    document.getElementById('btn-quick-add').addEventListener('click', openModal);
    document.getElementById('btn-open-prod-modal').addEventListener('click', openModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('btn-cancel-modal').addEventListener('click', closeModal);
    
    // Drag & Drop Image Logic Demo
    const dz = document.getElementById('dz-upload');
    const fileIn = document.getElementById('dz-file-input');
    const preview = document.getElementById('dz-preview');
    
    dz.addEventListener('click', () => fileIn.click());
    dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', (e) => {
      e.preventDefault(); dz.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
    fileIn.addEventListener('change', () => handleFiles(fileIn.files));
    
    function handleFiles(files) {
      if(preview.children.length >= 4) return window.utils.toast('Max 4 images allowed.', 'error');
      Array.from(files).slice(0, 4 - preview.children.length).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const div = document.createElement('div');
          div.className = 'dz-img-box';
          div.innerHTML = `<img src="${e.target.result}"><button class="dz-img-remove">x</button>`;
          div.querySelector('.dz-img-remove').addEventListener('click', (ev) => { ev.stopPropagation(); div.remove(); });
          preview.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    }

    // Chart.js Bindings
    setTimeout(() => {
      if(window.Chart && document.getElementById('revenueChart')) {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Daily Revenue (₹)',
              data: [12000, 19000, 3000, 5000, 24000, 32000, 29000],
              backgroundColor: '#c84b31',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
              x: { grid: { display: false } }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }, 500);

    // Populate Overview Recent Mini-orders
    const miniOrders = [
      { id: '#BC-5092A', cust: 'Rohan Gupta', amt: '₹1,200', stat: 'Pending', cls: 'bg-pend' },
      { id: '#BC-5088X', cust: 'Meera Patel', amt: '₹4,500', stat: 'Shipped', cls: 'bg-ship' },
      { id: '#BC-5077K', cust: 'Vikram Singh', amt: '₹9,200', stat: 'Delivered', cls: 'bg-del' }
    ];
    document.getElementById('overview-orders-list').innerHTML = miniOrders.map(o => `
      <div class="mini-order">
         <div class="mo-left"><span class="mo-id">${o.id}</span><span class="mo-cust">${o.cust}</span></div>
         <div class="mo-right"><span class="mo-amt">${o.amt}</span><span class="badge ${o.cls}">${o.stat}</span></div>
      </div>
    `).join('');

  };

})();
