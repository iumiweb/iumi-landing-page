const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  const openLabel = menuToggle.querySelector(".sr-only");
  const navHome = nav.parentElement;
  const mobileMenuQuery = window.matchMedia("(max-width: 900px)");
  let touchStartY = 0;
  let isMenuFading = false;

  const placeNav = () => {
    if (mobileMenuQuery.matches) {
      if (nav.parentElement !== document.body) {
        document.body.appendChild(nav);
      }
    } else if (navHome && nav.parentElement !== navHome) {
      navHome.appendChild(nav);
    }
  };

  const setMenuOpen = (isOpen) => {
    placeNav();
    isMenuFading = false;
    nav.classList.remove("is-fading");
    nav.classList.toggle("is-open", isOpen);
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("is-menu-open", isOpen);
    if (openLabel) {
      openLabel.textContent = isOpen ? "メニューを閉じる" : "メニューを開く";
    }
  };

  const fadeCloseMenu = () => {
    if (!nav.classList.contains("is-open") || isMenuFading) {
      return;
    }

    isMenuFading = true;
    nav.classList.add("is-fading");

    const finishClose = () => {
      setMenuOpen(false);
      nav.removeEventListener("transitionend", finishClose);
    };

    nav.addEventListener("transitionend", finishClose);
    window.setTimeout(finishClose, 400);
  };

  placeNav();
  mobileMenuQuery.addEventListener("change", () => {
    setMenuOpen(false);
    placeNav();
  });

  menuToggle.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) {
      fadeCloseMenu();
    } else {
      setMenuOpen(true);
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      fadeCloseMenu();
    }
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (!nav.classList.contains("is-open") || !mobileMenuQuery.matches) {
        return;
      }

      if (event.deltaY > 0) {
        fadeCloseMenu();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchstart",
    (event) => {
      if (!nav.classList.contains("is-open") || !mobileMenuQuery.matches) {
        return;
      }

      touchStartY = event.touches[0]?.clientY ?? 0;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!nav.classList.contains("is-open") || !mobileMenuQuery.matches) {
        return;
      }

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      if (touchStartY - currentY > 24) {
        fadeCloseMenu();
      }
    },
    { passive: true }
  );
}

document.querySelectorAll(".cta-pill").forEach((button) => {
  button.addEventListener("touchend", () => {
    button.blur();
  });
});

const pressableCtas = document.querySelectorAll(".hero-works-cta, .services-contact-cta");
const mobileHeroQuery = window.matchMedia("(max-width: 900px)");

pressableCtas.forEach((cta) => {
  const pressCta = () => {
    if (mobileHeroQuery.matches) {
      cta.classList.add("is-pressed");
    }
  };

  const releaseCta = () => {
    cta.classList.remove("is-pressed");
  };

  cta.addEventListener("pointerdown", pressCta);
  cta.addEventListener("pointerup", releaseCta);
  cta.addEventListener("pointercancel", releaseCta);
  cta.addEventListener("pointerleave", releaseCta);
  cta.addEventListener("blur", releaseCta);
});

const mobileLayoutQuery = window.matchMedia("(max-width: 900px)");

const measureSafeInsets = () => {
  const root = document.documentElement;

  if (!mobileLayoutQuery.matches) {
    root.style.setProperty("--safe-top", "0px");
    root.style.setProperty("--safe-bottom", "0px");
    return;
  }

  const makeProbe = (property) => {
    const probe = document.createElement("div");
    probe.style.cssText = `position:fixed;left:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-${property}:constant(safe-area-inset-${property});padding-${property}:env(safe-area-inset-${property},0px);`;
    if (property === "top") {
      probe.style.top = "0";
    } else {
      probe.style.bottom = "0";
    }
    root.appendChild(probe);
    const size =
      property === "top"
        ? probe.getBoundingClientRect().height
        : probe.getBoundingClientRect().height;
    probe.remove();
    return size;
  };

  const probeTop = makeProbe("top");
  const probeBottom = makeProbe("bottom");

  const anchor = document.querySelector(
    ".section-hero, .portfolio-header, .detail-header, .thanks-main, .services-detail-main, .about-detail-main"
  );
  const anchorTop = anchor ? anchor.getBoundingClientRect().top : 0;
  const visualOffset = Math.max(0, window.visualViewport?.offsetTop || 0);
  const measuredTop = Math.max(
    probeTop,
    anchorTop > 0 && anchorTop < 120 ? anchorTop : 0,
    visualOffset
  );

  root.style.setProperty("--safe-top", `${Math.round(measuredTop)}px`);
  root.style.setProperty("--safe-bottom", `${Math.round(probeBottom)}px`);
};

const scheduleSafeInsetMeasure = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(measureSafeInsets);
  });
};

scheduleSafeInsetMeasure();
window.addEventListener("resize", scheduleSafeInsetMeasure);
window.addEventListener("orientationchange", scheduleSafeInsetMeasure);
window.addEventListener("pageshow", scheduleSafeInsetMeasure);

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", scheduleSafeInsetMeasure);
  window.visualViewport.addEventListener("scroll", scheduleSafeInsetMeasure);
}

if (document.fonts?.ready) {
  document.fonts.ready.then(scheduleSafeInsetMeasure);
}
