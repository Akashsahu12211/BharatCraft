(function () {
  "use strict";

  var PRODUCTS = [
    {
      id: 1,
      name: "Blue Pottery Vase",
      price: 3200,
      category: "Pottery",
      artisan: "Meera Sethi",
      location: "Jaipur",
      image: "assets/images/blue-pottery.svg",
      description:
        "Wheel-thrown and hand-painted with floral geometry, this Jaipur blue pottery piece pairs traditional glazing with contemporary silhouette."
    },
    {
      id: 2,
      name: "Pashmina Stole",
      price: 5400,
      category: "Textiles",
      artisan: "Tariq Lone",
      location: "Srinagar",
      image: "assets/images/pashmina.svg",
      description:
        "A soft handwoven pashmina stole in muted sand tones, finished with delicate fringe and subtle tonal blockwork."
    },
    {
      id: 3,
      name: "Brass Temple Lamp",
      price: 4100,
      category: "Metalwork",
      artisan: "Anita Nair",
      location: "Kochi",
      image: "assets/images/brass-lamp.svg",
      description:
        "Cast in polished brass with balanced proportions, this lamp draws from temple forms while fitting modern interiors."
    },
    {
      id: 4,
      name: "Handloom Durrie Rug",
      price: 6800,
      category: "Textiles",
      artisan: "Raghav Chouhan",
      location: "Jodhpur",
      image: "assets/images/durrie-rug.svg",
      description:
        "Flat-woven cotton durrie featuring contemporary stripe rhythm inspired by Rajasthan desert motifs."
    },
    {
      id: 5,
      name: "Terracotta Urn",
      price: 2800,
      category: "Home Decor",
      artisan: "Sushmita Pal",
      location: "Kolkata",
      image: "assets/images/terracotta-vase.svg",
      description:
        "A burnished terracotta urn with an earthy finish, ideal for dried arrangements and statement console styling."
    },
    {
      id: 6,
      name: "Bamboo Utility Basket",
      price: 1900,
      category: "Home Decor",
      artisan: "Keren Ao",
      location: "Kohima",
      image: "assets/images/bamboo-basket.svg",
      description:
        "Handwoven from treated bamboo strips, this basket combines lightweight durability with a clean modern profile."
    }
  ];

  var ARTISANS = [
    {
      id: 1,
      name: "Meera Sethi",
      location: "Jaipur, Rajasthan",
      craft: "Blue Pottery",
      image: "assets/images/artisan-1.svg"
    },
    {
      id: 2,
      name: "Tariq Lone",
      location: "Srinagar, Kashmir",
      craft: "Pashmina Weaving",
      image: "assets/images/artisan-2.svg"
    },
    {
      id: 3,
      name: "Anita Nair",
      location: "Kochi, Kerala",
      craft: "Brass Craft",
      image: "assets/images/artisan-3.svg"
    },
    {
      id: 4,
      name: "Raghav Chouhan",
      location: "Jodhpur, Rajasthan",
      craft: "Handloom Durrie",
      image: "assets/images/artisan-4.svg"
    },
    {
      id: 5,
      name: "Sushmita Pal",
      location: "Kolkata, West Bengal",
      craft: "Terracotta Art",
      image: "assets/images/artisan-5.svg"
    },
    {
      id: 6,
      name: "Keren Ao",
      location: "Kohima, Nagaland",
      craft: "Bamboo Weaving",
      image: "assets/images/artisan-6.svg"
    }
  ];

  var CART_KEY = "bharatcart-cart-v1";
  var lastCartTrigger = null;

  function uiToast(message, tone) {
    if (window.BharatCartUI && typeof window.BharatCartUI.showToast === "function") {
      window.BharatCartUI.showToast(message, tone);
    }
  }

  function formatINR(value) {
    return "INR " + value.toLocaleString("en-IN");
  }

  function getProductById(id) {
    return PRODUCTS.find(function (product) {
      return product.id === id;
    });
  }

  function getCart() {
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function setCart(cart) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  }

  function applyStagger(container, selector) {
    if (!container) {
      return;
    }

    container.querySelectorAll(selector).forEach(function (node, index) {
      node.classList.add("stagger-item");
      node.style.setProperty("--stagger", String(index));
    });
  }

  function addToCart(productId) {
    var product = getProductById(productId);

    if (!product) {
      return;
    }

    var cart = getCart();
    var existing = cart.find(function (item) {
      return item.id === productId;
    });

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    setCart(cart);
    uiToast(product.name + " added to cart.", "success");
  }

  function removeCartItem(productId) {
    var next = getCart().filter(function (item) {
      return item.id !== productId;
    });
    setCart(next);
  }

  function increaseCartItem(productId) {
    var cart = getCart();
    var target = cart.find(function (item) {
      return item.id === productId;
    });

    if (!target) {
      return;
    }

    target.quantity += 1;
    setCart(cart);
  }

  function decreaseCartItem(productId) {
    var cart = getCart();
    var target = cart.find(function (item) {
      return item.id === productId;
    });

    if (!target) {
      return;
    }

    target.quantity -= 1;

    if (target.quantity <= 0) {
      removeCartItem(productId);
      return;
    }

    setCart(cart);
  }

  function cartQuantity(cart) {
    return cart.reduce(function (count, item) {
      return count + item.quantity;
    }, 0);
  }

  function cartTotal(cart) {
    return cart.reduce(function (sum, item) {
      var product = getProductById(item.id);
      if (!product) {
        return sum;
      }
      return sum + product.price * item.quantity;
    }, 0);
  }

  function updateCartBadge() {
    var count = cartQuantity(getCart());
    document.querySelectorAll("[data-cart-count]").forEach(function (node) {
      node.textContent = String(count);
    });
  }

  function openCart() {
    var drawer = document.getElementById("cartDrawer");
    var backdrop = document.getElementById("drawerBackdrop");

    if (!drawer || !backdrop) {
      return;
    }

    lastCartTrigger = document.activeElement;

    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.classList.add("is-open");
    document.body.classList.add("no-scroll");

    var closeButton = drawer.querySelector("[data-cart-close]");
    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeCart() {
    var drawer = document.getElementById("cartDrawer");
    var backdrop = document.getElementById("drawerBackdrop");

    if (!drawer || !backdrop) {
      return;
    }

    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");

    if (lastCartTrigger && typeof lastCartTrigger.focus === "function") {
      lastCartTrigger.focus();
    }
  }

  function renderCart() {
    var list = document.getElementById("cartItems");
    var total = document.getElementById("cartTotal");

    if (!list || !total) {
      return;
    }

    var cart = getCart();

    if (!cart.length) {
      list.innerHTML = '<li class="empty-state">Your cart is empty. Add any product to preview this static cart.</li>';
      total.textContent = "INR 0";
      renderInlineCart();
      return;
    }

    list.innerHTML = cart
      .map(function (item) {
        var product = getProductById(item.id);
        if (!product) {
          return "";
        }

        return (
          '<li class="cart-item">' +
          '<img src="' +
          product.image +
          '" alt="' +
          product.name +
          '" loading="lazy" decoding="async" />' +
          '<div><h4>' +
          product.name +
          '</h4><p>' +
          formatINR(product.price) +
          " x " +
          item.quantity +
          '</p></div>' +
          '<div>' +
          '<button type="button" data-cart-decrease="' +
          product.id +
          '">-</button>' +
          '<button type="button" data-cart-increase="' +
          product.id +
          '">+</button>' +
          '</div>' +
          "</li>"
        );
      })
      .join("");

    total.textContent = formatINR(cartTotal(cart));
    renderInlineCart();
  }

  function renderInlineCart() {
    var list = document.getElementById("inlineCartItems");
    var total = document.getElementById("inlineCartTotal");

    if (!list || !total) {
      return;
    }

    var cart = getCart();

    if (!cart.length) {
      list.innerHTML = '<li class="empty-state">No items yet. Add products above to see your quick cart here.</li>';
      total.textContent = "INR 0";
      return;
    }

    list.innerHTML = cart
      .map(function (item) {
        var product = getProductById(item.id);

        if (!product) {
          return "";
        }

        return (
          '<li class="inline-cart-item">' +
          '<img src="' +
          product.image +
          '" alt="' +
          product.name +
          '" loading="lazy" decoding="async" />' +
          '<div><h4>' +
          product.name +
          '</h4><p>' +
          formatINR(product.price) +
          " x " +
          item.quantity +
          '</p></div>' +
          '<div class="inline-cart-actions">' +
          '<button type="button" data-cart-decrease="' +
          product.id +
          '">-</button>' +
          '<button type="button" data-cart-increase="' +
          product.id +
          '">+</button>' +
          '</div>' +
          "</li>"
        );
      })
      .join("");

    total.textContent = formatINR(cartTotal(cart));
    applyStagger(list, ".inline-cart-item");
  }

  function productCardMarkup(product) {
    return (
      '<article class="product-card">' +
      '<div class="card-media"><img src="' +
      product.image +
      '" alt="' +
      product.name +
      '" loading="lazy" decoding="async" /></div>' +
      '<div class="card-body">' +
      '<div class="card-head"><h3>' +
      product.name +
      '</h3><p class="price">' +
      formatINR(product.price) +
      '</p></div>' +
      '<div class="meta-row"><span>' +
      product.category +
      '</span><span>' +
      product.location +
      '</span></div>' +
      '<div class="card-actions">' +
      '<a class="btn btn-ghost" href="product-details.html?id=' +
      product.id +
      '">View</a>' +
      '<button type="button" class="btn btn-primary" data-add-to-cart="' +
      product.id +
      '">Add To Cart</button>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  function artisanCardMarkup(artisan) {
    return (
      '<article class="artisan-card">' +
      '<div class="card-media"><img src="' +
      artisan.image +
      '" alt="' +
      artisan.name +
      '" loading="lazy" decoding="async" /></div>' +
      '<div class="card-body">' +
      '<div class="card-head"><h3>' +
      artisan.name +
      '</h3></div>' +
      '<div class="meta-row"><span>' +
      artisan.location +
      '</span><span>' +
      artisan.craft +
      '</span></div>' +
      '</div>' +
      '</article>'
    );
  }

  function renderProductsInto(targetId, products) {
    var container = document.getElementById(targetId);

    if (!container) {
      return;
    }

    if (!products.length) {
      container.innerHTML = '<p class="empty-state">No products match your filters.</p>';
      return;
    }

    container.innerHTML = products.map(productCardMarkup).join("");
    applyStagger(container, ".product-card");
  }

  function renderArtisansInto(targetId, artisans) {
    var container = document.getElementById(targetId);

    if (!container) {
      return;
    }

    container.innerHTML = artisans.map(artisanCardMarkup).join("");
    applyStagger(container, ".artisan-card");
  }

  function initHomePage() {
    renderProductsInto("featuredProducts", PRODUCTS.slice(0, 4));
    renderArtisansInto("featuredArtisans", ARTISANS.slice(0, 4));
  }

  function initProductsPage() {
    var search = document.getElementById("productSearch");
    var categories = document.getElementById("categoryFilters");
    var activeCategory = "All";
    var activeSearch = "";

    function applyFilters() {
      var query = activeSearch.toLowerCase();
      var filtered = PRODUCTS.filter(function (product) {
        var categoryMatch = activeCategory === "All" || product.category === activeCategory;
        var searchMatch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.artisan.toLowerCase().includes(query);

        return categoryMatch && searchMatch;
      });

      renderProductsInto("productsGrid", filtered);
    }

    applyFilters();

    if (search) {
      search.addEventListener("input", function () {
        activeSearch = search.value.trim();
        applyFilters();
      });
    }

    if (categories) {
      categories.querySelectorAll("[data-category]").forEach(function (button) {
        button.addEventListener("click", function () {
          categories.querySelectorAll("[data-category]").forEach(function (node) {
            node.classList.remove("is-active");
          });

          activeCategory = button.getAttribute("data-category") || "All";
          button.classList.add("is-active");
          applyFilters();
        });
      });
    }
  }

  function initArtisansPage() {
    renderArtisansInto("artisansGrid", ARTISANS);
  }

  function initProductDetailsPage() {
    var root = document.getElementById("productDetails");

    if (!root) {
      return;
    }

    var queryId = Number(new URLSearchParams(window.location.search).get("id"));
    var product = getProductById(queryId) || PRODUCTS[0];

    document.title = product.name + " | BharatCart";

    root.innerHTML =
      '<div class="product-detail">' +
      '<div class="detail-media"><img src="' +
      product.image +
      '" alt="' +
      product.name +
      '" decoding="async" /></div>' +
      '<div class="detail-content glass">' +
      '<p class="eyebrow">' +
      product.category +
      '</p>' +
      '<h2>' +
      product.name +
      '</h2>' +
      '<p class="price">' +
      formatINR(product.price) +
      '</p>' +
      '<p class="detail-copy">' +
      product.description +
      " Crafted by " +
      product.artisan +
      " in " +
      product.location +
      ".</p>" +
      '<button type="button" class="btn btn-primary" data-add-to-cart="' +
      product.id +
      '">Add To Cart</button>' +
      '<div class="reviews">' +
      '<article class="review-card"><div class="rating-row">5/5</div><h4>Neha Kapoor</h4><p>Exceptional finish and beautiful detailing. Looks premium in person.</p></article>' +
      '<article class="review-card"><div class="rating-row">4.8/5</div><h4>Rahul Menon</h4><p>A thoughtful blend of heritage and modern styling. Great quality.</p></article>' +
      '<article class="review-card"><div class="rating-row">5/5</div><h4>Ananya Basu</h4><p>Elegant craft story and solid build. Perfect for a designer living space.</p></article>' +
      "</div>" +
      "</div>" +
      "</div>";

    renderProductsInto(
      "relatedProducts",
      PRODUCTS.filter(function (item) {
        return item.id !== product.id;
      }).slice(0, 3)
    );
  }

  function initCartInteractions() {
    var drawer = document.getElementById("cartDrawer");

    document.addEventListener("click", function (event) {
      var target = event.target;

      var addButton = target.closest("[data-add-to-cart]");
      if (addButton) {
        addToCart(Number(addButton.getAttribute("data-add-to-cart")));
      }

      var cartToggle = target.closest("[data-cart-toggle]");
      if (cartToggle) {
        openCart();
      }

      var cartClose = target.closest("[data-cart-close]");
      if (cartClose || target.id === "drawerBackdrop") {
        closeCart();
      }

      var decrease = target.closest("[data-cart-decrease]");
      if (decrease) {
        decreaseCartItem(Number(decrease.getAttribute("data-cart-decrease")));
      }

      var increase = target.closest("[data-cart-increase]");
      if (increase) {
        increaseCartItem(Number(increase.getAttribute("data-cart-increase")));
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }

      if (!drawer || !drawer.classList.contains("is-open")) {
        return;
      }

      closeCart();
    });
  }

  function initByPage() {
    var page = document.body.getAttribute("data-page");

    if (page === "home") {
      initHomePage();
    }

    if (page === "products") {
      initProductsPage();
    }

    if (page === "artisans") {
      initArtisansPage();
    }

    if (page === "product-details") {
      initProductDetailsPage();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCartInteractions();
    initByPage();
    updateCartBadge();
    renderCart();
  });
})();
