(function () {
  "use strict";

  var PRODUCTS = [];

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
    },
    {
      id: 7,
      name: "Priyanshu Rao",
      location: "Mysuru, Karnataka",
      craft: "Sandalwood Woodwork",
      image: "assets/images/artisan-1.svg"
    },
    {
      id: 8,
      name: "Zara Bano",
      location: "Lucknow, Uttar Pradesh",
      craft: "Chikankari Textile",
      image: "assets/images/artisan-2.svg"
    },
    {
      id: 9,
      name: "Ishita Sen",
      location: "Shantiniketan, West Bengal",
      craft: "Kantha Painting",
      image: "assets/images/artisan-5.svg"
    },
    {
      id: 10,
      name: "Arun Vel",
      location: "Madurai, Tamil Nadu",
      craft: "Temple Metal",
      image: "assets/images/artisan-3.svg"
    },
    {
      id: 11,
      name: "Bhavna Purohit",
      location: "Udaipur, Rajasthan",
      craft: "Miniature Painting",
      image: "assets/images/artisan-4.svg"
    },
    {
      id: 12,
      name: "Nima Lepcha",
      location: "Gangtok, Sikkim",
      craft: "Handwoven Textile",
      image: "assets/images/artisan-6.svg"
    }
  ];

  var CART_KEY = "bharatcart-cart-v1";
  var lastCartTrigger = null;
  var cartSyncInProgress = false;
  var checkoutInProgress = false;

  var ARTISAN_META = {
    "Meera Sethi": { rating: 4.9, shop: "Jaipur Blue Studio" },
    "Tariq Lone": { rating: 4.8, shop: "Kashmir Loom House" },
    "Anita Nair": { rating: 4.7, shop: "Kochi Brass Atelier" },
    "Raghav Chouhan": { rating: 4.7, shop: "Desert Weave Works" },
    "Sushmita Pal": { rating: 4.6, shop: "Bengal Clay Studio" },
    "Keren Ao": { rating: 4.6, shop: "Naga Bamboo Collective" },
    "Priyanshu Rao": { rating: 4.5, shop: "Mysuru Wood House" },
    "Zara Bano": { rating: 4.8, shop: "Lucknow Chikan Lab" },
    "Ishita Sen": { rating: 4.4, shop: "Kantha Canvas Works" },
    "Arun Vel": { rating: 4.5, shop: "Madurai Metal Circle" },
    "Bhavna Purohit": { rating: 4.3, shop: "Udaipur Miniature Co" },
    "Nima Lepcha": { rating: 4.4, shop: "Himalayan Loom Room" }
  };

  var CITY_ATTRACTIONS = {
    Jaipur: ["Amber Fort", "Hawa Mahal", "City Palace", "Jal Mahal"],
    Srinagar: ["Dal Lake", "Nishat Bagh", "Shalimar Bagh", "Pari Mahal"],
    Kochi: ["Fort Kochi", "Mattancherry Palace", "Marine Drive", "Cherai Beach"],
    Jodhpur: ["Mehrangarh Fort", "Clock Tower Market", "Jaswant Thada", "Umaid Bhawan Palace"],
    Kolkata: ["Victoria Memorial", "Howrah Bridge", "Dakshineswar", "College Street"],
    Kohima: ["Kohima War Cemetery", "Dzulekie", "Kisama Heritage Village", "Japfu Peak"]
  };

  function uiToast(message, tone) {
    if (window.BharatCartUI && typeof window.BharatCartUI.showToast === "function") {
      window.BharatCartUI.showToast(message, tone);
    }
  }

  function getCurrentUser() {
    if (window.BharatCartUI && typeof window.BharatCartUI.getCurrentUser === "function") {
      return window.BharatCartUI.getCurrentUser();
    }

    return null;
  }

  function getAuthToken() {
    if (window.BharatCartUI && typeof window.BharatCartUI.getAuthToken === "function") {
      return window.BharatCartUI.getAuthToken();
    }

    return "";
  }

  function isAdminUser() {
    var user = getCurrentUser();
    return !!user && user.role === "admin";
  }

  async function apiRequest(path, options) {
    if (!window.BharatCartUI || typeof window.BharatCartUI.apiRequest !== "function") {
      throw {
        message: "API client is not ready."
      };
    }

    return window.BharatCartUI.apiRequest(path, options);
  }

  function formatINR(value) {
    return "INR " + Number(value || 0).toLocaleString("en-IN");
  }

  function normalizeProduct(product) {
    var productId = String(product._id || product.id || "");

    return {
      id: productId,
      _id: productId,
      name: product.name,
      price: Number(product.price || 0),
      category: product.category,
      artisan: product.artisan,
      location: product.location,
      image: product.image,
      description: product.description,
      popularity: Number(product.popularity || 0),
      launchedAt: product.launchedAt || product.createdAt || new Date().toISOString()
    };
  }

  async function loadProductsFromAPI() {
    try {
      var payload = await apiRequest("/api/products");
      var rows = Array.isArray(payload) ? payload : [];
      PRODUCTS = rows.map(normalizeProduct);
    } catch (error) {
      PRODUCTS = [];
      uiToast(error.message || "Unable to load products from server.", "error");
    }
  }

  async function fetchProductById(productId) {
    try {
      var product = await apiRequest("/api/products/" + encodeURIComponent(String(productId)));
      return normalizeProduct(product);
    } catch (error) {
      return null;
    }
  }

  function getProductById(id) {
    var target = String(id || "");
    return PRODUCTS.find(function (product) {
      return String(product.id) === target;
    });
  }

  function getArtisanMeta(name) {
    return ARTISAN_META[name] || { rating: 4.2, shop: name + " Studio" };
  }

  function getCart() {
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      if (!raw) {
        return [];
      }

      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map(function (item) {
          return {
            id: String(item.id || item.productId || ""),
            quantity: Math.max(1, Number(item.quantity || 1))
          };
        })
        .filter(function (item) {
          return !!item.id;
        });
    } catch (error) {
      return [];
    }
  }

  function writeLocalCart(cart) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  async function syncCartFromBackend() {
    var token = getAuthToken();
    if (!token) {
      return;
    }

    try {
      var serverCart = await apiRequest("/api/cart", { auth: true });
      var items = Array.isArray(serverCart.items)
        ? serverCart.items.map(function (item) {
            return {
              id: String(item.productId || item.id || ""),
              quantity: Math.max(1, Number(item.quantity || 1))
            };
          })
        : [];

      writeLocalCart(
        items.filter(function (item) {
          return !!item.id;
        })
      );
    } catch (error) {
      uiToast("Using offline cart copy.", "info");
    }
  }

  async function syncCartToBackend(cart) {
    var token = getAuthToken();
    if (!token || cartSyncInProgress) {
      return;
    }

    cartSyncInProgress = true;

    try {
      await apiRequest("/api/cart", {
        method: "POST",
        auth: true,
        body: {
          items: cart.map(function (item) {
            return {
              productId: item.id,
              quantity: item.quantity
            };
          })
        }
      });
    } catch (error) {
      // Keep local cart if sync fails.
    } finally {
      cartSyncInProgress = false;
    }
  }

  function setCart(cart) {
    writeLocalCart(cart);
    updateCartBadge();
    renderCart();
    syncCartToBackend(cart);
  }

  function addToCart(productId) {
    var product = getProductById(productId);

    if (!product) {
      uiToast("Product is not available right now.", "error");
      return;
    }

    var cart = getCart();

    var existing = cart.find(function (item) {
      return item.id === String(productId);
    });

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: String(productId), quantity: 1 });
    }

    setCart(cart);
    uiToast(product.name + " added to cart.", "success");
  }

  function removeCartItem(productId) {
    var next = getCart().filter(function (item) {
      return item.id !== String(productId);
    });

    setCart(next);
  }

  function increaseCartItem(productId) {
    var cart = getCart();
    var target = cart.find(function (item) {
      return item.id === String(productId);
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
      return item.id === String(productId);
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

  function setCheckoutButtonsState() {
    var hasItems = getCart().length > 0;

    document.querySelectorAll("[data-checkout]").forEach(function (button) {
      if (checkoutInProgress) {
        button.disabled = true;
        button.textContent = "Processing...";
        return;
      }

      button.disabled = !hasItems;
      button.textContent = hasItems ? "Checkout" : "Cart Empty";
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

  function applyStagger(container, selector) {
    if (!container) {
      return;
    }

    container.querySelectorAll(selector).forEach(function (node, index) {
      node.classList.add("stagger-item");
      node.style.setProperty("--stagger", String(index));
    });
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

  function renderCart() {
    var list = document.getElementById("cartItems");
    var total = document.getElementById("cartTotal");

    if (!list || !total) {
      return;
    }

    var cart = getCart();

    if (!cart.length) {
      list.innerHTML = '<li class="empty-state">Your cart is empty. Add any product to start checkout.</li>';
      total.textContent = "INR 0";
      renderInlineCart();
      setCheckoutButtonsState();
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
    setCheckoutButtonsState();
  }

  async function handleCheckout() {
    var token = getAuthToken();
    var user = getCurrentUser();
    var cart = getCart();

    if (!cart.length) {
      uiToast("Add products before checkout.", "error");
      return;
    }

    if (!token || !user || !user.id) {
      uiToast("Login required to checkout.", "error");
      window.setTimeout(function () {
        window.location.href = "login.html";
      }, 700);
      return;
    }

    checkoutInProgress = true;
    setCheckoutButtonsState();

    try {
      var response = await apiRequest("/api/orders", {
        method: "POST",
        auth: true,
        body: {
          products: cart.map(function (item) {
            return {
              productId: item.id,
              quantity: item.quantity
            };
          })
        }
      });

      setCart([]);
      closeCart();
      uiToast("Order placed successfully. ID: " + response.orderId, "success");

      if (document.body.getAttribute("data-page") === "orders") {
        initOrdersPage();
      }
    } catch (error) {
      uiToast(error.message || "Checkout failed. Please try again.", "error");
    } finally {
      checkoutInProgress = false;
      setCheckoutButtonsState();
    }
  }

  function productCardMarkup(product) {
    var artisanMeta = getArtisanMeta(product.artisan);

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
      product.artisan +
      '</span><span>' +
      artisanMeta.shop +
      '</span></div>' +
      '<div class="meta-row"><span>' +
      product.category +
      '</span><span>' +
      product.location +
      " • " +
      artisanMeta.rating.toFixed(1) +
      "★" +
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

  function buildAdminPanel() {
    if (!isAdminUser()) {
      return null;
    }

    var main = document.querySelector("main.page-main");
    var filters = document.querySelector(".filters-wrap");

    if (!main || !filters) {
      return null;
    }

    var existing = document.getElementById("adminProductPanel");
    if (existing) {
      return existing;
    }

    var panel = document.createElement("section");
    panel.className = "section-block";
    panel.id = "adminProductPanel";
    panel.innerHTML =
      '<div class="admin-panel glass">' +
      '<p class="eyebrow">Admin Controls</p>' +
      '<h3>Manage Products</h3>' +
      '<form id="adminProductForm" class="admin-form-grid" novalidate>' +
      '<input type="hidden" id="adminProductId" />' +
      '<input type="text" id="adminProductName" placeholder="Product name" required />' +
      '<input type="number" id="adminProductPrice" placeholder="Price" min="0" required />' +
      '<input type="text" id="adminProductCategory" placeholder="Category" required />' +
      '<input type="text" id="adminProductImage" placeholder="Image path" required />' +
      '<input type="text" id="adminProductArtisan" placeholder="Artisan name" required />' +
      '<input type="text" id="adminProductLocation" placeholder="Location" required />' +
      '<textarea class="field-full" id="adminProductDescription" placeholder="Description" required></textarea>' +
      '<button type="submit" class="btn btn-primary">Save Product</button>' +
      '<button type="button" class="btn btn-ghost" id="adminProductReset">Reset</button>' +
      '</form>' +
      '<div class="admin-product-list" id="adminProductList"></div>' +
      '</div>';

    filters.insertAdjacentElement("afterend", panel);
    return panel;
  }

  function fillAdminForm(product) {
    var id = document.getElementById("adminProductId");
    var name = document.getElementById("adminProductName");
    var price = document.getElementById("adminProductPrice");
    var category = document.getElementById("adminProductCategory");
    var image = document.getElementById("adminProductImage");
    var artisan = document.getElementById("adminProductArtisan");
    var location = document.getElementById("adminProductLocation");
    var description = document.getElementById("adminProductDescription");

    if (!id || !name || !price || !category || !image || !artisan || !location || !description) {
      return;
    }

    id.value = product ? product.id : "";
    name.value = product ? product.name : "";
    price.value = product ? String(product.price) : "";
    category.value = product ? product.category : "";
    image.value = product ? product.image : "";
    artisan.value = product ? product.artisan : "";
    location.value = product ? product.location : "";
    description.value = product ? product.description : "";
  }

  function renderAdminProductList(onRefresh) {
    var list = document.getElementById("adminProductList");
    if (!list) {
      return;
    }

    list.innerHTML = PRODUCTS.slice(0, 20)
      .map(function (product) {
        return (
          '<article class="admin-product-item">' +
          '<div><h4>' +
          product.name +
          '</h4><p>' +
          formatINR(product.price) +
          " • " +
          product.category +
          '</p></div>' +
          '<div class="actions">' +
          '<button type="button" class="btn btn-ghost btn-small" data-admin-edit="' +
          product.id +
          '">Edit</button>' +
          '<button type="button" class="btn btn-primary btn-small" data-admin-delete="' +
          product.id +
          '">Delete</button>' +
          '</div>' +
          '</article>'
        );
      })
      .join("");

    list.querySelectorAll("[data-admin-edit]").forEach(function (button) {
      button.addEventListener("click", function () {
        var product = getProductById(button.getAttribute("data-admin-edit"));
        fillAdminForm(product || null);
      });
    });

    list.querySelectorAll("[data-admin-delete]").forEach(function (button) {
      button.addEventListener("click", async function () {
        var productId = button.getAttribute("data-admin-delete");

        if (!window.confirm("Delete this product?")) {
          return;
        }

        try {
          await apiRequest("/api/products/" + encodeURIComponent(productId), {
            method: "DELETE",
            auth: true
          });
          await loadProductsFromAPI();
          onRefresh();
          renderAdminProductList(onRefresh);
          uiToast("Product deleted.", "success");
        } catch (error) {
          uiToast(error.message || "Unable to delete product.", "error");
        }
      });
    });
  }

  function initAdminProductTools(onRefresh) {
    if (!isAdminUser()) {
      return;
    }

    var panel = buildAdminPanel();
    if (!panel) {
      return;
    }

    var form = document.getElementById("adminProductForm");
    var reset = document.getElementById("adminProductReset");

    if (form && !form.dataset.bound) {
      form.dataset.bound = "true";

      form.addEventListener("submit", async function (event) {
        event.preventDefault();

        var payload = {
          name: document.getElementById("adminProductName").value.trim(),
          price: Number(document.getElementById("adminProductPrice").value),
          category: document.getElementById("adminProductCategory").value.trim(),
          image: document.getElementById("adminProductImage").value.trim(),
          artisan: document.getElementById("adminProductArtisan").value.trim(),
          location: document.getElementById("adminProductLocation").value.trim(),
          description: document.getElementById("adminProductDescription").value.trim()
        };

        if (
          !payload.name ||
          !payload.price ||
          !payload.category ||
          !payload.image ||
          !payload.artisan ||
          !payload.location ||
          !payload.description
        ) {
          uiToast("Please fill all admin product fields.", "error");
          return;
        }

        var productId = document.getElementById("adminProductId").value;

        try {
          if (productId) {
            await apiRequest("/api/products/" + encodeURIComponent(productId), {
              method: "PUT",
              auth: true,
              body: payload
            });
            uiToast("Product updated.", "success");
          } else {
            await apiRequest("/api/products", {
              method: "POST",
              auth: true,
              body: payload
            });
            uiToast("Product added.", "success");
          }

          fillAdminForm(null);
          await loadProductsFromAPI();
          onRefresh();
          renderAdminProductList(onRefresh);
        } catch (error) {
          uiToast(error.message || "Unable to save product.", "error");
        }
      });
    }

    if (reset && !reset.dataset.bound) {
      reset.dataset.bound = "true";
      reset.addEventListener("click", function () {
        fillAdminForm(null);
      });
    }

    renderAdminProductList(onRefresh);
  }

  function initHomePage() {
    renderProductsInto("featuredProducts", PRODUCTS.slice(0, 8));
    renderProductsInto("dealProducts", PRODUCTS.slice(8, 14));
    renderProductsInto("suggestedProducts", PRODUCTS.slice(6, 18));
    renderArtisansInto("featuredArtisans", ARTISANS.slice(0, 6));
    renderArtisansInto("topArtisans", ARTISANS.slice(6, 12));
  }

  function initProductsPage() {
    var urlParams = new URLSearchParams(window.location.search);
    var search = document.getElementById("productSearch");
    var searchBySelect = document.getElementById("productSearchBy");
    var categories = document.getElementById("categoryFilters");
    var priceFilters = document.getElementById("priceFilters");
    var sortSelect = document.getElementById("productSort");
    var activeCategory = "All";
    var activeSearch = String(urlParams.get("search") || "").trim();
    var activeSearchBy = "all";
    var activePriceCap = 0;
    var activeSort = "popular";

    function applyFilters() {
      var query = activeSearch.toLowerCase();
      var filtered = PRODUCTS
        .filter(function (product) {
          var categoryMatch = activeCategory === "All" || product.category === activeCategory;
          var priceMatch = !activePriceCap || product.price <= activePriceCap;
          var artisanMeta = getArtisanMeta(product.artisan);
          var productMatch = product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
          var artisanMatch = product.artisan.toLowerCase().includes(query);
          var shopMatch = artisanMeta.shop.toLowerCase().includes(query);
          var placeMatch = product.location.toLowerCase().includes(query);
          var searchMatch = true;

          if (query) {
            if (activeSearchBy === "product") {
              searchMatch = productMatch;
            } else if (activeSearchBy === "artisan") {
              searchMatch = artisanMatch;
            } else if (activeSearchBy === "shop") {
              searchMatch = shopMatch;
            } else if (activeSearchBy === "place") {
              searchMatch = placeMatch;
            } else {
              searchMatch = productMatch || artisanMatch || shopMatch || placeMatch;
            }
          }

          return categoryMatch && priceMatch && searchMatch;
        })
        .sort(function (left, right) {
          if (activeSort === "low-high") {
            return left.price - right.price;
          }

          if (activeSort === "high-low") {
            return right.price - left.price;
          }

          if (activeSort === "newest") {
            return new Date(right.launchedAt).getTime() - new Date(left.launchedAt).getTime();
          }

          return right.popularity - left.popularity;
        });

      renderProductsInto("productsGrid", filtered);
    }

    if (search) {
      search.value = activeSearch;
    }

    if (searchBySelect) {
      activeSearchBy = searchBySelect.value;
    }

    applyFilters();
    initAdminProductTools(applyFilters);

    if (search) {
      search.addEventListener("input", function () {
        activeSearch = search.value.trim();
        applyFilters();
      });
    }

    if (searchBySelect) {
      searchBySelect.addEventListener("change", function () {
        activeSearchBy = searchBySelect.value;
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

    if (priceFilters) {
      priceFilters.querySelectorAll("[data-price-cap]").forEach(function (button) {
        button.addEventListener("click", function () {
          priceFilters.querySelectorAll("[data-price-cap]").forEach(function (node) {
            node.classList.remove("is-active");
          });

          activePriceCap = Number(button.getAttribute("data-price-cap") || "0");
          button.classList.add("is-active");
          applyFilters();
        });
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        activeSort = sortSelect.value;
        applyFilters();
      });
    }
  }

  function initArtisansPage() {
    var search = document.getElementById("artisanSearch");
    var craftFilters = document.getElementById("artisanFilters");
    var activeSearch = "";
    var activeCraft = "All";

    function applyFilters() {
      var query = activeSearch.toLowerCase();
      var filtered = ARTISANS.filter(function (artisan) {
        var craftMatch = activeCraft === "All" || artisan.craft.toLowerCase().includes(activeCraft.toLowerCase());
        var searchMatch =
          !query ||
          artisan.name.toLowerCase().includes(query) ||
          artisan.location.toLowerCase().includes(query) ||
          artisan.craft.toLowerCase().includes(query);

        return craftMatch && searchMatch;
      });

      renderArtisansInto("artisansGrid", filtered);
    }

    applyFilters();

    if (search) {
      search.addEventListener("input", function () {
        activeSearch = search.value.trim();
        applyFilters();
      });
    }

    if (craftFilters) {
      craftFilters.querySelectorAll("[data-craft]").forEach(function (button) {
        button.addEventListener("click", function () {
          craftFilters.querySelectorAll("[data-craft]").forEach(function (node) {
            node.classList.remove("is-active");
          });

          activeCraft = button.getAttribute("data-craft") || "All";
          button.classList.add("is-active");
          applyFilters();
        });
      });
    }
  }

  async function initProductDetailsPage() {
    var root = document.getElementById("productDetails");
    var cityProductsRoot = document.getElementById("cityProducts");
    var attractionRoot = document.getElementById("localAttractions");

    if (!root) {
      return;
    }

    var queryId = String(new URLSearchParams(window.location.search).get("id") || "");
    var product = getProductById(queryId);

    if (!product && queryId) {
      product = await fetchProductById(queryId);
    }

    if (!product) {
      product = PRODUCTS[0] || null;
    }

    if (!product) {
      root.innerHTML = '<p class="empty-state">Unable to load product details right now.</p>';
      return;
    }

    var artisanMeta = getArtisanMeta(product.artisan);
    var locationProducts = PRODUCTS.filter(function (item) {
      return item.location === product.location && item.id !== product.id;
    }).sort(function (left, right) {
      return getArtisanMeta(right.artisan).rating - getArtisanMeta(left.artisan).rating;
    });

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
      '. Top store: ' +
      artisanMeta.shop +
      " (" +
      artisanMeta.rating.toFixed(1) +
      "★).</p>" +
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
        return item.id !== product.id && item.category === product.category;
      }).slice(0, 8)
    );

    if (cityProductsRoot) {
      if (!locationProducts.length) {
        cityProductsRoot.innerHTML = '<p class="empty-state">No more products from this place yet.</p>';
      } else {
        cityProductsRoot.innerHTML = locationProducts.map(productCardMarkup).join("");
        applyStagger(cityProductsRoot, ".product-card");
      }
    }

    if (attractionRoot) {
      var attractions = CITY_ATTRACTIONS[product.location] || [
        "City Heritage Museum",
        "Main Craft Bazaar",
        "Local Food Street",
        "Historic Town Walk"
      ];

      attractionRoot.innerHTML = attractions
        .map(function (place) {
          return '<article class="attraction-card"><h4>' + place + '</h4><p>Popular spot near ' + product.location + " for culture and local experiences.</p></article>";
        })
        .join("");

      applyStagger(attractionRoot, ".attraction-card");
    }
  }

  async function initOrdersPage() {
    var root = document.getElementById("ordersList");
    var adminSection = document.getElementById("adminOrderSection");
    var adminForm = document.getElementById("adminOrderForm");

    if (!root) {
      return;
    }

    var user = getCurrentUser();
    var token = getAuthToken();

    if (!user || !token || !user.id) {
      root.innerHTML = '<article class="order-card"><h3>Please login to view your orders.</h3><a class="btn btn-primary" href="login.html">Go to Login</a></article>';
      return;
    }

    try {
      var endpoint = isAdminUser() ? "/api/orders" : "/api/orders/" + encodeURIComponent(user.id);
      var orders = await apiRequest(endpoint, {
        auth: true
      });

      if (!Array.isArray(orders) || !orders.length) {
        root.innerHTML = '<article class="order-card"><h3>No orders found yet.</h3><p>Checkout any item to create your first order.</p></article>';
      } else {
        root.innerHTML = orders
          .map(function (order) {
            var itemsMarkup = (order.products || [])
              .map(function (item) {
                return '<p>' + item.name + " x " + item.quantity + " - " + formatINR(item.price * item.quantity) + "</p>";
              })
              .join("");

            var statusClass = String(order.status || "Pending").toLowerCase();

            return (
              '<article class="order-card">' +
              '<div class="meta-row"><h3>Order #' +
              order._id +
              '</h3><span class="status-chip ' +
              statusClass +
              '">' +
              order.status +
              '</span></div>' +
              '<p>Total: ' +
              formatINR(order.totalAmount) +
              '</p>' +
              '<p>Placed: ' +
              new Date(order.createdAt).toLocaleString() +
              '</p>' +
              '<div>' +
              itemsMarkup +
              "</div>" +
              "</article>"
            );
          })
          .join("");
      }
    } catch (error) {
      root.innerHTML = '<article class="order-card"><h3>Unable to load orders.</h3><p>' + (error.message || "Please try again later.") + "</p></article>";
    }

    if (isAdminUser() && adminSection && adminForm) {
      adminSection.hidden = false;

      if (!adminForm.dataset.bound) {
        adminForm.dataset.bound = "true";

        adminForm.addEventListener("submit", async function (event) {
          event.preventDefault();

          var orderId = document.getElementById("adminOrderId").value.trim();
          var status = document.getElementById("adminOrderStatus").value;

          if (!orderId) {
            uiToast("Please provide order id.", "error");
            return;
          }

          try {
            await apiRequest("/api/orders/" + encodeURIComponent(orderId), {
              method: "PUT",
              auth: true,
              body: {
                status: status
              }
            });

            uiToast("Order status updated.", "success");
            initOrdersPage();
          } catch (error) {
            uiToast(error.message || "Unable to update order status.", "error");
          }
        });
      }
    }
  }

  function initCartInteractions() {
    var drawer = document.getElementById("cartDrawer");

    document.addEventListener("click", function (event) {
      var target = event.target;

      var addButton = target.closest("[data-add-to-cart]");
      if (addButton) {
        addToCart(addButton.getAttribute("data-add-to-cart"));
      }

      var cartToggle = target.closest("[data-cart-toggle]");
      if (cartToggle) {
        if (document.body.classList.contains("role-artisan")) {
          window.location.href = "artisans.html";
          return;
        }

        openCart();
      }

      var cartClose = target.closest("[data-cart-close]");
      if (cartClose || target.id === "drawerBackdrop") {
        closeCart();
      }

      var decrease = target.closest("[data-cart-decrease]");
      if (decrease) {
        decreaseCartItem(decrease.getAttribute("data-cart-decrease"));
      }

      var increase = target.closest("[data-cart-increase]");
      if (increase) {
        increaseCartItem(increase.getAttribute("data-cart-increase"));
      }

      var checkout = target.closest("[data-checkout]");
      if (checkout) {
        handleCheckout();
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

  async function initByPage() {
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
      await initProductDetailsPage();
    }

    if (page === "orders") {
      await initOrdersPage();
    }
  }

  document.addEventListener("DOMContentLoaded", async function () {
    initCartInteractions();
    await loadProductsFromAPI();
    await syncCartFromBackend();
    updateCartBadge();
    renderCart();
    await initByPage();
  });
})();
