/* Collection page: filtering, sorting, URL state, mobile filter drawer. */
(function () {
  "use strict";

  var A = window.AURELLE;
  var params = new URLSearchParams(location.search);
  var grid = document.querySelector("[data-grid]");
  var form = document.querySelector("[data-filter-form]");
  var countEl = document.querySelector("[data-count]");
  var activeEl = document.querySelector("[data-active]");
  var sortEl = document.querySelector("[data-sort]");
  var priceEl = form.querySelector("[name=max]");
  var priceOut = document.querySelector("[data-price-out]");

  var copy = {
    "": ["All <em>jewellery</em>", "All jewellery", "Solid gold pieces in 14K, 18K and 22K — each described with its metal, purity, dimensions and weight so you can choose with confidence."],
    rings: ["<em>Rings</em>", "Rings", "From whisper-fine stacking bands to statement solitaires. Not sure of your size? Our size guide and free exchanges have you covered."],
    earrings: ["<em>Earrings</em>", "Earrings", "Sculpted hoops, drops and everyday studs — light enough to wear all day."],
    necklaces: ["<em>Necklaces</em>", "Necklaces", "Pendants, pearls and chains designed to be layered. Chain lengths are listed on every piece."],
    bracelets: ["<em>Bracelets</em>", "Bracelets", "Chains and pavé bracelets with secure clasps, sized to suit every wrist."],
    bridal: ["The <em>bridal</em> edit", "Bridal", "Engagement rings, wedding bands and heirloom pieces for the most meaningful day."],
    gift: ["The <em>gift</em> edit", "Gifts", "Thoughtful pieces, beautifully wrapped, with free size exchanges within 15 days."],
    wishlist: ["Your <em>wishlist</em>", "Wishlist", "Pieces you've saved. Your wishlist is stored on this device."]
  };

  var facets = {
    metal: { label: function (v) { return A.metalNames[v]; }, values: ["yellow", "rose", "white"] },
    purity: { label: function (v) { return v + " Gold"; }, values: ["14K", "18K", "22K"] },
    stone: { label: function (v) { return A.stoneNames[v]; }, values: ["none", "diamond", "pearl", "sapphire", "gemstone"] },
    occasion: { label: function (v) { return { everyday: "Everyday", gift: "Gifting", bridal: "Bridal", statement: "Statement" }[v]; }, values: ["everyday", "gift", "bridal", "statement"] }
  };

  var state = {
    cat: params.get("cat") || "",
    q: (params.get("q") || "").trim(),
    wishlist: params.get("wishlist") === "1",
    sort: params.get("sort") || "featured",
    max: parseInt(params.get("max"), 10) || 190000,
    instock: params.get("instock") === "1",
    metal: params.getAll("metal"),
    purity: params.getAll("purity"),
    stone: params.getAll("stone"),
    occasion: params.getAll("occasion")
  };

  /* Header copy ------------------------------------------------------------ */
  var key = state.wishlist ? "wishlist" : state.cat || (state.occasion.length === 1 && copy[state.occasion[0]] ? state.occasion[0] : "");
  var c = copy[key] || copy[""];
  document.querySelector("[data-title]").innerHTML = state.q ? "Results for <em>“" + escapeHTML(state.q) + "”</em>" : c[0];
  document.querySelector("[data-crumb]").textContent = state.q ? "Search" : c[1];
  document.querySelector("[data-intro]").textContent = c[2];
  document.title = (state.q ? "Search: " + state.q : c[1]) + " | Aurelle Fine Jewellery";
  document.querySelectorAll("[data-cat-pill]").forEach(function (p) {
    if (p.getAttribute("data-cat-pill") === state.cat && !state.wishlist && !state.q) p.classList.add("is-active");
  });

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; });
  }

  /* Build facet checkboxes with counts ------------------------------------- */
  var base = A.products.filter(function (p) { return !state.cat || p.category === state.cat; });
  Object.keys(facets).forEach(function (name) {
    var box = document.querySelector('[data-facet="' + name + '"]');
    box.innerHTML = facets[name].values.map(function (v) {
      var n = base.filter(function (p) { return name === "occasion" ? p.occasion.indexOf(v) > -1 : p[name] === v; }).length;
      if (!n) return "";
      var checked = state[name].indexOf(v) > -1 ? " checked" : "";
      return '<label class="check"><input type="checkbox" name="' + name + '" value="' + v + '"' + checked + "> " + facets[name].label(v) + '<span class="n">' + n + "</span></label>";
    }).join("");
  });
  priceEl.value = state.max;
  form.querySelector("[name=instock]").checked = state.instock;
  sortEl.value = state.sort;

  /* Filter + sort ---------------------------------------------------------- */
  function results() {
    var wish = A.getWish();
    var q = state.q.toLowerCase();
    var list = A.products.filter(function (p) {
      if (state.wishlist && wish.indexOf(p.id) < 0) return false;
      if (state.cat && p.category !== state.cat) return false;
      if (q) {
        var hay = (p.name + " " + p.category + " " + p.desc + " " + A.metalNames[p.metal] + " " + p.stone + " " + p.purity).toLowerCase();
        if (!q.split(/\s+/).every(function (w) { return hay.indexOf(w.replace(/s$/, "")) > -1; })) return false;
      }
      if (p.price > state.max) return false;
      if (state.instock && p.stock !== "in") return false;
      if (state.metal.length && state.metal.indexOf(p.metal) < 0) return false;
      if (state.purity.length && state.purity.indexOf(p.purity) < 0) return false;
      if (state.stone.length && state.stone.indexOf(p.stone) < 0) return false;
      if (state.occasion.length && !state.occasion.some(function (o) { return p.occasion.indexOf(o) > -1; })) return false;
      return true;
    });
    var sorters = {
      featured: function (a, b) { return b.pop - a.pop; },
      newest: function (a, b) { return (b.isNew - a.isNew) || (b.pop - a.pop); },
      "price-asc": function (a, b) { return a.price - b.price; },
      "price-desc": function (a, b) { return b.price - a.price; }
    };
    return list.sort(sorters[state.sort] || sorters.featured);
  }

  function syncURL() {
    var p = new URLSearchParams();
    if (state.cat) p.set("cat", state.cat);
    if (state.q) p.set("q", state.q);
    if (state.wishlist) p.set("wishlist", "1");
    if (state.sort !== "featured") p.set("sort", state.sort);
    if (state.max < 190000) p.set("max", state.max);
    if (state.instock) p.set("instock", "1");
    ["metal", "purity", "stone", "occasion"].forEach(function (k) { state[k].forEach(function (v) { p.append(k, v); }); });
    var qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  function renderActive() {
    var chips = [];
    ["metal", "purity", "stone", "occasion"].forEach(function (k) {
      state[k].forEach(function (v) { chips.push({ k: k, v: v, label: facets[k].label(v) }); });
    });
    if (state.max < 190000) chips.push({ k: "max", label: "Under " + A.formatPrice(state.max) });
    if (state.instock) chips.push({ k: "instock", label: "Ready to ship" });
    if (state.q) chips.push({ k: "q", label: "“" + state.q + "”" });
    activeEl.innerHTML = chips.map(function (c) {
      return '<button class="chip" type="button" data-remove-filter="' + c.k + '" data-value="' + (c.v || "") + '" aria-label="Remove filter ' + escapeHTML(c.label) + '">' + escapeHTML(c.label) +
        ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>';
    }).join("") + (chips.length > 1 ? '<button class="chip" type="button" data-reset>Clear all</button>' : "");
  }

  function render() {
    var list = results();
    priceOut.textContent = state.max >= 190000 ? "Any price" : "Up to " + A.formatPrice(state.max);
    countEl.textContent = list.length + (list.length === 1 ? " piece" : " pieces");
    renderActive();
    if (!list.length) {
      grid.innerHTML = '<div class="empty-state">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M6 3h12l3 5-9 13L3 8l3-5Z"/><path d="M3 8h18"/></svg>' +
        (state.wishlist && !A.getWish().length
          ? "<h3>Your wishlist is empty</h3><p>Tap the heart on any piece to save it here.</p><a class=\"btn\" href=\"collections.html\">Discover jewellery</a>"
          : "<h3>No pieces match — yet</h3><p>Try removing a filter or widening your price range. Or let us help you find something special.</p>" +
            '<div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap"><button class="btn" type="button" data-reset>Reset filters</button><a class="btn btn--outline" href="help.html#contact">Ask a stylist</a></div>') +
        "</div>";
      return;
    }
    A.renderGrid(grid, list);
  }

  /* Events ----------------------------------------------------------------- */
  form.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "instock") state.instock = t.checked;
    else if (facets[t.name]) {
      state[t.name] = Array.prototype.map.call(form.querySelectorAll('[name="' + t.name + '"]:checked'), function (i) { return i.value; });
    }
    syncURL(); render();
  });
  priceEl.addEventListener("input", function () {
    state.max = parseInt(priceEl.value, 10);
    syncURL(); render();
  });
  sortEl.addEventListener("change", function () { state.sort = sortEl.value; syncURL(); render(); });

  document.addEventListener("click", function (e) {
    var rm = e.target.closest("[data-remove-filter]");
    if (rm) {
      var k = rm.getAttribute("data-remove-filter"), v = rm.getAttribute("data-value");
      if (k === "max") { state.max = 190000; priceEl.value = 190000; }
      else if (k === "instock") { state.instock = false; form.querySelector("[name=instock]").checked = false; }
      else if (k === "q") state.q = "";
      else {
        state[k] = state[k].filter(function (x) { return x !== v; });
        var box = form.querySelector('[name="' + k + '"][value="' + v + '"]');
        if (box) box.checked = false;
      }
      syncURL(); render();
      return;
    }
    if (e.target.closest("[data-reset]")) {
      state.metal = []; state.purity = []; state.stone = []; state.occasion = [];
      state.max = 190000; state.instock = false; state.q = "";
      form.reset(); priceEl.value = 190000;
      syncURL(); render();
    }
  });

  // Re-render wishlist view when a heart is toggled
  if (state.wishlist) {
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-wish]")) setTimeout(render, 0);
    });
  }

  /* Mobile filter drawer --------------------------------------------------- */
  var drawer = document.querySelector("[data-filters]");
  var scrim = document.querySelector("[data-filter-scrim]");
  var openBtn = document.querySelector("[data-open-filters]");
  function setDrawer(open) {
    drawer.classList.toggle("is-open", open);
    scrim.classList.toggle("is-visible", open);
    document.body.classList.toggle("is-locked", open);
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) drawer.querySelector("button, input").focus(); else openBtn.focus();
  }
  openBtn.addEventListener("click", function () { setDrawer(true); });
  scrim.addEventListener("click", function () { setDrawer(false); });
  document.querySelectorAll("[data-close-filters]").forEach(function (b) { b.addEventListener("click", function () { setDrawer(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false); });

  render();
})();
