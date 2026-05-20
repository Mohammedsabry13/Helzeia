/*
   script.js — Helzeia Project
   ────────────────────────────────────────────────────────────────────────────
   License: MIT (see LICENSE)
   Credit (required): github.com/Mohammedsabry13
*/

/* ════════════════════════════════════════════════════════════════════════════
   script.js — SaasLyn Project
   ────────────────────────────────────────────────────────────────────────────
   TABLE OF CONTENTS
   01. HERO SLIDER
   02. MOBILE MENU
   03. FEATURE CARDS
   04. FAQ / ACCORDION
   05. STAR FIELD
   ════════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────────────
   01. HERO SLIDER
   ───────────────────────────────────────────────────────────────────────────── */

(function () {
  /* ── بيانات الشرائح: الصور تُقرأ من هنا فقط ── */
  var slideData = [
    { bg: "assets/image/01 HOME.png" },
    { bg: "assets/image/02 HOME.png" },
    { bg: "assets/image/03 HOME.jpg" },
    { bg: "assets/image/04 HOME.jpg" },
  ];

  /* ── تطبيق الصور على image-layer لكل slide ── */
  var slides = document.querySelectorAll(".hero-slide");

  /* لا يوجد slider في هذه الصفحة — تخطّ كل كود الـ slider */
  if (!slides.length) return;

  slides.forEach(function (slide, i) {
    var imageLayer = slide.querySelector(".image-layer");
    if (!imageLayer || !slideData[i]) return;

    imageLayer.style.backgroundImage = "url('" + slideData[i].bg + "')";
    imageLayer.style.backgroundSize = "cover";
    imageLayer.style.backgroundPosition = "center";
    imageLayer.style.backgroundRepeat = "no-repeat";
    imageLayer.style.backgroundColor = "#060f1e";
  });

  /* ── إعادة تشغيل animation الـ Ken Burns عند كل تبديل ── */
  function restartKenBurns(slide) {
    var layer = slide.querySelector(".image-layer");
    if (!layer) return;
    layer.style.animation = "none";
    void layer.offsetWidth; /* force reflow */
    layer.style.animation = "";
  }

  /* ── منطق الـ Slider ── */
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var current = 0;
  var total = slides.length;
  var busy = false;
  var timer;

  function goTo(idx) {
    if (busy || idx === current) return;
    busy = true;
    slides[current].classList.remove("active");
    current = (idx + total) % total;
    slides[current].classList.add("active");
    restartKenBurns(slides[current]);
    setTimeout(function () {
      busy = false;
    }, 800);
  }

  function autoNext() {
    goTo(current + 1);
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(autoNext, 8000);
  }

  /* تشغيل الـ Ken Burns على الشريحة الأولى فور التحميل */
  restartKenBurns(slides[0]);

  if (prevBtn)
    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
      resetTimer();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
      resetTimer();
    });

  timer = setInterval(autoNext, 8000);
})();

/* ─────────────────────────────────────────────────────────────────────────────
   02. MOBILE MENU
   ───────────────────────────────────────────────────────────────────────────── */

(function () {
  function initMobileMenu() {
    var drawer = document.getElementById("mobileMenuDrawer");
    var toggleBtn = document.getElementById("menuToggle");
    if (!drawer || !toggleBtn) return;

    var backdrop = drawer.querySelector(".drawer-backdrop");
    var closeBtn = drawer.querySelector(".drawer-close");

    function openDrawer() {
      drawer.style.display = "flex";
      setTimeout(function () {
        drawer.classList.add("open");
      }, 10);
      document.body.style.overflow = "hidden";
      toggleBtn.setAttribute("aria-expanded", "true");
    }

    function closeDrawer() {
      drawer.classList.remove("open");
      document.body.style.overflow = "";
      toggleBtn.setAttribute("aria-expanded", "false");
      setTimeout(function () {
        drawer.style.display = "none";
      }, 350);
    }

    toggleBtn.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    /* ── Services accordion inside drawer ── */
    var servicesToggle = drawer.querySelector(".drawer-services-toggle");
    var servicesSub = drawer.querySelector(".drawer-services-sub");

    if (servicesToggle && servicesSub) {
      servicesToggle.addEventListener("click", function () {
        var isOpen = servicesSub.classList.toggle("open");
        servicesToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }
})();

/* ─────────────────────────────────────────────────────────────────────────────
   03. SMART DROPDOWN — Desktop navbar
   ─────────────────────────────────────────────────────────────────────────────
   يبقى الـ dropdown مفتوحاً أثناء التنقل بين الـ trigger والـ list
   بفضل delay 200ms + bridge gap في CSS
   ───────────────────────────────────────────────────────────────────────────── */

(function () {
  var closeTimer = null;
  var currentOpen = null;

  function openDropdown(item) {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (currentOpen && currentOpen !== item) closeNow(currentOpen);
    item.classList.add("dd-open");
    var trigger = item.querySelector(".dropdown-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    currentOpen = item;
  }

  function scheduleClose(item) {
    closeTimer = setTimeout(function () {
      closeNow(item);
    }, 200);
  }

  function closeNow(item) {
    item.classList.remove("dd-open");
    var trigger = item.querySelector(".dropdown-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (currentOpen === item) currentOpen = null;
  }

  function initDropdowns() {
    document
      .querySelectorAll(".main-nav .has-dropdown")
      .forEach(function (item) {
        var trigger = item.querySelector(".dropdown-trigger");
        var menu = item.querySelector(".nav-dropdown");
        if (!trigger || !menu) return;

        /* Trigger: hover يفتح، mouseleave يبدأ timer */
        item.addEventListener("mouseenter", function () {
          openDropdown(item);
        });
        item.addEventListener("mouseleave", function () {
          scheduleClose(item);
        });

        /* Menu: mouseenter يلغي الـ timer، mouseleave يبدأ timer */
        menu.addEventListener("mouseenter", function () {
          if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
          }
        });
        menu.addEventListener("mouseleave", function () {
          scheduleClose(item);
        });

        /* Click على الـ trigger: ينتقل مباشرة للصفحة */
        trigger.addEventListener("click", function (e) {
          var href = trigger.getAttribute("href");
          if (href && href !== "#") {
            e.preventDefault();
            window.location.href = href;
          }
        });
      });

    /* إغلاق عند الضغط خارج الـ dropdown */
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".has-dropdown")) {
        document.querySelectorAll(".has-dropdown.dd-open").forEach(closeNow);
      }
    });

    /* إغلاق عند الضغط على Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.querySelectorAll(".has-dropdown.dd-open").forEach(closeNow);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDropdowns);
  } else {
    initDropdowns();
  }
})();

/* ─────────────────────────────────────────────────────────────────────────────
   04. FEATURE CARDS
   ───────────────────────────────────────────────────────────────────────────── */

(function () {
  var featureCards = document.querySelectorAll(".feature-card");
  if (!featureCards.length) return;

  var initialActive = document.querySelector(".feature-card.active");

  featureCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      featureCards.forEach(function (c) {
        c.classList.remove("active");
      });
      card.classList.add("active");
    });

    card.addEventListener("mouseleave", function () {
      card.classList.remove("active");
      if (initialActive) initialActive.classList.add("active");
    });
  });
})();

/* ─────────────────────────────────────────────────────────────────────────────
   05. FAQ / ACCORDION
   ───────────────────────────────────────────────────────────────────────────── */

function faqToggle(header) {
  var clickedItem = header.closest(".acc-item");
  var clickedBody = clickedItem.querySelector(".acc-body");
  var clickedIcon = clickedItem.querySelector(".acc-icon");
  var isAlreadyOpen = clickedItem.classList.contains("open");

  document.querySelectorAll(".acc-item").forEach(function (item) {
    item.classList.remove("open");
    item.querySelector(".acc-body").style.maxHeight = "0";
    var icon = item.querySelector(".acc-icon");
    icon.textContent = "+";
    icon.classList.remove("flip");
    item.querySelector(".acc-header").setAttribute("aria-expanded", "false");
  });

  if (!isAlreadyOpen) {
    clickedItem.classList.add("open");
    clickedBody.style.maxHeight =
      clickedBody.querySelector(".acc-body-content").scrollHeight + "px";
    clickedIcon.classList.remove("flip");
    void clickedIcon.offsetWidth;
    clickedIcon.classList.add("flip");
    clickedIcon.textContent = "−";
    header.setAttribute("aria-expanded", "true");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var firstOpen = document.querySelector(".acc-item.open");
  if (firstOpen) {
    var body = firstOpen.querySelector(".acc-body");
    body.style.maxHeight =
      body.querySelector(".acc-body-content").scrollHeight + "px";
    firstOpen.querySelector(".acc-icon").textContent = "−";
  }
});

window.addEventListener("resize", function () {
  document.querySelectorAll(".acc-item.open").forEach(function (item) {
    var body = item.querySelector(".acc-body");
    if (body) {
      body.style.maxHeight =
        body.querySelector(".acc-body-content").scrollHeight + "px";
    }
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   06. ROOMS GRID — Touch / mobile: click to flip
   ───────────────────────────────────────────────────────────────────────────── */

(function () {
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    document
      .querySelectorAll(".rooms-grid .room-card-wrapper")
      .forEach(function (card) {
        card.addEventListener("click", function (e) {
          if (e.target.closest("button")) return;
          var inner = card.querySelector(".room-card-inner");
          var isFlipped = inner.style.transform === "rotateY(180deg)";
          inner.style.transform = isFlipped
            ? "rotateY(0deg)"
            : "rotateY(180deg)";
        });
      });
  }
})();

/* ─────────────────────────────────────────────────────────────────────────────
   07. STAR FIELD
   ───────────────────────────────────────────────────────────────────────────── */

(function () {
  var container = document.getElementById("stars");
  if (!container) return;

  for (var i = 0; i < 60; i++) {
    var star = document.createElement("div");
    var size = Math.random() * 2.5 + 1;
    star.classList.add("star");
    star.style.cssText =
      "width:" +
      size +
      "px;" +
      "height:" +
      size +
      "px;" +
      "top:" +
      Math.random() * 100 +
      "%;" +
      "left:" +
      Math.random() * 100 +
      "%;" +
      "--d:" +
      (Math.random() * 3 + 2).toFixed(1) +
      "s;" +
      "--dl:-" +
      (Math.random() * 4).toFixed(1) +
      "s;";
    container.appendChild(star);
  }
})();
