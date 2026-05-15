(function () {
  "use strict";

  var PAGE_LOADER_ID = "casefilePageLoader";
  var BOOT_CLASS = "casefile-boot";
  var READY_CLASS = "casefile-ready";
  var NAV_CLASS = "casefile-navigating";
  var MIN_SPLASH_MS = 420;
  var splashShownAt = Date.now();

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function ensurePageLoader() {
    var existing = document.getElementById(PAGE_LOADER_ID);
    if (existing) return existing;
    var el = document.createElement("div");
    el.id = PAGE_LOADER_ID;
    el.className = "casefile-page-loader";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-busy", "true");
    el.innerHTML =
      '<div class="casefile-spinner" aria-hidden="true"></div>' +
      '<div class="casefile-page-loader__label">Retrieving case file</div>' +
      '<div class="casefile-page-loader__sub">SECTION CLEARANCE PENDING</div>';
    document.body.appendChild(el);
    return el;
  }

  function showPageLoader() {
    document.documentElement.classList.add(BOOT_CLASS);
    var loader = ensurePageLoader();
    loader.classList.remove("is-hidden");
    loader.setAttribute("aria-busy", "true");
    splashShownAt = Date.now();
  }

  function hidePageLoader() {
    var loader = document.getElementById(PAGE_LOADER_ID);
    var elapsed = Date.now() - splashShownAt;
    var wait = Math.max(0, MIN_SPLASH_MS - elapsed);

    window.setTimeout(function () {
      document.documentElement.classList.remove(BOOT_CLASS, NAV_CLASS);
      document.documentElement.classList.add(READY_CLASS);
      if (loader) {
        loader.classList.add("is-hidden");
        loader.setAttribute("aria-busy", "false");
      }
    }, wait);
  }

  function initPageLoader() {
    showPageLoader();

    if (document.readyState === "complete") {
      hidePageLoader();
    } else {
      window.addEventListener("load", hidePageLoader, { once: true });
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0)
        return;
      var url;
      try {
        url = new URL(a.href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      document.documentElement.classList.add(NAV_CLASS);
      showPageLoader();
    });

    window.addEventListener("pageshow", function (ev) {
      if (ev.persisted) hidePageLoader();
    });
  }

  function spinnerMarkup() {
    var s = document.createElement("span");
    s.className = "casefile-loadable__overlay";
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = '<span class="casefile-spinner"></span>';
    return s;
  }

  function markLoaded(wrap) {
    wrap.classList.remove("is-loading");
    wrap.classList.add("is-loaded");
  }

  function markError(wrap) {
    wrap.classList.remove("is-loading");
    wrap.classList.add("is-error");
  }

  function wrapMedia(el, opts) {
    opts = opts || {};
    if (!el || el.closest(".casefile-loadable")) return;
    if (el.dataset && el.dataset.cfNoLoader === "true") return;

    var wrap = document.createElement("div");
    wrap.className = "casefile-loadable is-loading";
    if (opts.inline) wrap.classList.add("casefile-loadable--inline");
    if (opts.bg) wrap.classList.add("casefile-loadable--bg");

    var parent = el.parentNode;
    if (!parent) return;
    parent.insertBefore(wrap, el);
    wrap.appendChild(el);
    wrap.appendChild(spinnerMarkup());

    return wrap;
  }

  function bindImage(img) {
    if (img.complete && img.naturalWidth > 0) {
      var w0 = img.closest(".casefile-loadable");
      if (w0) markLoaded(w0);
      return;
    }
    var onDone = function () {
      var w = img.closest(".casefile-loadable");
      if (!w) return;
      if (img.naturalWidth > 0) markLoaded(w);
      else markError(w);
    };
    img.addEventListener("load", onDone, { once: true });
    img.addEventListener("error", onDone, { once: true });
  }

  function bindVideo(video) {
    var done = function (ok) {
      var w = video.closest(".casefile-loadable");
      if (!w) return;
      if (ok) markLoaded(w);
      else markError(w);
    };
    if (video.readyState >= 2) {
      done(true);
      return;
    }
    video.addEventListener(
      "loadeddata",
      function () {
        done(true);
      },
      { once: true }
    );
    video.addEventListener(
      "error",
      function () {
        done(false);
      },
      { once: true }
    );
  }

  function bgUrlFrom(el) {
    var inline = el.style && el.style.backgroundImage;
    if (inline && inline !== "none") {
      var m = inline.match(/url\(["']?([^"')]+)["']?\)/);
      if (m) return m[1];
    }
    var computed = window.getComputedStyle(el).backgroundImage;
    if (!computed || computed === "none") return "";
    var m2 = computed.match(/url\(["']?([^"')]+)["']?\)/);
    return m2 ? m2[1] : "";
  }

  function bindBackground(el) {
    var url = bgUrlFrom(el);
    if (!url || url === "none") {
      var w0 = el.closest(".casefile-loadable");
      if (w0) markLoaded(w0);
      return;
    }
    var img = new Image();
    img.onload = function () {
      var w = el.closest(".casefile-loadable");
      if (w) markLoaded(w);
    };
    img.onerror = function () {
      var w = el.closest(".casefile-loadable");
      if (w) markError(w);
    };
    img.src = url;
  }

  function initMediaLoaders(root) {
    root = root || document;

    qsa("img", root).forEach(function (img) {
      if (img.closest("#" + PAGE_LOADER_ID)) return;
      var inGrid = img.closest(".cf-exhibit-grid");
      var inEmblem = img.closest(".emblem-slot");
      wrapMedia(img, { inline: !inGrid && !inEmblem });
      if (inEmblem) {
        var ew = img.closest(".casefile-loadable");
        if (ew) ew.classList.add("casefile-loadable--bg");
      }
      bindImage(img);
    });

    qsa("video", root).forEach(function (video) {
      wrapMedia(video);
      bindVideo(video);
    });

    qsa(".polaroid-photo-bg, .edu-photo-lightbox__full-bg", root).forEach(function (el) {
      if (!bgUrlFrom(el)) return;
      wrapMedia(el, { bg: true });
      bindBackground(el);
    });
  }

  function observeNewMedia() {
    if (!window.MutationObserver) return;
    var root = qs("#root");
    if (!root) return;
    var timer;
    var obs = new MutationObserver(function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        initMediaLoaders(root);
      }, 50);
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  function closeEduLb() {
    var elb = qs("#eduPhotoLightbox");
    if (!elb || elb.hidden) return;
    elb.hidden = true;
    document.body.style.overflow = "";
  }

  function openEduFromCard(card) {
    var elb = qs("#eduPhotoLightbox");
    var eduImg = qs("#eduPhotoLightboxImg");
    var eduCap = qs("#eduPhotoLightboxCap");
    if (!elb || !eduImg || !card) return;
    var u = card.getAttribute("data-edu-bg");
    if (!u) return;
    eduImg.style.backgroundImage = "url('" + u + "')";
    var w = eduImg.closest(".casefile-loadable");
    if (w) {
      w.classList.remove("is-loaded", "is-error");
      w.classList.add("is-loading");
      bindBackground(eduImg);
    } else {
      initMediaLoaders(eduImg.parentNode || eduImg);
    }
    var c = card.querySelector(".caption");
    if (eduCap) eduCap.textContent = c ? c.textContent : "";
    elb.hidden = false;
    document.body.style.overflow = "hidden";
    var xb = qs(".edu-photo-lightbox__close", elb);
    if (xb) xb.focus();
  }

  initPageLoader();

  document.addEventListener("DOMContentLoaded", function () {
    initMediaLoaders();
    observeNewMedia();
  });

  document.querySelectorAll(".subtab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-subtab");
      if (!id) return;
      qsa(".subtab").forEach(function (b) {
        b.classList.toggle("subtab-active", b === btn);
      });
      qsa(".subpanels [data-subpanel]").forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-subpanel") === id);
      });
    });
  });

  document.addEventListener("click", function (e) {
    var pz = e.target.closest(".polaroid.pz-interactive");
    if (!pz) {
      qsa(".polaroid.pz-interactive.is-active").forEach(function (x) {
        x.classList.remove("is-active");
      });
      return;
    }
    var was = pz.classList.contains("is-active");
    qsa(".polaroid.pz-interactive.is-active").forEach(function (x) {
      x.classList.remove("is-active");
    });
    if (!was) pz.classList.add("is-active");
  });

  document.addEventListener("click", function (e) {
    if (!qs("#eduPhotoLightbox")) return;
    if (e.target.closest("[data-edu-lb-close]")) {
      var elbx = qs("#eduPhotoLightbox");
      if (elbx && !elbx.hidden) {
        e.preventDefault();
        closeEduLb();
      }
      return;
    }
    var eduCard = e.target.closest(".edu-polaroid-row .edu-pz");
    if (eduCard) {
      e.preventDefault();
      openEduFromCard(eduCard);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var elb = qs("#eduPhotoLightbox");
      if (elb && !elb.hidden) {
        closeEduLb();
        return;
      }
      qsa(".polaroid.pz-interactive.is-active").forEach(function (x) {
        x.classList.remove("is-active");
      });
      return;
    }
    if (
      (e.key === "Enter" || e.key === " ") &&
      e.target &&
      e.target.classList &&
      e.target.classList.contains("edu-pz") &&
      e.target.getAttribute("data-edu-bg")
    ) {
      e.preventDefault();
      openEduFromCard(e.target);
    }
  });

  var cform = qs("#casefileContactForm");
  if (cform) {
    var sbox = qs("#contactSuccess");
    var sname = qs("#successName");
    cform.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      var vals = {};
      qsa(".cf-field", cform).forEach(function (f) {
        if (f.classList.contains("cf-optional")) return;
        var inp = f.querySelector("input, textarea");
        if (!inp) return;
        var v = (inp.value || "").trim();
        vals[inp.name] = v;
        if (!v) {
          f.classList.add("has-err");
          ok = false;
        } else f.classList.remove("has-err");
      });
      if (!ok) return;
      if (sname) sname.textContent = vals.name || "friend";
      cform.style.display = "none";
      if (sbox) sbox.hidden = false;
    });
    qsa("input, textarea", cform).forEach(function (inp) {
      inp.addEventListener("input", function () {
        var f = inp.closest(".cf-field");
        if (f && inp.value.trim()) f.classList.remove("has-err");
      });
    });
  }
})();
