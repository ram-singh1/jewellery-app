/* Homepage: category preview, product tabs, statement reveal, reviews, lookbook drag. */
(function () {
  "use strict";

  var A = window.AURELLE;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (min-width: 768px)").matches;

  /* Hero slideshow --------------------------------------------------------- */
  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = hero.querySelectorAll("[data-slide]");
    var bars = hero.querySelectorAll(".hero__progress button");
    var current = 0;
    var timer = null;
    var SLIDE_MS = 7000;
    hero.style.setProperty("--slide-time", SLIDE_MS / 1000 + "s");

    function go(n) {
      slides[current].classList.remove("is-active");
      slides[current].setAttribute("aria-hidden", "true");
      slides[current].inert = true;
      current = (n + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      slides[current].removeAttribute("aria-hidden");
      slides[current].inert = false;
      bars.forEach(function (b, i) {
        b.classList.toggle("is-done", i < current);
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      void bars[current].offsetWidth; // restart the progress animation
      bars[current].classList.add("is-active");
      bars[current].setAttribute("aria-selected", "true");
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (reduceMotion || hero.classList.contains("is-paused")) return;
      timer = setTimeout(function () { go(current + 1); }, SLIDE_MS);
    }
    bars.forEach(function (b, i) { b.addEventListener("click", function () { go(i); }); });
    hero.addEventListener("mouseenter", function () { hero.classList.add("is-paused"); clearTimeout(timer); });
    hero.addEventListener("mouseleave", function () { hero.classList.remove("is-paused"); go(current); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) clearTimeout(timer); else schedule(); });

    var touchX = null;
    hero.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });
    schedule();
  }

  /* Category index: image preview follows the cursor ----------------------- */
  var list = document.querySelector("[data-index]");
  var preview = document.querySelector("[data-index-preview]");
  if (list && preview && canHover && !reduceMotion) {
    var imgs = preview.querySelectorAll("img");
    var x = 0, y = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (x - cx) * 0.14;
      cy += (y - cy) * 0.14;
      preview.style.transform = "translate3d(" + (cx - 150) + "px," + (cy - 187) + "px,0) rotate(" + ((x - cx) * 0.03).toFixed(2) + "deg)";
      raf = requestAnimationFrame(loop);
    }
    list.addEventListener("mouseenter", function (e) {
      cx = x = e.clientX; cy = y = e.clientY;
      preview.classList.add("is-visible");
      if (!raf) loop();
    });
    list.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; });
    list.addEventListener("mouseleave", function () {
      preview.classList.remove("is-visible");
      cancelAnimationFrame(raf); raf = null;
    });
    list.querySelectorAll("[data-preview]").forEach(function (a) {
      a.addEventListener("mouseenter", function () {
        var i = +a.getAttribute("data-preview");
        imgs.forEach(function (im, j) { im.classList.toggle("is-active", i === j); });
      });
    });
    // Dim the other rows while one is hovered
    list.addEventListener("mouseover", function (e) {
      var row = e.target.closest("a");
      list.querySelectorAll("a").forEach(function (a) { a.style.opacity = row && a !== row ? "0.3" : ""; });
    });
    list.addEventListener("mouseleave", function () { list.querySelectorAll("a").forEach(function (a) { a.style.opacity = ""; }); });
  }

  /* Product tabs ----------------------------------------------------------- */
  var grid = document.getElementById("picks-grid");
  var tabs = document.querySelectorAll("[data-tab]");
  var sets = {
    best: function () { return A.products.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 8); },
    "new": function () { return A.products.filter(function (p) { return p.isNew; }).slice(0, 8); },
    under: function () { return A.products.filter(function (p) { return p.price < 35000; }).sort(function (a, b) { return b.pop - a.pop; }).slice(0, 8); }
  };
  function show(key) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", t.getAttribute("data-tab") === key ? "true" : "false"); });
    A.renderGrid(grid, sets[key]());
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { show(t.getAttribute("data-tab")); }); });
  if (grid) show("best");

  /* Statement: words brighten as you scroll -------------------------------- */
  var statement = document.querySelector("[data-words]");
  if (statement && !reduceMotion) {
    // Wrap each text word in a span, leaving inline images untouched
    Array.prototype.slice.call(statement.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var s = document.createElement("span");
        s.className = "w"; s.textContent = part;
        frag.appendChild(s);
      });
      statement.replaceChild(frag, node);
    });
    var words = statement.querySelectorAll(".w, .inline-img");
    var ticking = false;
    function paint() {
      var r = statement.getBoundingClientRect();
      var vh = window.innerHeight;
      // progress 0 when the block top reaches 90% of the viewport, 1 when its bottom reaches 75%
      var progress = (vh * 0.9 - r.top) / (r.height + vh * 0.15);
      progress = Math.max(0, Math.min(1, progress));
      var lit = progress * words.length;
      words.forEach(function (w, i) {
        var o = Math.max(0.16, Math.min(1, lit - i + 1));
        w.style.setProperty("--o", o.toFixed(2));
        if (w.classList.contains("inline-img")) w.style.opacity = o.toFixed(2);
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(paint); ticking = true; } }, { passive: true });
    paint();
  }

  /* Reviews ---------------------------------------------------------------- */
  var quotes = document.querySelectorAll("[data-quotes] .quote__slide");
  var counter = document.querySelector("[data-quote-count]");
  var q = 0;
  function goQuote(n) {
    quotes[q].classList.remove("is-active");
    q = (n + quotes.length) % quotes.length;
    quotes[q].classList.add("is-active");
    counter.textContent = "0" + (q + 1) + " / 0" + quotes.length;
  }
  document.querySelectorAll("[data-quote]").forEach(function (b) {
    b.addEventListener("click", function () { goQuote(q + parseInt(b.getAttribute("data-quote"), 10)); });
  });

  /* Lookbook: drag to scroll on desktop ------------------------------------ */
  var strip = document.querySelector("[data-strip]");
  if (strip) {
    var down = false, startX = 0, startLeft = 0, moved = 0;
    strip.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      down = true; moved = 0; startX = e.clientX; startLeft = strip.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 5) strip.classList.add("is-dragging");
      strip.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      down = false;
      setTimeout(function () { strip.classList.remove("is-dragging"); }, 0);
    });
  }
})();
