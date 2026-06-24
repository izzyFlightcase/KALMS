/* ============================================================
   KALMS — one-pager behaviour. Vanilla, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Sticky header state ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Standard-Cases carousel tabs ---- */
  document.querySelectorAll("[data-carousel]").forEach(function (car) {
    var tabs = car.querySelectorAll(".tab");
    var panels = car.querySelectorAll(".carousel-track");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.dataset.tab;
        tabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        panels.forEach(function (p) {
          p.classList.toggle("is-active", p.dataset.panel === key);
        });
      });
    });
  });

  /* ---- Reveal-on-scroll (only when JS runs → no-JS stays visible) ---- */
  if ("IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      ".section h2, .kicker, .hook-card, .solution-card, .material-item, .split-text, .split-media, .contact-block, .hero-content > *"
    );
    targets.forEach(function (el) { el.setAttribute("data-reveal", ""); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- Auto-load photos from /assets ----
     Drop a file named after the data-img value (e.g. assets/truhe-1.jpg)
     and it appears automatically — no HTML editing needed.
     Tries .jpg, then .webp, then .png. ------------------------------- */
  var EXT = [".jpg", ".webp", ".png"];
  function tryLoad(name, onFound) {
    var i = 0;
    (function next() {
      if (i >= EXT.length) return;
      var img = new Image();
      var src = "assets/" + name + EXT[i++];
      img.onload = function () { onFound(src); };
      img.onerror = next;
      img.src = src;
    })();
  }

  function loadPhotos() {
    document.querySelectorAll("[data-img]").forEach(function (el) {
      tryLoad(el.dataset.img, function (src) {
        el.style.backgroundImage = "url('" + src + "')";
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
      });
    });

    /* Hero photo: assets/hero-case-fog.* */
    var heroMedia = document.querySelector(".hero-media");
    if (heroMedia) {
      tryLoad("hero-case-fog", function (src) {
        heroMedia.style.setProperty("--hero-photo", "url('" + src + "')");
        heroMedia.classList.add("has-photo");
      });
    }
  }

  /* Nach dem ersten Paint proben — der 404-Probe-Burst darf das Rendern nicht aufhalten. */
  if (document.readyState === "complete") loadPhotos();
  else window.addEventListener("load", loadPhotos);

  /* ---- Footer year ---- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
