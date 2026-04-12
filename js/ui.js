(function () {
  "use strict";

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var USER_KEY = "bharatcart-user-v1";
  var TOKEN_KEY = "bharatcart-token-v1";
  var API_BASE_KEY = "bharatcart-api-base-v1";

  function getRoleHintFromURL() {
    try {
      var params = new URLSearchParams(window.location.search);
      var role = String(params.get("role") || "").toLowerCase();
      return role === "artisan" ? "artisan" : "";
    } catch (error) {
      return "";
    }
  }

  function getCurrentUser() {
    try {
      var raw = window.localStorage.getItem(USER_KEY);
      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function setCurrentUser(user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function getAuthToken() {
    try {
      return String(window.localStorage.getItem(TOKEN_KEY) || "");
    } catch (error) {
      return "";
    }
  }

  function setAuthToken(token) {
    if (!token) {
      window.localStorage.removeItem(TOKEN_KEY);
      return;
    }

    window.localStorage.setItem(TOKEN_KEY, String(token));
  }

  function clearSession() {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  }

  function resolveApiBase() {
    try {
      var configuredBase = String(window.localStorage.getItem(API_BASE_KEY) || "").trim();
      if (configuredBase) {
        return configuredBase.replace(/\/+$/, "");
      }
    } catch (error) {
      // Ignore storage errors and continue with fallback.
    }

    if (window.BharatCartConfig && typeof window.BharatCartConfig.apiBase === "string") {
      return window.BharatCartConfig.apiBase.replace(/\/+$/, "");
    }

    var host = window.location.hostname || "127.0.0.1";
    var protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return protocol + "//" + host + ":5000";
  }

  function showToast(message, variant) {
    var stack = document.querySelector(".toast-stack");
    var tone = variant || "info";

    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }

    var toast = document.createElement("div");
    toast.className = "toast " + tone;
    toast.textContent = message;
    stack.appendChild(toast);

    window.setTimeout(function () {
      toast.remove();
      if (!stack.children.length) {
        stack.remove();
      }
    }, 2600);
  }

  function parseResponseBody(text) {
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  }

  async function apiRequest(endpoint, options) {
    var requestOptions = options || {};
    var url = endpoint.indexOf("http") === 0 ? endpoint : resolveApiBase() + endpoint;
    var method = requestOptions.method || "GET";
    var payload = requestOptions.body;
    var headers = Object.assign({}, requestOptions.headers || {});

    if (requestOptions.auth) {
      var token = getAuthToken();
      if (token) {
        headers.Authorization = "Bearer " + token;
      }
    }

    var hasBody = payload !== undefined && payload !== null;

    if (hasBody && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    var response;

    try {
      response = await fetch(url, {
        method: method,
        headers: headers,
        body: hasBody ? JSON.stringify(payload) : undefined
      });
    } catch (error) {
      throw {
        status: 0,
        message: "Unable to connect to server. Please ensure backend is running.",
        cause: error
      };
    }

    var text = await response.text();
    var parsed = parseResponseBody(text);

    if (!response.ok) {
      throw {
        status: response.status,
        message: (parsed && parsed.message) || "Request failed.",
        data: parsed
      };
    }

    return parsed;
  }

  function highlightCurrentLink() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll("#primaryMenu a");

    links.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === current) {
        link.classList.add("is-active");
      }
    });
  }

  function initMobileMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.getElementById("primaryMenu");

    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!menu.classList.contains("is-open")) {
        return;
      }

      if (menu.contains(target) || button.contains(target)) {
        return;
      }

      menu.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }

      if (!menu.classList.contains("is-open")) {
        return;
      }

      menu.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.focus();
    });
  }

  function initStickyHeader() {
    var header = document.querySelector(".site-header");

    if (!header) {
      return;
    }

    function onScroll() {
      header.classList.toggle("is-condensed", window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function closeAllHeaderMenus() {
    document.querySelectorAll("[data-menu-content]").forEach(function (menu) {
      menu.classList.remove("is-open");
    });

    document.querySelectorAll("[data-menu-trigger]").forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  function initHeaderMenus() {
    var triggers = document.querySelectorAll("[data-menu-trigger]");

    if (!triggers.length) {
      return;
    }

    triggers.forEach(function (button) {
      button.addEventListener("click", function () {
        var menuId = button.getAttribute("data-menu-trigger");
        var targetMenu = document.getElementById(menuId);

        if (!targetMenu) {
          return;
        }

        var willOpen = !targetMenu.classList.contains("is-open");
        closeAllHeaderMenus();

        if (willOpen) {
          targetMenu.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", function (event) {
      var target = event.target;
      if (target.closest("[data-menu-trigger]") || target.closest("[data-menu-content]")) {
        return;
      }

      closeAllHeaderMenus();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeAllHeaderMenus();
      }
    });
  }

  function initGlobalMarketplaceSearch() {
    document.querySelectorAll("[data-global-search]").forEach(function (input) {
      input.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") {
          return;
        }

        var query = input.value.trim();
        if (!query) {
          window.location.href = "products.html";
          return;
        }

        window.location.href = "products.html?search=" + encodeURIComponent(query);
      });
    });
  }

  function initAuthRequiredLinks() {
    document.querySelectorAll("[data-auth-required]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var token = getAuthToken();
        if (token) {
          return;
        }

        event.preventDefault();
        showToast("Please login first to access this section.", "error");
        closeAllHeaderMenus();

        window.setTimeout(function () {
          window.location.href = "login.html";
        }, 700);
      });
    });
  }

  function applyRoleTheme() {
    var user = getCurrentUser();
    var isArtisan = !!user && user.uiRole === "artisan";

    document.body.classList.toggle("role-artisan", isArtisan);
    document.body.classList.toggle("role-customer", !isArtisan);

    document.querySelectorAll(".brand").forEach(function (brand) {
      var existing = brand.querySelector(".role-badge");
      if (existing) {
        existing.remove();
      }

      if (isArtisan) {
        var badge = document.createElement("span");
        badge.className = "role-badge";
        badge.textContent = "Artisan Mode";
        brand.appendChild(badge);
      }
    });

    document.querySelectorAll("[data-cart-toggle]").forEach(function (button) {
      var countChip = button.querySelector("span");
      if (isArtisan) {
        button.setAttribute("aria-label", "Open artisan studio");
        button.childNodes[0].nodeValue = "Studio ";
        if (countChip) {
          countChip.style.display = "none";
        }
      } else {
        button.setAttribute("aria-label", "Open cart");
        button.childNodes[0].nodeValue = "Cart ";
        if (countChip) {
          countChip.style.display = "inline-grid";
        }
      }
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (event) {
        var href = anchor.getAttribute("href");
        if (!href || href === "#") {
          return;
        }

        var target = document.querySelector(href);
        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function initRevealAnimation() {
    var revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, instance) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function clearErrors(form) {
    form.querySelectorAll("[data-error-for]").forEach(function (errorNode) {
      errorNode.textContent = "";
    });
  }

  function setError(form, fieldName, message) {
    var target = form.querySelector('[data-error-for="' + fieldName + '"]');
    if (target) {
      target.textContent = message;
    }
  }

  function validateAuthForm(form, mode) {
    var data = new FormData(form);
    var email = String(data.get("email") || "").trim();
    var password = String(data.get("password") || "");
    var fullName = String(data.get("fullName") || "").trim();
    var confirmPassword = String(data.get("confirmPassword") || "");
    var accountType = String(data.get("accountType") || "customer");
    var shopName = String(data.get("shopName") || "").trim();
    var craftType = String(data.get("craftType") || "").trim();
    var artisanCity = String(data.get("artisanCity") || "").trim();
    var valid = true;

    clearErrors(form);

    if (!EMAIL_REGEX.test(email)) {
      setError(form, "email", "Enter a valid email address.");
      valid = false;
    }

    if (password.length < 8) {
      setError(form, "password", "Password must be at least 8 characters.");
      valid = false;
    }

    if (mode === "signup") {
      if (fullName.length < 2) {
        setError(form, "fullName", "Please enter your full name.");
        valid = false;
      }

      if (confirmPassword !== password) {
        setError(form, "confirmPassword", "Passwords do not match.");
        valid = false;
      }

      if (accountType === "artisan") {
        if (shopName.length < 2) {
          setError(form, "shopName", "Please enter your shop name.");
          valid = false;
        }

        if (craftType.length < 2) {
          setError(form, "craftType", "Please enter your craft type.");
          valid = false;
        }

        if (artisanCity.length < 2) {
          setError(form, "artisanCity", "Please enter your studio city.");
          valid = false;
        }
      }
    }

    return valid;
  }

  function initArtisanEntryAuthMode() {
    if (getRoleHintFromURL() !== "artisan") {
      return;
    }

    document.querySelectorAll("[data-auth-form]").forEach(function (form) {
      var mode = form.getAttribute("data-mode") || "login";
      var groupName = mode === "signup" ? "accountType" : "loginType";
      var customerInput = form.querySelector('input[name="' + groupName + '"][value="customer"]');
      var artisanInput = form.querySelector('input[name="' + groupName + '"][value="artisan"]');
      var roleTitle = form.querySelector(".auth-role-title");
      var submitButton = form.querySelector('button[type="submit"]');

      if (customerInput) {
        customerInput.checked = false;
        customerInput.disabled = true;
        if (customerInput.parentElement) {
          customerInput.parentElement.hidden = true;
        }
      }

      if (artisanInput) {
        artisanInput.checked = true;
        artisanInput.disabled = false;
        if (artisanInput.parentElement) {
          artisanInput.parentElement.hidden = false;
        }
      }

      if (roleTitle) {
        roleTitle.textContent = mode === "signup" ? "Sign up as artisan" : "Login as artisan";
      }

      if (submitButton) {
        submitButton.textContent = mode === "signup" ? "Create Artisan Account" : "Login as Artisan";
      }
    });

    document.querySelectorAll('a[href="signup.html"]').forEach(function (link) {
      link.setAttribute("href", "signup.html?role=artisan");
    });

    document.querySelectorAll('a[href="login.html"]').forEach(function (link) {
      link.setAttribute("href", "login.html?role=artisan");
    });
  }

  function initSignupRoleForms() {
    document.querySelectorAll('[data-auth-form][data-mode="signup"]').forEach(function (form) {
      var roleInputs = form.querySelectorAll("[data-account-type]");
      var artisanFields = form.querySelector("[data-artisan-fields]");
      var submitButton = form.querySelector('button[type="submit"]');

      if (!roleInputs.length || !artisanFields) {
        return;
      }

      function updateRoleUI() {
        var selected = form.querySelector('[data-account-type]:checked');
        var isArtisan = !!selected && selected.value === "artisan";

        artisanFields.hidden = !isArtisan;
        artisanFields.querySelectorAll("input").forEach(function (input) {
          input.disabled = !isArtisan;
        });

        if (submitButton) {
          submitButton.textContent = isArtisan ? "Create Artisan Account" : "Create Account";
        }
      }

      roleInputs.forEach(function (input) {
        input.addEventListener("change", updateRoleUI);
      });

      updateRoleUI();
    });
  }

  function initAuthForms() {
    document.querySelectorAll("[data-auth-form]").forEach(function (form) {
      form.addEventListener("submit", async function (event) {
        event.preventDefault();

        var mode = form.getAttribute("data-mode") || "login";
        var isValid = validateAuthForm(form, mode);

        if (!isValid) {
          showToast("Please review the highlighted fields.", "error");
          return;
        }

        var submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
        }

        var data = new FormData(form);
        var email = String(data.get("email") || "").trim();
        var password = String(data.get("password") || "");
        var fullName = String(data.get("fullName") || "").trim();
        var uiRole = mode === "signup" ? String(data.get("accountType") || "customer") : String(data.get("loginType") || "customer");

        try {
          var response;

          if (mode === "signup") {
            response = await apiRequest("/api/auth/signup", {
              method: "POST",
              body: {
                name: fullName,
                email: email,
                password: password
              }
            });
          } else {
            response = await apiRequest("/api/auth/login", {
              method: "POST",
              body: {
                email: email,
                password: password
              }
            });
          }

          setAuthToken(response.token);
          setCurrentUser({
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role,
            uiRole: uiRole
          });

          applyRoleTheme();
          showToast(mode === "signup" ? "Account created successfully." : "Login successful.", "success");
          form.reset();

          window.setTimeout(function () {
            window.location.href = "products.html";
          }, 700);
        } catch (error) {
          showToast(error.message || "Authentication failed.", "error");
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
          }

          if (getRoleHintFromURL() === "artisan") {
            initArtisanEntryAuthMode();
            var artisanChoice = form.querySelector('input[value="artisan"]');
            if (artisanChoice) {
              artisanChoice.checked = true;
              artisanChoice.dispatchEvent(new Event("change"));
            }
          }
        }
      });
    });

    document.querySelectorAll("[data-google-button]").forEach(function (button) {
      button.addEventListener("click", function () {
        showToast("Google sign-in is not configured yet.", "error");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyRoleTheme();
    highlightCurrentLink();
    initMobileMenu();
    initStickyHeader();
    initHeaderMenus();
    initAuthRequiredLinks();
    initGlobalMarketplaceSearch();
    initSmoothAnchors();
    initRevealAnimation();
    initArtisanEntryAuthMode();
    initSignupRoleForms();
    initAuthForms();
  });

  window.BharatCartUI = {
    showToast: showToast,
    apiRequest: apiRequest,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    getAuthToken: getAuthToken,
    setAuthToken: setAuthToken,
    clearSession: clearSession,
    resolveApiBase: resolveApiBase
  };
})();
