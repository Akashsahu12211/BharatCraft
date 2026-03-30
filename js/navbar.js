/* ============================================================
   NAVBAR & GLOBAL TOP-LEVEL UI INTERACTIONS (js/navbar.js)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const userBtn = document.getElementById('user-avatar-btn');
  const userDropdown = document.getElementById('user-dropdown');
  const navbar = document.getElementById('navbar');
  
  // 1. Hamburger Mobile Toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // 2. User Profile Dropdown Toggle
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
  }

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active') && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
    if (userDropdown && userDropdown.classList.contains('active') && !userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove('active');
    }
  });

  // 3. Navbar Scroll Observer (Glassmorphism solid lock)
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    if (scrollPos > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.85)';
      navbar.style.boxShadow = 'none';
    }
  });

  // 4. Logout Handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await window.authModule.signOut();
        window.utils.toast('Logged out successfully', 'success');
        userDropdown.classList.remove('active');
        window.router.navigate('/');
      } catch (err) {
        console.error('Logout error:', err);
      }
    });
  }
});
