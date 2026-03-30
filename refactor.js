const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/abhis/OneDrive/Desktop/BharatCart';

const mappings = [
  { file: 'pages/wishlist-page.js', route: "'/wishlist'", func: 'renderWishlistPage' },
  { file: 'pages/products.js', route: "'/products'", func: 'renderProductsPage' },
  { file: 'pages/product-detail.js', route: "'/product/:id'", func: 'renderProductDetailPage' },
  { file: 'pages/orders.js', route: "'/orders'", func: 'renderOrdersPage' },
  { file: 'pages/map-view.js', route: "'/map'", func: 'renderMapPage' },
  { file: 'pages/home.js', route: "'/'", func: 'renderHomePage' },
  { file: 'pages/checkout.js', route: "'/checkout'", func: 'renderCheckoutPage' },
  { file: 'pages/cart-page.js', route: "'/cart'", func: 'renderCartPage' },
  { file: 'pages/auth-page.js', route: "'/auth'", func: 'renderAuthPage' },
  { file: 'pages/artisan-profile.js', route: "'/artisan/:id'", func: 'renderArtisanProfilePage' },
  { file: 'pages/artisan-dashboard.js', route: "'/dashboard'", func: 'renderDashboardPage' },
  { file: 'pages/admin-dashboard.js', route: "'/admin'", func: 'renderAdminPage' },
  { file: 'js/search.js', route: "'/search'", func: 'renderSearchPage' },
  { file: 'js/search.js', route: "'/404'", func: 'render404Page' }
];

for (const map of mappings) {
  const filePath = path.join(dir, map.file);
  if (!fs.existsSync(filePath)) continue;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Escape regex special chars in route
  const routeRegexStr = map.route.replace(/'/g, "\\'");
  
  // Find: window.router.register('/route', async (app, params) => {
  // Replace: window.funcName = async (app, params) => {
  const regex = new RegExp(`window\\.router\\.register\\(\\s*${map.route.replace(/'/g, "['\\\"]")}\\s*,\\s*(async\\s*\\([^)]*\\)\\s*=>\\s*\\{)`);
  
  // check if matches
  const match = code.match(regex);
  if (match) {
    code = code.replace(regex, `window.${map.func} = $1`);
    
    // Now we need to find the matching '});' that closed this register call.
    // A simple heuristic for these specific files is to find the LAST '});' in the file
    // for single-route files. But search.js has two routes!
    if (map.file === 'js/search.js') {
      // For search.js, replace the FIRST '});' after the replacement index.
      const matchIdx = code.indexOf(`window.${map.func} = async`);
      const closeIdx = code.indexOf('});', matchIdx);
      if (closeIdx !== -1) {
        code = code.substring(0, closeIdx) + '}; ' + code.substring(closeIdx + 3);
      }
    } else {
      // For single route files, find the last '});'
      const lastIdx = code.lastIndexOf('});');
      if (lastIdx !== -1) {
        code = code.substring(0, lastIdx) + '};' + code.substring(lastIdx + 3);
      }
    }
    
    fs.writeFileSync(filePath, code);
    console.log(`Refactored ${map.file} -> ${map.func}`);
  }
}
