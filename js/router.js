/* ============================================================
   GLOBAL ROUTER (js/router.js)
============================================================ */

function getRoute() {
  const hash = window.location.hash || '#/';
  // Strip the leading #
  const path = hash.startsWith('#') ? hash.slice(1) : hash;
  return path || '/';
}

function matchRoute(path) {
  // Remove query string for matching
  const cleanPath = path.split('?')[0];
  
  const routes = {
    '/': 'home',
    '/home': 'home',
    '/products': 'products',
    '/map': 'map',
    '/wishlist': 'wishlist',
    '/orders': 'orders',
    '/cart': 'cart',
    '/checkout': 'checkout',
    '/auth': 'auth',
    '/dashboard': 'dashboard',
    '/admin': 'admin',
    '/search': 'search'
  };

  // Check static routes first
  if (routes[cleanPath]) return { page: routes[cleanPath], params: {} };

  // Check dynamic routes
  if (cleanPath.startsWith('/product/')) {
    return { page: 'product-detail', params: { id: cleanPath.replace('/product/', '') } };
  }
  if (cleanPath.startsWith('/artisan/')) {
    return { page: 'artisan-profile', params: { id: cleanPath.replace('/artisan/', '') } };
  }

  return { page: '404', params: {} };
}

async function renderPage(routeInfo) {
  const { page, params } = routeInfo;
  const app = document.getElementById('app');
  
  // Fade out
  app.style.opacity = '0';
  app.style.transition = 'opacity 0.2s ease';
  
  await new Promise(r => setTimeout(r, 200));
  
  // Render correct page based on explicit switch
  switch(page) {
    case 'home': window.renderHomePage(app); break;
    case 'products': window.renderProductsPage(app, params); break;
    case 'map': window.renderMapPage(app); break;
    case 'wishlist': window.renderWishlistPage(app); break;
    case 'orders': window.renderOrdersPage(app); break;
    case 'cart': window.renderCartPage(app); break;
    case 'checkout': window.renderCheckoutPage(app); break;
    case 'auth': window.renderAuthPage(app); break;
    case 'dashboard': window.renderDashboardPage(app); break;
    case 'admin': window.renderAdminPage(app); break;
    case 'product-detail': window.renderProductDetailPage(app, params); break;
    case 'artisan-profile': window.renderArtisanProfilePage(app, params); break;
    case 'search': window.renderSearchPage(app, params); break;
    default: window.render404Page(app);
  }
  
  // Fade in
  app.style.opacity = '1';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initRouter() {
  // Initial render
  renderPage(matchRoute(getRoute()));
  
  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    renderPage(matchRoute(getRoute()));
  });
  
  // Handle popstate
  window.addEventListener('popstate', () => {
    renderPage(matchRoute(getRoute()));
  });
}

// Maintain backward compatibility for programmatic navigation calls remaining in page logic
window.router = {
  navigate: (path) => {
    window.location.hash = '#' + path;
  }
};
