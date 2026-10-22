/* Shared behaviour: layout chrome, cart, wishlist, product cards, motion. */
(function () {
  "use strict";

  var A = window.AURELLE;
  var BASE = document.body.getAttribute("data-base") || "";
  var PAGE = document.body.getAttribute("data-page") || "";
  var FREE_SHIP = 25000;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Icons ------------------------------------------------------------------ */
  var I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.3-9.2C1.5 7.6 3.6 4.5 6.9 4.5c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.3 0 5.4 3.1 4.2 6.3C19.5 15.4 12 20 12 20Z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 8h14l-1 12.5H6L5 8Z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 7h18M3 12h12M3 17h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="1"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.8 2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.8 3.3 1.4-6.4-4.9-4.4 6.5-.7L12 2.8Z"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".8" fill="currentColor"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10.5 8.5c3-1.5 6 .5 5 3.5-.7 2-3.2 2.5-4 1m.7-2.5L10 20"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4"/><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5S10.5 4 8 4.5 7 8.5 12 8.5Zm0 0s1.5-4.5 4-4 1 4-4 4Z"/></svg>'
  };
  A.icons = I;

  /* Storage (guarded: private mode can throw) ------------------------------- */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* non-critical */ }
  }

  /* Layout chrome ---------------------------------------------------------- */
  var navLinks = [
    { href: "pages/collections.html?cat=rings", label: "Rings", key: "rings" },
    { href: "pages/collections.html?cat=earrings", label: "Earrings", key: "earrings" },
    { href: "pages/collections.html?cat=necklaces", label: "Necklaces", key: "necklaces" },
    { href: "pages/collections.html?cat=bracelets", label: "Bracelets", key: "bracelets" },
    { href: "pages/collections.html?occasion=bridal", label: "Bridal", key: "bridal" },
    { href: "pages/collections.html?occasion=gift", label: "Gifts", key: "gift" }
  ];
  function u(path) { return BASE + path; }

  function headerHTML() {
    var links = navLinks.map(function (l) { return '<li><a href="' + u(l.href) + '" data-nav="' + l.key + '">' + l.label + "</a></li>"; }).join("");
    return '' +
      '<div class="announcement" role="region" aria-label="Store information"><div class="container announcement__inner">' +
        "<span>Complimentary insured delivery across India over ₹25,000</span>" +
        "<span>15-day returns &amp; free size exchanges</span>" +
        '<span><a href="' + u("pages/help.html#contact") + '">Client care · Mon–Sat, 10–7</a></span>' +
      "</div></div>" +
      '<header class="site-header" id="site-header"><div class="container header-inner">' +
        '<div class="header-left">' +
          '<button class="util-link menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" data-open-menu>Menu</button>' +
          '<nav class="main-nav" aria-label="Main"><ul role="list">' + links + "</ul></nav>" +
        "</div>" +
        '<a class="logo" href="' + u("index.html") + '" aria-label="Aurelle — home">Aurelle</a>' +
        '<div class="header-right">' +
          '<button class="icon-btn mobile-only" type="button" aria-label="Search" data-open-search>' + I.search + "</button>" +
          '<button class="util-link hide-mobile" type="button" data-open-search>Search</button>' +
          '<a class="util-link hide-mobile" href="' + u("pages/collections.html?wishlist=1") + '">Wishlist<span class="count" data-wish-count>0</span></a>' +
          '<button class="util-link" type="button" aria-controls="cart-drawer" data-open-cart>Bag<span class="count" data-cart-count>0</span></button>' +
        "</div>" +
      "</div></header>";
  }

  function overlaysHTML() {
    var mobileLinks = navLinks.map(function (l, i) {
      return '<li><a href="' + u(l.href) + '"><small>0' + (i + 1) + "</small>" + l.label + "</a></li>";
    }).join("");
    return '' +
      '<div class="mobile-nav" id="mobile-nav" aria-hidden="true">' +
        '<div class="mobile-nav__backdrop" data-close-menu></div>' +
        '<div class="mobile-nav__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
          '<div class="mobile-nav__top"><span class="logo">Aurelle</span><button class="util-link" type="button" data-close-menu>Close</button></div>' +
          '<ul class="mobile-nav__links" role="list">' + mobileLinks + "</ul>" +
          '<a class="mobile-nav__feature" href="' + u("pages/collections.html?sort=newest") + '"><img src="' + A.img("1611085583191-a3b181a88401", 200) + '" alt="" loading="lazy"><span><b>New arrivals</b>Eight new pieces this season</span></a>' +
          '<div class="mobile-nav__meta"><a href="' + u("pages/collections.html?wishlist=1") + '">Wishlist</a><a href="' + u("pages/help.html#contact") + '">Contact & appointments</a><a href="' + u("pages/help.html#shipping") + '">Shipping & returns</a><a href="' + u("pages/help.html#size-guide") + '">Size guide</a></div>' +
        "</div>" +
      "</div>" +
      '<div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true"><div class="container">' +
        '<form action="' + u("pages/collections.html") + '" method="get" role="search">' +
          '<label class="sr-only" for="search-input">Search jewellery</label>' + I.search.replace('aria-hidden="true"', 'aria-hidden="true" width="26"') +
          '<input id="search-input" name="q" type="search" placeholder="Search rings, pearls, gold hoops…" autocomplete="off">' +
          '<button class="icon-btn" type="button" aria-label="Close search" data-close-search>' + I.close + "</button>" +
        "</form>" +
        '<div class="search-overlay__suggest"><span class="small muted">Popular:</span>' +
          ["Hoops", "Pearl", "Solitaire", "Stacking rings", "Chain"].map(function (s) { return '<a class="chip" href="' + u("pages/collections.html?q=" + encodeURIComponent(s)) + '">' + s + "</a>"; }).join("") +
        "</div>" +
      "</div></div>" +
      '<div class="overlay-scrim" data-scrim></div>' +
      '<aside class="drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden="true">' +
        '<div class="drawer__head"><h2 id="cart-title">Your bag</h2><button class="icon-btn" type="button" aria-label="Close bag" data-close-cart>' + I.close + "</button></div>" +
        '<div class="drawer__body" data-cart-body></div>' +
        '<div class="drawer__foot" data-cart-foot></div>' +
      "</aside>" +
      '<div class="toast" role="status" aria-live="polite" data-toast>' + I.check + "<span></span></div>";
  }

  function footerHTML() {
    function col(title, items) {
      return "<div><h3>" + title + '</h3><ul role="list">' + items.map(function (i) { return '<li><a href="' + u(i[1]) + '">' + i[0] + "</a></li>"; }).join("") + "</ul></div>";
    }
    return '' +
      '<footer class="site-footer"><div class="container">' +
        '<div class="footer-top">' +
          '<div class="footer-brand">' +
            "<p>Solid gold jewellery, honestly described and made to be worn for decades.</p>" +
            '<div class="socials"><a href="#">Instagram</a><a href="#">Pinterest</a><a href="#">YouTube</a><a href="' + u("pages/help.html#contact") + '">WhatsApp</a></div>' +
          "</div>" +
          '<div class="footer-cols">' +
            col("Shop", [["Rings", "pages/collections.html?cat=rings"], ["Earrings", "pages/collections.html?cat=earrings"], ["Necklaces", "pages/collections.html?cat=necklaces"], ["Bracelets", "pages/collections.html?cat=bracelets"], ["Bridal", "pages/collections.html?occasion=bridal"]]) +
            col("Client care", [["Contact us", "pages/help.html#contact"], ["Shipping", "pages/help.html#shipping"], ["Returns & exchanges", "pages/help.html#returns"], ["Track your order", "pages/help.html#tracking"], ["FAQ", "pages/help.html#faq"]]) +
            col("Guides", [["Ring size guide", "pages/help.html#size-guide"], ["Jewellery care", "pages/help.html#care"], ["Gold purity explained", "pages/help.html#materials"], ["Gift guide", "pages/collections.html?occasion=gift"]]) +
            col("Aurelle", [["Our approach", "index.html#approach"], ["Privacy policy", "pages/help.html#privacy"], ["Terms of service", "pages/help.html#terms"], ["Accessibility", "pages/help.html#accessibility"]]) +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<p>© <span data-year></span> Aurelle. Concept prototype — product details are placeholders.</p>" +
          '<p class="payments" aria-label="Accepted payments"><span>UPI</span><span>Visa</span><span>Mastercard</span><span>RuPay</span><span>Net banking</span></p>' +
        "</div>" +
      "</div>" +
      '<div class="footer-giant" aria-hidden="true">Aurelle</div>' +
      "</footer>";
  }

  var headerSlot = document.querySelector("[data-include='header']");
  var footerSlot = document.querySelector("[data-include='footer']");
  if (headerSlot) headerSlot.outerHTML = headerHTML();
  if (footerSlot) footerSlot.outerHTML = footerHTML();
  document.body.insertAdjacentHTML("beforeend", overlaysHTML());

  // Mark current nav item
  var params = new URLSearchParams(location.search);
  var activeKey = params.get("cat") || params.get("occasion");
  if (activeKey) {
    var cur = document.querySelector('[data-nav="' + activeKey + '"]');
    if (cur) cur.setAttribute("aria-current", "page");
  }
  document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* Header hide-on-scroll -------------------------------------------------- */
  var header = document.getElementById("site-header");
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    header.classList.toggle("is-hidden", y > 400 && y > lastY + 4 && !document.body.classList.contains("is-locked"));
    if (y < lastY - 4) header.classList.remove("is-hidden");
    lastY = y;
    parallax();
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* Parallax (subtle; disabled for reduced motion) ------------------------- */
  var parallaxEls = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  function parallax() {
    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      var offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });
  }
  parallax();

  /* Overlay management with focus return ---------------------------------- */
  var scrim = document.querySelector("[data-scrim]");
  var openPanel = null;
  var lastFocus = null;

  function openOverlay(el, useScrim) {
    closeOverlay();
    lastFocus = document.activeElement;
    openPanel = el;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    if (useScrim) scrim.classList.add("is-visible");
    document.body.classList.add("is-locked");
    var focusable = el.querySelector("input, button, a[href]");
    setTimeout(function () { if (focusable) focusable.focus(); }, 80);
  }
  function closeOverlay() {
    if (!openPanel) return;
    openPanel.classList.remove("is-open");
    openPanel.setAttribute("aria-hidden", "true");
    scrim.classList.remove("is-visible");
    document.body.classList.remove("is-locked");
    var toggle = document.querySelector("[data-open-menu]");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    openPanel = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  A.openOverlay = openOverlay;
  A.closeOverlay = closeOverlay;

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeOverlay();
    // Keep keyboard focus inside the open panel
    if (e.key === "Tab" && openPanel) {
      var items = openPanel.querySelectorAll("a[href], button:not([disabled]), input, select, [tabindex='0']");
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  scrim.addEventListener("click", closeOverlay);

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open-menu],[data-close-menu],[data-open-search],[data-close-search],[data-open-cart],[data-close-cart],[data-wish],[data-quick-add],[data-checkout],[data-modal-open],[data-modal-close]");
    if (!t) return;
    if (t.hasAttribute("data-open-menu")) { openOverlay(document.getElementById("mobile-nav")); t.setAttribute("aria-expanded", "true"); }
    else if (t.hasAttribute("data-open-search")) openOverlay(document.getElementById("search-overlay"), true);
    else if (t.hasAttribute("data-open-cart")) { renderCart(); openOverlay(document.getElementById("cart-drawer"), true); }
    else if (t.hasAttribute("data-close-menu") || t.hasAttribute("data-close-search") || t.hasAttribute("data-close-cart") || t.hasAttribute("data-modal-close")) closeOverlay();
    else if (t.hasAttribute("data-wish")) { e.preventDefault(); toggleWish(t.getAttribute("data-wish")); }
    else if (t.hasAttribute("data-quick-add")) {
      e.preventDefault();
      var p = A.find(t.getAttribute("data-quick-add"));
      if (p && p.sizes) { location.href = productUrl(p) + "#options"; return; }
      addToCart(p.id, { metal: p.metal, size: null }, 1, true);
    }
    else if (t.hasAttribute("data-checkout")) {
      e.preventDefault();
      toast("Checkout isn't connected in this prototype — a secure payment provider is added at the commerce stage.");
    }
    else if (t.hasAttribute("data-modal-open")) {
      e.preventDefault();
      openOverlay(document.getElementById(t.getAttribute("data-modal-open")));
    }
  });

  /* Toast ------------------------------------------------------------------ */
  var toastEl = document.querySelector("[data-toast]");
  var toastTimer;
  function toast(msg) {
    toastEl.querySelector("span").textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 3600);
  }
  A.toast = toast;

  /* Wishlist --------------------------------------------------------------- */
  var wish = load("aurelle-wish", []);
  function updateWishUI() {
    var c = document.querySelector("[data-wish-count]");
    if (c) c.textContent = wish.length;
    document.querySelectorAll("[data-wish]").forEach(function (b) {
      var on = wish.indexOf(b.getAttribute("data-wish")) > -1;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", (on ? "Remove from" : "Save to") + " wishlist");
    });
  }
  function toggleWish(id) {
    var i = wish.indexOf(id);
    var p = A.find(id);
    if (i > -1) { wish.splice(i, 1); toast(p.name + " removed from your wishlist"); }
    else { wish.push(id); toast(p.name + " saved to your wishlist"); }
    save("aurelle-wish", wish);
    updateWishUI();
  }
  A.getWish = function () { return wish.slice(); };
  A.updateWishUI = updateWishUI;

  /* Cart ------------------------------------------------------------------- */
  var cart = load("aurelle-cart", { items: [], giftWrap: false });

  function lineKey(id, v) { return id + "|" + (v.metal || "") + "|" + (v.size || ""); }

  function addToCart(id, variant, qty, open) {
    var key = lineKey(id, variant);
    var line = cart.items.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty = Math.min(line.qty + qty, 5);
    else cart.items.push({ key: key, id: id, metal: variant.metal, size: variant.size, qty: qty });
    save("aurelle-cart", cart);
    updateCartCount(true);
    if (open) { renderCart(); openOverlay(document.getElementById("cart-drawer"), true); }
  }
  A.addToCart = addToCart;

  function cartTotal() {
    return cart.items.reduce(function (s, l) { var p = A.find(l.id); return s + (p ? p.price * l.qty : 0); }, 0);
  }

  function updateCartCount(bump) {
    var n = cart.items.reduce(function (s, l) { return s + l.qty; }, 0);
    var c = document.querySelector("[data-cart-count]");
    c.textContent = n;
    if (bump) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
  }

  function renderCart() {
    var body = document.querySelector("[data-cart-body]");
    var foot = document.querySelector("[data-cart-foot]");
    if (!cart.items.length) {
      body.innerHTML = '<div class="cart-empty">' + I.bag + '<h3>Your bag is empty</h3><p>Discover pieces made to be treasured.</p><a class="btn" href="' + u("pages/collections.html") + '">Shop the collection</a></div>';
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    var total = cartTotal();
    var remaining = Math.max(FREE_SHIP - total, 0);
    var pct = Math.min(total / FREE_SHIP * 100, 100);
    body.innerHTML =
      '<div class="ship-progress">' + (remaining ? "You're <b>" + A.formatPrice(remaining) + "</b> away from complimentary insured shipping." : "<b>You've unlocked complimentary insured shipping.</b>") +
      '<div class="bar"><i style="width:' + pct + '%"></i></div></div>' +
      cart.items.map(function (l) {
        var p = A.find(l.id);
        if (!p) return "";
        return '<div class="cart-item" data-line="' + l.key + '">' +
          '<a href="' + productUrl(p) + '"><img src="' + A.img(p.photo, 200) + '" alt="' + p.name + '" width="84" height="105" loading="lazy"></a>' +
          "<div>" +
            '<div class="cart-item__top"><div><h3><a href="' + productUrl(p) + '">' + p.name + '</a></h3><p class="variant">' + p.purity + " " + A.metalNames[l.metal || p.metal] + (l.size ? " · Size " + l.size : "") + "</p></div><b class=\"small\">" + A.formatPrice(p.price * l.qty) + "</b></div>" +
            '<div class="cart-item__bottom">' +
              '<div class="qty"><button type="button" aria-label="Decrease quantity" data-qty="-1">−</button><input type="number" value="' + l.qty + '" min="1" max="5" aria-label="Quantity for ' + p.name + '" readonly><button type="button" aria-label="Increase quantity" data-qty="1">+</button></div>' +
              '<button class="remove-btn" type="button" data-remove>Remove</button>' +
            "</div>" +
          "</div></div>";
      }).join("");
    foot.innerHTML =
      '<label class="gift-wrap"><input type="checkbox" data-gift-wrap ' + (cart.giftWrap ? "checked" : "") + '> Add complimentary gift wrapping & a handwritten note</label>' +
      '<div class="cart-row"><span>Subtotal</span><span>' + A.formatPrice(total) + "</span></div>" +
      '<div class="cart-row"><span>Shipping</span><span>' + (remaining ? "Calculated at checkout" : "Complimentary") + "</span></div>" +
      '<div class="cart-row cart-row--total"><span>Total</span><span>' + A.formatPrice(total) + "</span></div>" +
      '<p class="small muted">Prices include GST. Delivery estimate shown at checkout.</p>' +
      '<a class="btn btn--block" href="#" data-checkout>Secure checkout ' + I.lock + "</a>" +
      '<p class="secure-note">' + I.lock + " Encrypted payment · UPI, cards & net banking</p>";
  }

  document.addEventListener("click", function (e) {
    var line = e.target.closest("[data-line]");
    if (!line) return;
    var key = line.getAttribute("data-line");
    var item = cart.items.filter(function (l) { return l.key === key; })[0];
    if (!item) return;
    var q = e.target.closest("[data-qty]");
    if (q) {
      item.qty = Math.max(1, Math.min(5, item.qty + parseInt(q.getAttribute("data-qty"), 10)));
      if (item.qty === 5 && q.getAttribute("data-qty") === "1") toast("Maximum of 5 per item for this piece.");
    } else if (e.target.closest("[data-remove]")) {
      cart.items = cart.items.filter(function (l) { return l.key !== key; });
      toast("Item removed from your bag");
    } else return;
    save("aurelle-cart", cart);
    updateCartCount(false);
    renderCart();
  });
  document.addEventListener("change", function (e) {
    if (e.target.matches("[data-gift-wrap]")) { cart.giftWrap = e.target.checked; save("aurelle-cart", cart); }
  });

  /* Product card ----------------------------------------------------------- */
  function productUrl(p) { return u("pages/product.html?id=" + p.id); }
  A.productUrl = productUrl;

  function card(p, i) {
    var badge = p.stock === "low" ? '<span class="product-card__badge product-card__badge--low">Few left</span>' :
      p.badge ? '<span class="product-card__badge">' + p.badge + "</span>" :
      p.isNew ? '<span class="product-card__badge">New</span>' : "";
    var sizes = "(min-width: 1024px) 25vw, 50vw";
    return '<article class="product-card reveal" style="--d:' + ((i % 4) * 0.08) + 's">' +
      '<div class="product-card__media">' + badge +
        '<img class="img-main" src="' + A.img(p.photo, 700) + '" srcset="' + A.srcset(p.photo) + '" sizes="' + sizes + '" alt="' + p.alt + '" width="700" height="875" loading="lazy" decoding="async">' +
        '<img class="img-alt" src="' + A.img(p.photo, 700, { zoom: 1.8, fx: p.fx, fy: p.fy }) + '" alt="" width="700" height="875" loading="lazy" decoding="async">' +
        '<button class="wish-btn" type="button" data-wish="' + p.id + '" aria-pressed="false" aria-label="Save to wishlist">' + I.heart + "</button>" +
        '<button class="quick-add" type="button" data-quick-add="' + p.id + '">' + (p.sizes ? "Choose a size" : "Add to bag") + "</button>" +
      "</div>" +
      '<div class="product-card__info">' +
        '<h3 class="product-card__title"><a href="' + productUrl(p) + '">' + p.name + "</a></h3>" +
        '<span class="product-card__price">' + A.formatPrice(p.price) + "</span>" +
        '<span class="product-card__meta">' + p.purity + " " + A.metalNames[p.metal] + (p.stone !== "none" ? " · " + A.stoneNames[p.stone] : "") + "</span>" +
      "</div></article>";
  }
  A.card = card;

  A.renderGrid = function (el, list) {
    el.innerHTML = list.map(card).join("");
    updateWishUI();
    observeReveals(el);
  };

  /* Reveal on scroll ------------------------------------------------------- */
  var io = "IntersectionObserver" in window && !reduceMotion ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("is-inview"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }) : null;

  function observeReveals(root) {
    (root || document).querySelectorAll(".reveal, .reveal-img, [data-observe]").forEach(function (el) {
      if (io) io.observe(el); else el.classList.add("is-inview");
    });
  }
  A.observeReveals = observeReveals;

  /* Newsletter ------------------------------------------------------------- */
  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector("input[type=email]");
      var err = form.querySelector(".field-error");
      var consent = form.querySelector("input[type=checkbox]");
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      if (!ok) {
        input.setAttribute("aria-invalid", "true");
        err.textContent = "Please enter a valid email address, e.g. name@example.com";
        input.focus();
        return;
      }
      if (consent && !consent.checked) {
        input.removeAttribute("aria-invalid");
        err.textContent = "Please confirm you'd like to receive emails from us.";
        consent.focus();
        return;
      }
      form.outerHTML = '<p class="form-success" role="status">' + I.check + " Thank you — please check your inbox to confirm.</p>";
    });
  });

  /* Init ------------------------------------------------------------------- */
  updateWishUI();
  updateCartCount(false);
  observeReveals();
  onScroll();

  document.dispatchEvent(new CustomEvent("aurelle:ready"));
})();
