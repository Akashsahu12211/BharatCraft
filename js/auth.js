// ============================================================
//  BHARATCRAFT – Firebase Authentication Module
// ============================================================

window.authModule = (() => {
  let _currentUser = null;
  let _userDoc = null;

  // ── Auth State Listener ───────────────────────────────────
  window.fbAuth.onAuthStateChanged(async (user) => {
    _currentUser = user;
    if (user) {
      // Fetch user role from Firestore
      try {
        const doc = await window.fbDB.collection('users').doc(user.uid).get();
        _userDoc = doc.exists ? doc.data() : null;
      } catch (e) {
        console.warn('Could not fetch user doc:', e);
        _userDoc = null;
      }
      updateNavUI(true, user, _userDoc);
    } else {
      _userDoc = null;
      updateNavUI(false);
    }
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { user, userDoc: _userDoc } }));
    // Re-render cart count
    window.cartModule && window.cartModule.updateCartCount();
  });

  // ── Update Navbar UI ──────────────────────────────────────
  function updateNavUI(loggedIn, user = null, userDoc = null) {
    const authDiv = document.getElementById('nav-auth');
    const userDiv = document.getElementById('nav-user');
    if (!authDiv || !userDiv) return;

    if (loggedIn && user) {
      authDiv.classList.add('hidden');
      userDiv.classList.remove('hidden');

      const avatarImg  = document.getElementById('user-avatar-img');
      const nameShort  = document.getElementById('user-name-short');
      const dropName   = document.getElementById('dropdown-user-name');
      const dropRole   = document.getElementById('dropdown-user-role');
      const dashLink   = document.getElementById('dashboard-link');

      const displayName = user.displayName || userDoc?.name || 'User';
      const role = userDoc?.role || 'customer';

      if (user.photoURL) {
        avatarImg.src = user.photoURL;
        avatarImg.style.display = 'block';
        if (nameShort) nameShort.style.display = 'none';
      } else {
        avatarImg.style.display = 'none';
        if (nameShort) { nameShort.textContent = displayName[0].toUpperCase(); nameShort.style.display = 'flex'; }
      }
      if (dropName) dropName.textContent = displayName;
      if (dropRole) { dropRole.textContent = utils.capitalize(role); dropRole.className = `role-badge badge-saffron`; }
      if (dashLink) dashLink.href = '#/dashboard';
    } else {
      authDiv.classList.remove('hidden');
      userDiv.classList.add('hidden');
    }
  }

  // ── Logout ────────────────────────────────────────────────
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
      await window.fbAuth.signOut();
      utils.toast('Logged out successfully', 'success');
      window.router.navigate('/');
    } catch (e) {
      utils.toast('Logout failed: ' + e.message, 'error');
    }
  });

  // ── Sign Up with Email ────────────────────────────────────
  async function signUp(email, password, name, role = 'customer') {
    const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    await window.fbDB.collection('users').doc(cred.user.uid).set({
      uid: cred.user.uid,
      name,
      email,
      role,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      wishlist: [],
      avatar: '',
    });
    // If artisan, create artisan doc
    if (role === 'artisan') {
      await window.fbDB.collection('artisans').doc(cred.user.uid).set({
        userId: cred.user.uid,
        name,
        email,
        craftType: '',
        bio: '',
        location: { lat: 20.5937, lng: 78.9629, city: 'India', state: '' },
        rating: 0,
        reviewCount: 0,
        verified: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    return cred.user;
  }

  // ── Sign In with Email ────────────────────────────────────
  async function signIn(email, password) {
    const cred = await window.fbAuth.signInWithEmailAndPassword(email, password);
    return cred.user;
  }

  // ── Google Sign In ────────────────────────────────────────
  function handlePostLoginRedirect(role) {
    if (role === 'admin') {
      window.location.hash = '#/admin';
    } else if (role === 'artisan') {
      window.location.hash = '#/dashboard';
    } else {
      window.location.hash = '#/home';
    }
  }

  function showRoleSelectionModal(user) {
    const modal = document.createElement('div');
    modal.className = 'role-modal-overlay';
    modal.innerHTML = `
      <div class="role-modal">
        <h2>Welcome to BharatCraft! 🪔</h2>
        <p>Hi ${user.displayName}! How will you use BharatCraft?</p>
        <div class="role-options">
          <button class="role-card" data-role="customer">
            <span class="role-icon">🛍️</span>
            <span class="role-title">Customer</span>
            <span class="role-desc">Shop for authentic Indian crafts</span>
          </button>
          <button class="role-card" data-role="artisan">
            <span class="role-icon">🎨</span>
            <span class="role-title">Artisan</span>
            <span class="role-desc">Sell my handmade creations</span>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelectorAll('.role-card').forEach(card => {
      card.addEventListener('click', async () => {
        const role = card.dataset.role;
        
        await window.fbDB.collection('users').doc(user.uid).set({
          name: user.displayName,
          email: user.email,
          role: role,
          avatar: user.photoURL || null,
          createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          wishlist: []
        });
        
        if (role === 'artisan') {
          await window.fbDB.collection('artisans').doc(user.uid).set({
            name: user.displayName,
            email: user.email,
            verified: false,
            rating: 0,
            totalOrders: 0,
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        
        modal.remove();
        window.utils.toast(`Welcome to BharatCraft, ${user.displayName}! 🎉`, 'success');
        handlePostLoginRedirect(role);
      });
    });
  }

  async function googleSignIn() {
    try {
      const btn = document.getElementById('google-btn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Connecting...';
      }

      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await window.fbAuth.signInWithPopup(provider);
      const user = result.user;
      
      const userDoc = await window.fbDB.collection('users').doc(user.uid).get();
      
      if (!userDoc.exists) {
        showRoleSelectionModal(user);
      } else {
        const userData = userDoc.data();
        handlePostLoginRedirect(userData.role);
      }
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Google sign-in failed. Please try again.';
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Check your connection.';
      }
      
      window.utils?.toast && window.utils.toast(errorMessage, 'error');
      
      const btn = document.getElementById('google-btn');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<img src="https://www.google.com/favicon.ico" width="18"> Sign in with Google';
      }
    }
  }

  // ── Getters ───────────────────────────────────────────────
  function getCurrentUser() { return _currentUser; }
  function getUserDoc()     { return _userDoc; }
  function getUserRole()    { return _userDoc?.role || 'customer'; }
  function isLoggedIn()     { return !!_currentUser; }
  function isArtisan()      { return getUserRole() === 'artisan'; }
  function isAdmin()        { return getUserRole() === 'admin'; }

  // ── Require auth helper ───────────────────────────────────
  function requireAuth(callback) {
    if (isLoggedIn()) { callback(); }
    else {
      utils.toast('Please sign in to continue', 'info');
      window.router.navigate('/auth');
    }
  }

  return { signUp, signIn, googleSignIn, getCurrentUser, getUserDoc, getUserRole, isLoggedIn, isArtisan, isAdmin, requireAuth };
})();
