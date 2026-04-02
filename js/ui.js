(function () {
  "use strict";

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    }, 2400);
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
    }

    return valid;
  }

  function initAuthForms() {
    document.querySelectorAll("[data-auth-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var mode = form.getAttribute("data-mode") || "login";
        var isValid = validateAuthForm(form, mode);

        if (!isValid) {
          showToast("Please review the highlighted fields.");
          return;
        }

        showToast(mode === "signup" ? "Account created (UI demo)." : "Login successful (UI demo).", "success");
        form.reset();
      });
    });

    document.querySelectorAll("[data-google-button]").forEach(function (button) {
      button.addEventListener("click", function () {
        showToast("Google sign-in is a UI-only button.");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    highlightCurrentLink();
    initMobileMenu();
    initStickyHeader();
    initSmoothAnchors();
    initRevealAnimation();
    initAuthForms();
  });

  window.BharatCartUI = {
    showToast: showToast
  };
})();
