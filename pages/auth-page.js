// ============================================================
//  BHARATCRAFT – Authentication Page Controller
// ============================================================

(function() {
  window.renderAuthPage = async (app) => {
    // Load the HTML component
    app.innerHTML = window.utils.showPageLoading();
    try {
      const res = await fetch('auth.html');
      if (!res.ok) throw new Error('Failed to load template');
      app.innerHTML = await res.text();
    } catch(err) {
      console.error(err);
      app.innerHTML = '<div class="container" style="padding:4rem;text-align:center;"><h3>Error loading page</h3></div>';
      return;
    }

    // ── Elements ──────────────────────────────────────────────
    const tabLogin = document.querySelector('[data-tab="login"]');
    const tabRegister = document.querySelector('[data-tab="register"]');
    const tabSlider = document.getElementById('auth-tab-slider');
    
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('register-form');
    const formForgot = document.getElementById('forgot-form');
    
    const roleRadios = document.querySelectorAll('input[name="role"]');
    const artisanFields = document.getElementById('artisan-fields');
    
    const pwdInput = document.getElementById('reg-pwd');
    const pwdStrengthBar = document.getElementById('pwd-strength-bar');
    
    const linkForgot = document.getElementById('link-forgot-pwd');
    const linkBack = document.getElementById('link-back-login');

    // ── Tab Switcher Logic ────────────────────────────────────
    function switchTab(tabName) {
      if (tabName === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        tabSlider.style.transform = 'translateX(0)';
        formLogin.classList.add('active');
        formRegister.classList.remove('active');
        formForgot.style.display = 'none';
        document.getElementById('auth-tabs').style.display = 'flex';
      } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        tabSlider.style.transform = 'translateX(100%)';
        formRegister.classList.add('active');
        formLogin.classList.remove('active');
        formForgot.style.display = 'none';
        document.getElementById('auth-tabs').style.display = 'flex';
      }
    }
    
    tabLogin.addEventListener('click', () => switchTab('login'));
    tabRegister.addEventListener('click', () => switchTab('register'));

    // ── Role Toggler ──────────────────────────────────────────
    roleRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'artisan') {
          artisanFields.style.display = 'block';
          document.getElementById('reg-craft').required = true;
          document.getElementById('reg-city').required = true;
        } else {
          artisanFields.style.display = 'none';
          document.getElementById('reg-craft').required = false;
          document.getElementById('reg-city').required = false;
        }
      });
    });

    // ── Forgot Password View ──────────────────────────────────
    linkForgot.addEventListener('click', (e) => {
      e.preventDefault();
      formLogin.classList.remove('active');
      document.getElementById('auth-tabs').style.display = 'none';
      formForgot.style.display = 'block';
    });

    linkBack.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('login');
    });

    // ── Real-time Validation (Blur) ───────────────────────────
    function showError(input, message) {
      input.classList.add('invalid');
      if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-msg')) {
        input.nextElementSibling.textContent = message;
      } else if (input.parentElement.nextElementSibling?.classList.contains('error-msg')) {
        input.parentElement.nextElementSibling.textContent = message;
      }
    }

    function clearError(input) {
      input.classList.remove('invalid');
      if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-msg')) {
        input.nextElementSibling.textContent = '';
      } else if (input.parentElement.nextElementSibling?.classList.contains('error-msg')) {
        input.parentElement.nextElementSibling.textContent = '';
      }
    }

    ['login-email', 'login-pwd', 'reg-name', 'reg-email', 'reg-city', 'reg-state'].forEach(id => {
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('blur', () => {
        if (!el.value.trim() && el.required) {
          showError(el, 'This field is required');
        } else {
          clearError(el);
          if (el.type === 'email' && !window.utils.validateEmail(el.value)) {
            showError(el, 'Please enter a valid email address');
          }
        }
      });
    });

    const regPhone = document.getElementById('reg-phone');
    regPhone.addEventListener('blur', () => {
      if (regPhone.value.trim() && !window.utils.validatePhone(regPhone.value)) {
        showError(regPhone, 'Enter a valid 10-digit Indian mobile number');
      } else {
        clearError(regPhone);
      }
    });

    // ── Password Strength ─────────────────────────────────────
    pwdInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!val) {
        pwdStrengthBar.className = 'pwd-strength-bar';
        return;
      }
      let strength = 0;
      if (val.length >= 6) strength++;
      if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) strength++;
      if (val.length >= 10 && /[^A-Za-z0-9]/.test(val)) strength++;

      if (strength === 1) pwdStrengthBar.className = 'pwd-strength-bar strength-weak';
      else if (strength === 2) pwdStrengthBar.className = 'pwd-strength-bar strength-medium';
      else if (strength === 3) pwdStrengthBar.className = 'pwd-strength-bar strength-strong';
    });

    const pwdConfirm = document.getElementById('reg-pwd-confirm');
    pwdConfirm.addEventListener('blur', () => {
      if (pwdConfirm.value !== pwdInput.value) {
        showError(pwdConfirm, 'Passwords do not match');
      } else {
        clearError(pwdConfirm);
      }
    });

    // ── Button Loader Helper ──────────────────────────────────
    function toggleLoader(btn, isLoading) {
      if (isLoading) {
        btn.classList.add('btn-loading');
        btn.disabled = true;
      } else {
        btn.classList.remove('btn-loading');
        btn.disabled = false;
      }
    }

    // ── Submit Handlers ───────────────────────────────────────
    // Login
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pwd = document.getElementById('login-pwd').value;
      const btn = document.getElementById('btn-login');
      
      toggleLoader(btn, true);
      try {
        await window.authModule.signIn(email, pwd);
        window.utils.toast('Welcome back!', 'success');
        // Let auth state listener handle UI, just redirect
        window.router.navigate('/');
      } catch (err) {
        window.utils.toast(err.message, 'error');
      } finally {
        toggleLoader(btn, false);
      }
    });

    // Register
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pwd = document.getElementById('reg-pwd').value;
      const pwdC = document.getElementById('reg-pwd-confirm').value;
      const phone = document.getElementById('reg-phone').value.trim();
      
      const role = document.querySelector('input[name="role"]:checked').value;
      
      if (pwd !== pwdC) {
        showError(pwdConfirm, 'Passwords do not match');
        return;
      }

      const btn = document.getElementById('btn-register');
      toggleLoader(btn, true);

      try {
        // Create user using existing authModule logic
        const user = await window.authModule.signUp(email, pwd, name, role);
        
        // Save phone explicitly to users if provided
        if (phone) {
          await window.fbDB.collection('users').doc(user.uid).update({ phone });
        }

        // If Artisan, we need to append the extra custom fields
        if (role === 'artisan') {
          const craft = document.getElementById('reg-craft').value;
          const city = document.getElementById('reg-city').value.trim();
          const state = document.getElementById('reg-state').value.trim();
          
          await window.fbDB.collection('artisans').doc(user.uid).update({
            craftType: craft,
            'location.city': city,
            'location.state': state,
            phone: phone || ''
          });
          window.utils.toast('Registered! Welcome to BharatCraft Artisan Community.', 'success');
          window.router.navigate('/dashboard');
        } else {
          window.utils.toast('Account created successfully!', 'success');
          window.router.navigate('/');
        }
      } catch (err) {
        window.utils.toast(err.message, 'error');
      } finally {
        toggleLoader(btn, false);
      }
    });

    // Forgot Password
    formForgot.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      const btn = document.getElementById('btn-forgot');
      
      toggleLoader(btn, true);
      try {
        await window.fbAuth.sendPasswordResetEmail(email);
        window.utils.toast('Password reset link sent to your email!', 'success');
        switchTab('login');
        document.getElementById('login-email').value = email;
      } catch (err) {
        window.utils.toast(err.message, 'error');
      } finally {
        toggleLoader(btn, false);
      }
    });

    // Google Auth (Attach to all google buttons)
    document.querySelectorAll('.google-auth-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        // The core googleSignIn module now natively handles 
        // spinners, custom role modals, and hash redirects organically! 
        await window.authModule.googleSignIn();
      });
    });

  };
})();
