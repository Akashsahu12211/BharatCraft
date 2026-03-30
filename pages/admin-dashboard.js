/* ============================================================
   ADMIN DASHBOARD PAGE (js/pages/admin-dashboard.js)
============================================================ */

(function() {

  window.renderAdminPage = async (app) => {
    
    // Auth Role Guard
    if(!window.authModule?.user) {
       window.utils.toast('Access Denied. Please log in first.', 'error');
       return window.router.navigate('/auth');
    }
    
    // Check if admin role via local claim cache for demo
    const userRole = localStorage.getItem('bharatcraft_role') || 'admin'; // mock active role
    if(userRole !== 'admin') {
       window.utils.toast('Critical Error: Unauthorized Access Blocked. Admin privileges required.', 'error');
       return window.router.navigate('/'); // Boot them
    }

    const usr = window.authModule.user;

    // Build the Dashboard HTML skeleton reusing dashboard.css architecture
    app.innerHTML = `
      <div class="dashboard-layout animate-in">
        
        <!-- Desktop Sidebar -->
        <aside class="dash-sidebar" style="border-right: 1px solid #e2e8f0; background: #0f172a;">
          <div class="dash-user-head" style="border-bottom: 1px solid #1e293b;">
            <img src="${usr.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}" alt="Admin" style="border-color:#38bdf8;">
            <div>
              <h3 style="color:#f8fafc;">${usr.displayName || 'System Admin'}</h3>
              <span style="color:#94a3b8;">Superuser</span>
            </div>
          </div>
          <nav class="dash-nav admin-nav">
            <!-- Inline CSS for dark sidebar nav specifically for admin to differentiate from artisan -->
            <style>
              .admin-nav .dash-nav-btn { color: #94a3b8; }
              .admin-nav .dash-nav-btn:hover { background: #1e293b; color: #f8fafc; }
              .admin-nav .dash-nav-btn.active { background: #38bdf8; color: #0f172a; font-weight: 800; }
            </style>
            <button class="dash-nav-btn active" data-tab="adm-analytics"><span class="icon">📊</span> Analytics</button>
            <button class="dash-nav-btn" data-tab="adm-artisans"><span class="icon">🎨</span> Artisans Approval</button>
            <button class="dash-nav-btn" data-tab="adm-users"><span class="icon">👥</span> Users</button>
            <button class="dash-nav-btn" data-tab="adm-products"><span class="icon">📦</span> Products Mods</button>
            <button class="dash-nav-btn" data-tab="adm-orders"><span class="icon">📋</span> Platform Orders</button>
            <button class="dash-nav-btn" data-tab="adm-reports"><span class="icon">🚨</span> Reports Queue</button>
            <button class="dash-nav-btn" data-tab="adm-settings" style="margin-top:auto;"><span class="icon">⚙️</span> Settings</button>
          </nav>
        </aside>

        <!-- Mobile Bottom Nav -->
        <nav class="dash-mobile-nav" style="background:#0f172a; border-top:1px solid #1e293b;">
          <style>
            .admin-mob .dm-nav-btn { color: #64748b; }
            .admin-mob .dm-nav-btn.active { color: #38bdf8; }
          </style>
          <div class="dash-mobile-nav admin-mob">
             <button class="dm-nav-btn active" data-tab="adm-analytics"><span class="icon">📊</span> Stats</button>
             <button class="dm-nav-btn" data-tab="adm-artisans"><span class="icon">🎨</span> Artisans</button>
             <button class="dm-nav-btn" data-tab="adm-users"><span class="icon">👥</span> Users</button>
             <button class="dm-nav-btn" data-tab="adm-products"><span class="icon">📦</span> Prods</button>
             <button class="dm-nav-btn" data-tab="adm-orders"><span class="icon">📋</span> Orders</button>
          </div>
        </nav>

        <!-- Main Content Area -->
        <main class="dash-main">
          
          <!-- ANALYTICS TAB -->
          <div class="dash-tab-content active" id="adm-analytics">
            <div class="dash-header">
              <h1>Platform Analytics</h1>
              <button class="btn btn-primary" style="background:#0f172a;">Generate PDF Report</button>
            </div>
            
            <div class="d-stats-grid">
              <div class="d-stat-card">
                <span class="d-stat-label">Total Users</span>
                <span class="d-stat-val">12,450</span>
              </div>
              <div class="d-stat-card">
                <span class="d-stat-label">Verified Artisans</span>
                <span class="d-stat-val" style="color:#f39c12;">432</span>
              </div>
              <div class="d-stat-card">
                <span class="d-stat-label">Total Products</span>
                <span class="d-stat-val" style="color:#0284c7;">3,912</span>
              </div>
              <div class="d-stat-card revenue">
                <span class="d-stat-label">M-o-M Revenue</span>
                <span class="d-stat-val">₹82.4L</span>
              </div>
            </div>

            <div class="d-cards-row">
              <div class="d-panel">
                 <h3>User Growth (30 Days)</h3>
                 <div class="chart-container">
                    <canvas id="growthChart"></canvas>
                 </div>
              </div>
              <div class="d-panel">
                 <h3>Top Performers (Products / Artisans)</h3>
                 <div style="margin-bottom:1.5rem;">
                   <h4 style="font-size:0.9rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px;">Top 3 Products</h4>
                   <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:6px; font-size:0.95rem;"><span>1. Kutch Embroidery Shawl</span><span style="color:#2ECC71;">412 ord.</span></div>
                   <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:6px; font-size:0.95rem;"><span>2. Terracotta Tea Set</span><span style="color:#2ECC71;">389 ord.</span></div>
                   <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.95rem;"><span>3. Warli Painting Frame</span><span style="color:#2ECC71;">245 ord.</span></div>
                 </div>
                 <h4 style="font-size:0.9rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px;">Top 2 Artisans</h4>
                 <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:6px; font-size:0.95rem;"><span>1. Ramesh Potter</span><span style="color:#f39c12;">₹12.4L</span></div>
                 <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.95rem;"><span>2. Sunita Devi</span><span style="color:#f39c12;">₹9.8L</span></div>
              </div>
            </div>
          </div>

          <!-- ARTISANS APPROVAL TAB -->
          <div class="dash-tab-content" id="adm-artisans">
            <div class="dash-header">
              <h1>Artisan Approvals</h1>
              <input type="text" placeholder="Search applications..." style="padding:10px 15px; border-radius:8px; border:1px solid var(--border-strong); min-width:300px;">
            </div>
            
            <div class="d-table-wrap" style="margin-bottom:2rem;">
              <h3 style="padding:1.5rem 1.5rem 0; font-family:var(--font-heading); font-size:1.3rem;">Pending Review Queue</h3>
              <table class="d-table" style="margin-top:1rem;">
                <thead>
                  <tr>
                    <th>Artisan Name</th>
                    <th>Email</th>
                    <th>Primary Craft</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="adm-pending-list">
                  <tr>
                    <td><div style="font-weight:700;">Arjun Craftsman</div><div style="font-size:0.8rem;color:var(--text-muted);">Applied 2 days ago</div></td>
                    <td>arjun@crafts.com</td><td>Woodwork</td><td>Saharanpur, UP</td>
                    <td>
                      <button class="btn btn-primary" style="padding:6px 12px; font-size:0.85rem; margin-right:6px;" onclick="window.utils.toast('Approved! Email dispatched.', 'success')">✓ Approve</button>
                      <button class="btn btn-outline" style="padding:6px 12px; font-size:0.85rem; color:var(--crimson); border-color:var(--crimson);" onclick="window.utils.toast('Application Rejected and removed.', 'error')">✗ Reject</button>
                    </td>
                  </tr>
                  <tr>
                    <td><div style="font-weight:700;">Meera Textiles</div><div style="font-size:0.8rem;color:var(--text-muted);">Applied 5 hours ago</div></td>
                    <td>meera@looms.in</td><td>Handlooms</td><td>Kanchipuram, TN</td>
                    <td>
                      <button class="btn btn-primary" style="padding:6px 12px; font-size:0.85rem; margin-right:6px;" onclick="window.utils.toast('Approved! Email dispatched.', 'success')">✓ Approve</button>
                      <button class="btn btn-outline" style="padding:6px 12px; font-size:0.85rem; color:var(--crimson); border-color:var(--crimson);" onclick="window.utils.toast('Application Rejected and removed.', 'error')">✗ Reject</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="d-table-wrap">
              <h3 style="padding:1.5rem 1.5rem 0; font-family:var(--font-heading); font-size:1.3rem;">Active Artisans Masterlist</h3>
              <table class="d-table" style="margin-top:1rem;">
                <thead><tr><th>Name</th><th>Verification</th><th>Suspension</th></tr></thead>
                <tbody>
                  <tr><td>Ramesh Potter</td><td><span class="badge" style="background:#dcfce7; color:#166534;">Verified</span></td><td><button class="btn-dt-action" style="color:var(--crimson);">Suspend Account</button></td></tr>
                  <tr><td>Sunita Devi</td><td><span class="badge" style="background:#dcfce7; color:#166534;">Verified</span></td><td><button class="btn-dt-action" style="color:var(--crimson);">Suspend Account</button></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- USERS TAB -->
          <div class="dash-tab-content" id="adm-users">
             <div class="dash-header">
               <h1>User Directory</h1>
             </div>
             <div class="d-table-wrap">
              <table class="d-table">
                <thead><tr><th>User (Name & Email)</th><th>Role</th><th>Joined</th><th>Orders</th><th>Actions</th></tr></thead>
                <tbody>
                  <tr>
                    <td><div style="font-weight:700;">Customer Bob</div><div style="font-size:0.85rem;color:var(--text-muted);">bob@demo.com</div></td>
                    <td><span class="badge" style="background:#e2e8f0; color:#475569;">Customer</span></td>
                    <td>Oct 12, 2025</td><td>14</td>
                    <td><button class="btn-dt-action">Reset Pwd</button> <button class="btn-dt-action" style="color:var(--crimson);">Ban User</button></td>
                  </tr>
                  <tr>
                    <td><div style="font-weight:700;">Customer Alice</div><div style="font-size:0.85rem;color:var(--text-muted);">alice@demo.com</div></td>
                    <td><span class="badge" style="background:#e2e8f0; color:#475569;">Customer</span></td>
                    <td>Nov 01, 2025</td><td>2</td>
                    <td><button class="btn-dt-action">Reset Pwd</button> <button class="btn-dt-action" style="color:var(--crimson);">Ban User</button></td>
                  </tr>
                </tbody>
              </table>
             </div>
             <div style="text-align:center; margin-top:1.5rem;"><button class="btn btn-outline">Load Next 20 Users...</button></div>
          </div>

          <!-- PRODUCTS TAB -->
          <div class="dash-tab-content" id="adm-products">
             <div class="dash-header">
               <h1>Products Moderation</h1>
             </div>
             <div class="d-table-wrap">
              <table class="d-table">
                <thead><tr><th>Item</th><th>Artisan Ref</th><th>Status</th><th>Promotion</th><th>Actions</th></tr></thead>
                <tbody>
                  <tr>
                    <td><div class="dt-prod-cell"><img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=100&q=80" class="dt-img"><span class="dt-name">Handpainted Clay Vase</span></div></td>
                    <td>#ART-Ramesh</td>
                    <td><span class="badge" style="background:#dcfce7; color:#166534;">Live</span></td>
                    <td><label class="switch-toggle"><input type="checkbox" checked onclick="window.utils.toast('Featured toggle updated', 'info')"> Featured Flag</label></td>
                    <td><button class="btn-dt-action" style="color:var(--crimson);">Remove from site</button></td>
                  </tr>
                  <tr>
                    <td><div class="dt-prod-cell"><img src="https://images.unsplash.com/photo-1605814512351-a0833a6ea21c?auto=format&fit=crop&w=100&q=80" class="dt-img"><span class="dt-name">Silk Embroidered Scarf</span></div></td>
                    <td>#ART-Sunita</td>
                    <td><span class="badge" style="background:#dcfce7; color:#166534;">Live</span></td>
                    <td><label class="switch-toggle"><input type="checkbox" onclick="window.utils.toast('Featured toggle updated', 'info')"> Featured Flag</label></td>
                    <td><button class="btn-dt-action" style="color:var(--crimson);">Remove from site</button></td>
                  </tr>
                </tbody>
              </table>
             </div>
          </div>

          <!-- ORDERS TAB -->
          <div class="dash-tab-content" id="adm-orders">
             <div class="dash-header">
               <h1>Platform Orders</h1>
             </div>
             <div class="orders-filters">
                <button class="of-btn active">All Orders (Global)</button>
                <button class="of-btn">Requires Dispute Rest</button>
                <button class="of-btn">Refund Queued</button>
             </div>
             <div class="d-table-wrap">
              <table class="d-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Value</th><th>Status</th><th>Dispute UI</th></tr></thead>
                <tbody>
                  <tr>
                    <td>#PLAT-4829</td><td>bob@demo.com</td><td>₹1,400</td>
                    <td><span class="badge" style="background:#bbf7d0; color:#166534;">Delivered</span></td>
                    <td><button class="btn-dt-action">Open Dispute Panel</button></td>
                  </tr>
                  <tr>
                    <td>#PLAT-4830</td><td>alice@demo.com</td><td>₹12,400</td>
                    <td><span class="badge" style="background:#fef08a; color:#854d0e;">Pending Fulfillment</span></td>
                    <td><button class="btn-dt-action">Open Dispute Panel</button></td>
                  </tr>
                </tbody>
              </table>
             </div>
          </div>

          <!-- REPORTS & FLAGS TAB -->
          <div class="dash-tab-content" id="adm-reports">
             <div class="dash-header">
               <h1>Flagged Reports Center</h1>
             </div>
             <div class="cr-card" style="border-left-color:var(--crimson);">
                  <h3>Flag: Inappropriate Product Image <span>1 hour ago</span></h3>
                  <div class="cr-meta"><span>Reporter: bob@demo.com</span> <span>Target: Product #829</span> <span>Severity: High</span></div>
                  <div class="cr-desc">"The image uploaded by this user contains a watermark for a different competing store and appears stolen."</div>
                  <div class="cr-actions">
                    <button class="btn btn-outline" style="color:var(--primary); border-color:var(--primary);">Keep Content (Dismiss)</button>
                    <button class="btn btn-outline" style="color:var(--crimson); border-color:var(--crimson);">Force Remove Product</button>
                    <button class="btn btn-primary" style="background:var(--crimson);">Warn Artisan</button>
                  </div>
             </div>
          </div>

          <!-- SETTINGS -->
          <div class="dash-tab-content" id="adm-settings">
            <div class="dash-header"><h1>System Config</h1></div>
            <div class="d-panel" style="max-width:600px;">
               <div class="d-form-group" style="margin-bottom:1.5rem;">
                 <label>Global Platform Status</label>
                 <select><option>Online & Healthy</option><option>Maintenance Mode (Locked)</option></select>
                 <button class="btn btn-primary" style="margin-top:10px;">Enforce Rule</button>
               </div>
               <hr style="border:0; border-top:1px dashed var(--border); margin:2rem 0;">
               <div style="padding:1.5rem; background:#fee2e2; border-radius:8px; border:1px solid #fca5a5;">
                 <h4 style="color:#b91c1c; margin-bottom:10px;">Critical System Action</h4>
                 <p style="font-size:0.9rem; color:#991b1b; margin-bottom:15px;">Flushing the master cache will momentarily restart firestore read instances forcing clients to drop local data syncs.</p>
                 <button class="btn" style="background:#dc2626; color:white;">Flush Cache Databases</button>
               </div>
            </div>
          </div>

        </main>
      </div>
    `;

    // Tab Navigation Logic
    const tabs = document.querySelectorAll('.dash-sidebar .dash-nav-btn, .admin-mob .dm-nav-btn');
    const contents = document.querySelectorAll('.dash-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
        contents.forEach(c => c.classList.toggle('active', c.id === target));
      });
    });

    // Chart.js Bindings
    setTimeout(() => {
      if(window.Chart && document.getElementById('growthChart')) {
        const ctx = document.getElementById('growthChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['1st', '5th', '10th', '15th', '20th', '25th', '30th'],
            datasets: [{
              label: 'Active Daily Users',
              data: [8000, 8200, 8500, 9100, 10200, 11500, 12450],
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: false, grid: { color: '#f1f5f9' } },
              x: { grid: { display: false } }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }, 500);

  };

})();
