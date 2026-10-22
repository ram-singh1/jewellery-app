/* Product detail page: gallery + zoom, variants, add to bag, delivery check. */
(function () {
  "use strict";

  var A = window.AURELLE;
  var id = new URLSearchParams(location.search).get("id");
  var p = A.find(id) || A.products[0];
  var star = A.icons.star;
  var selected = { metal: p.metal, size: null };
  var qty = 1;

  /* Text content ----------------------------------------------------------- */
  var catName = p.category.charAt(0).toUpperCase() + p.category.slice(1);
  document.title = p.name + " — " + p.purity + " " + A.metalNames[p.metal] + " | Aurelle";
  var metaDesc = document.querySelector('meta[name="description"]');
  metaDesc.setAttribute("content", p.name + " in " + p.purity + " " + A.metalNames[p.metal] + ". " + p.desc);
  document.querySelector("[data-crumb-cat]").textContent = catName;
  document.querySelector("[data-crumb-cat]").href = "collections.html?cat=" + p.category;
  document.querySelector("[data-crumb-name]").textContent = p.name;
  document.querySelector("[data-p-meta]").textContent = p.purity + " " + A.metalNames[p.metal];
  document.querySelector("[data-p-name]").textContent = p.name;
  document.querySelector("[data-p-price]").textContent = A.formatPrice(p.price);
  document.querySelector("[data-p-desc]").textContent = p.desc;
  document.querySelector("[data-p-stars]").innerHTML = star + star + star + star + star;
  document.querySelector("[data-rv-stars]").innerHTML = star + star + star + star + star;
  var stockEl = document.querySelector("[data-p-stock]");
  if (p.stock === "low") { stockEl.textContent = "Only a few left — ships in 2 business days"; stockEl.classList.add("stock--low"); }
  else stockEl.textContent = "In stock — ships in 2 business days";

  /* Specs ------------------------------------------------------------------ */
  var specs = [
    ["Metal", A.metalNames[p.metal]],
    ["Purity", p.purity + " (" + { "14K": "58.5%", "18K": "75%", "22K": "91.6%" }[p.purity] + " gold)"],
    ["Stone", A.stoneNames[p.stone]],
    ["Dimensions", p.dims],
    ["Approx. weight", p.weight],
    ["Finish", "High polish, hand-finished"],
    ["Certification", "To be confirmed per piece"],
    ["Style code", p.id.toUpperCase().replace(/-/g, "").slice(0, 10)]
  ];
  document.querySelector("[data-specs]").innerHTML = specs.map(function (s) { return "<tr><th scope=\"row\">" + s[0] + "</th><td>" + s[1] + "</td></tr>"; }).join("");

  /* Gallery ---------------------------------------------------------------- */
  var views = [
    { label: "View", opts: {} },
    { label: "Detail", opts: { zoom: 1.7, fx: p.fx, fy: p.fy } },
    { label: "Close-up", opts: { zoom: 2.6, fx: p.fx, fy: p.fy } },
    { label: "Square", opts: { ratio: 1 } }
  ];
  var main = document.querySelector("[data-main]");
  var thumbs = document.querySelector("[data-thumbs]");
  var label = document.querySelector("[data-view-label]");

  views.forEach(function (v, i) {
    var img = document.createElement("img");
    var o = Object.assign({ ratio: 1.25 }, v.opts);
    img.src = A.img(p.photo, 1200, o);
    img.srcset = [700, 1200, 1600].map(function (w) { return A.img(p.photo, w, o) + " " + w + "w"; }).join(", ");
    img.sizes = "(min-width: 1024px) 50vw, 100vw";
    img.alt = i === 0 ? p.alt : p.name + " — " + v.label.toLowerCase() + " view";
    img.width = 1200; img.height = 1500;
    img.style.opacity = i === 0 ? "1" : "0";
    if (i === 0) { img.fetchPriority = "high"; img.onload = function () { main.classList.remove("skeleton"); }; }
    else img.loading = "lazy";
    main.insertBefore(img, label);

    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Show " + v.label.toLowerCase() + " image");
    if (i === 0) b.setAttribute("aria-current", "true");
    b.innerHTML = '<img src="' + A.img(p.photo, 200, Object.assign({}, v.opts, { ratio: 1 })) + '" alt="" width="200" height="200" loading="lazy">';
    b.addEventListener("click", function () { showView(i); });
    thumbs.appendChild(b);
  });

  var mainImgs = main.querySelectorAll("img");
  var currentView = 0;
  function showView(i) {
    main.classList.remove("is-zoomed");
    mainImgs[currentView].style.opacity = "0";
    thumbs.children[currentView].removeAttribute("aria-current");
    currentView = i;
    mainImgs[i].style.opacity = "1";
    thumbs.children[i].setAttribute("aria-current", "true");
    label.textContent = views[i].label;
  }

  // Click-to-zoom that follows the pointer
  function toggleZoom() { main.classList.toggle("is-zoomed"); }
  main.addEventListener("click", toggleZoom);
  main.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleZoom(); }
    if (e.key === "ArrowRight") showView((currentView + 1) % views.length);
    if (e.key === "ArrowLeft") showView((currentView - 1 + views.length) % views.length);
  });
  main.addEventListener("mousemove", function (e) {
    var r = main.getBoundingClientRect();
    var x = ((e.clientX - r.left) / r.width) * 100;
    var y = ((e.clientY - r.top) / r.height) * 100;
    mainImgs[currentView].style.transformOrigin = x + "% " + y + "%";
  });
  main.addEventListener("mouseleave", function () { main.classList.remove("is-zoomed"); });

  // Swipe between views on touch screens
  var startX = null;
  main.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  main.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) showView((currentView + (dx < 0 ? 1 : -1) + views.length) % views.length);
    startX = null;
  });

  /* Variants --------------------------------------------------------------- */
  var metalsEl = document.querySelector("[data-metals]");
  metalsEl.innerHTML = '<button class="metal-opt" type="button" role="radio" aria-checked="true"><span class="swatch swatch--' + p.metal + '"></span>' + p.purity + " " + A.metalNames[p.metal] + "</button>";
  document.querySelector("[data-metal-label]").textContent = "Other metals available made to order";

  var sizeGroup = document.querySelector("[data-size-group]");
  var sizeErr = document.querySelector("[data-size-error]");
  if (p.sizes) {
    sizeGroup.hidden = false;
    var isRing = p.category === "rings";
    document.querySelector("[data-size-title]").textContent = isRing ? "Ring size (US)" : "Size";
    var sizesEl = document.querySelector("[data-sizes]");
    sizesEl.innerHTML = p.sizes.map(function (s, i) {
      var soldOut = p.stock === "low" && i === p.sizes.length - 1;
      return '<button class="size-opt" type="button" role="radio" aria-checked="false" data-size="' + s + '"' +
        (soldOut ? ' aria-disabled="true" aria-label="Size ' + s + ', sold out"' : ' aria-label="Size ' + s + '"') + ">" + s + "</button>";
    }).join("");
    sizesEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (!b) return;
      if (b.getAttribute("aria-disabled") === "true") { A.toast("Size " + b.getAttribute("data-size") + " is sold out — contact us to order it."); return; }
      sizesEl.querySelectorAll("[data-size]").forEach(function (x) { x.setAttribute("aria-checked", "false"); });
      b.setAttribute("aria-checked", "true");
      selected.size = b.getAttribute("data-size");
      sizeErr.hidden = true;
      sizeGroup.classList.remove("has-error");
    });
    if (!isRing) document.querySelector("[data-modal-open='size-guide']").textContent = "Fit guide";
  }

  /* Quantity & add to bag -------------------------------------------------- */
  var qtyInput = document.querySelector("[data-pqty]");
  document.querySelectorAll("[data-pq]").forEach(function (b) {
    b.addEventListener("click", function () {
      qty = Math.max(1, Math.min(5, qty + parseInt(b.getAttribute("data-pq"), 10)));
      qtyInput.value = qty;
    });
  });

  var addBtn = document.querySelector("[data-add]");
  function add() {
    if (p.sizes && !selected.size) {
      sizeErr.hidden = false;
      sizeGroup.classList.remove("has-error"); void sizeGroup.offsetWidth; sizeGroup.classList.add("has-error");
      sizeGroup.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var original = addBtn.innerHTML;
    addBtn.disabled = true;
    addBtn.innerHTML = "Adding…";
    setTimeout(function () {
      A.addToCart(p.id, selected, qty, true);
      addBtn.disabled = false;
      addBtn.innerHTML = "Added ✓";
      setTimeout(function () { addBtn.innerHTML = original; }, 1600);
    }, 450);
  }
  addBtn.addEventListener("click", add);
  document.querySelector("[data-sticky-add]").addEventListener("click", add);

  var wishBtn = document.querySelector(".buy-row [data-wish]");
  wishBtn.setAttribute("data-wish", p.id);
  A.updateWishUI();

  /* Delivery estimate ------------------------------------------------------ */
  document.querySelector("[data-pincode]").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = document.getElementById("pin");
    var msg = document.querySelector("[data-pin-msg]");
    if (!/^[1-9]\d{5}$/.test(input.value.trim())) {
      input.setAttribute("aria-invalid", "true");
      msg.style.color = "var(--error)";
      msg.textContent = "Please enter a valid 6-digit PIN code.";
      return;
    }
    input.removeAttribute("aria-invalid");
    var d = new Date();
    var added = 0;
    while (added < 5) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) added++; }
    msg.style.color = "var(--success)";
    msg.textContent = "Estimated delivery by " + d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) + " (prototype estimate).";
  });

  /* Sticky mobile bar ------------------------------------------------------ */
  var sticky = document.querySelector("[data-sticky]");
  document.querySelector("[data-sticky-img]").src = A.img(p.photo, 120);
  document.querySelector("[data-sticky-name]").textContent = p.name;
  document.querySelector("[data-sticky-price]").textContent = A.formatPrice(p.price);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var show = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
      sticky.querySelector("button").tabIndex = show ? 0 : -1;
    }).observe(document.querySelector("[data-buy-row]"));
  }

  /* Related & recently viewed ---------------------------------------------- */
  var related = A.products.filter(function (x) { return x.category === p.category && x.id !== p.id; })
    .concat(A.products.filter(function (x) { return x.category !== p.category; }))
    .slice(0, 4);
  A.renderGrid(document.querySelector("[data-related]"), related);
  document.querySelector("[data-rel-link]").href = "collections.html?cat=" + p.category;

  var recent = [];
  try { recent = JSON.parse(localStorage.getItem("aurelle-recent") || "[]"); } catch (e) { /* ignore */ }
  var others = recent.filter(function (r) { return r !== p.id; }).map(A.find).filter(Boolean).slice(0, 6);
  if (others.length) {
    document.querySelector("[data-recent-wrap]").hidden = false;
    A.renderGrid(document.querySelector("[data-recent]"), others);
  }
  recent = [p.id].concat(recent.filter(function (r) { return r !== p.id; })).slice(0, 10);
  try { localStorage.setItem("aurelle-recent", JSON.stringify(recent)); } catch (e) { /* ignore */ }

  // Re-observe late-rendered bars
  A.observeReveals(document.getElementById("reviews"));
})();
