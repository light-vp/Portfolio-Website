/**
 * Site behaviour: theme toggle, mobile nav, sticky-header state,
 * scroll reveal, and project filtering.
 *
 * The initial theme is applied by an inline script in <head> so the page
 * never paints the wrong colours first. This file only handles the toggle.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  /* ---------- Theme ---------- */

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* Storage can be unavailable in private mode; the toggle still works. */
    }
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  var themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    setTheme(root.getAttribute("data-theme") || "light");
    themeToggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* Follow the OS only while the visitor has not chosen a theme themselves. */
  var systemScheme = window.matchMedia("(prefers-color-scheme: dark)");
  var onSchemeChange = function (event) {
    var stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (e) {}
    if (!stored) {
      root.setAttribute("data-theme", event.matches ? "dark" : "light");
    }
  };
  if (systemScheme.addEventListener) {
    systemScheme.addEventListener("change", onSchemeChange);
  }

  /* ---------- Mobile nav ---------- */

  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  function closeMenu() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.setAttribute("data-open", "false");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.removeProperty("overflow");
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var open = mobileNav.getAttribute("data-open") === "true";
      mobileNav.setAttribute("data-open", open ? "false" : "true");
      menuToggle.setAttribute("aria-expanded", open ? "false" : "true");
      document.body.style.overflow = open ? "" : "hidden";
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    /* Leaving the mobile breakpoint with the drawer open would otherwise
       leave <body> scroll-locked on desktop. */
    var wide = window.matchMedia("(min-width: 721px)");
    if (wide.addEventListener) {
      wide.addEventListener("change", function (event) {
        if (event.matches) closeMenu();
      });
    }
  }

  /* ---------- Header shadow on scroll ---------- */

  var header = document.querySelector(".header");
  if (header) {
    var ticking = false;
    var updateHeader = function () {
      header.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
      ticking = false;
    };
    updateHeader();
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateHeader);
        }
      },
      { passive: true }
    );
  }

  /* ---------- Reveal on scroll ---------- */

  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length) {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
      );
      revealTargets.forEach(function (el, index) {
        /* Small stagger so groups cascade instead of snapping in together. */
        el.style.transitionDelay = Math.min(index % 6, 5) * 45 + "ms";
        observer.observe(el);
      });
    }
  }

  /* ---------- Project filter + search ---------- */

  var workList = document.getElementById("work-list");
  if (workList) {
    var items = Array.prototype.slice.call(
      workList.querySelectorAll(".work-item")
    );
    var filterButtons = Array.prototype.slice.call(
      document.querySelectorAll(".filter")
    );
    var searchInput = document.getElementById("work-search");
    var emptyState = document.getElementById("work-empty");
    var activeFilter = "all";

    function applyFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var visible = 0;

      items.forEach(function (item) {
        var categories = (item.getAttribute("data-category") || "").split(/\s+/);
        var matchesFilter =
          activeFilter === "all" || categories.indexOf(activeFilter) !== -1;
        var matchesQuery =
          !query || item.textContent.toLowerCase().indexOf(query) !== -1;
        var show = matchesFilter && matchesQuery;

        item.hidden = !show;
        if (show) visible++;
      });

      /* Renumber so the visible rows always read 01, 02, 03… */
      var counter = 0;
      items.forEach(function (item) {
        if (item.hidden) return;
        counter++;
        var index = item.querySelector(".work-index");
        if (index) index.textContent = String(counter).padStart(2, "0");
      });

      if (emptyState) emptyState.hidden = visible !== 0;
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter") || "all";
        filterButtons.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === button));
        });
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    applyFilters();
  }
})();
