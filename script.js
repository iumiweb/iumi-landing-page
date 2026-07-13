const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const aboutCarousel = document.querySelector(".about-carousel");

if (aboutCarousel) {
  const track = aboutCarousel.querySelector(".about-carousel-track");
  const buttons = aboutCarousel.querySelectorAll(".about-read-more");

  const goToSlide = (index) => {
    track.style.transform = `translateX(-${index * 100}%)`;
    aboutCarousel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const slide = Number(button.dataset.slide);
      if (!Number.isNaN(slide)) {
        goToSlide(slide);
      }
    });
  });
}

document.querySelectorAll(".cta-pill").forEach((button) => {
  button.addEventListener("touchend", () => {
    button.blur();
  });
});

const heroWorksCta = document.querySelector(".hero-works-cta");
const mobileHeroQuery = window.matchMedia("(max-width: 900px)");

if (heroWorksCta) {
  const pressHeroCta = () => {
    if (mobileHeroQuery.matches) {
      heroWorksCta.classList.add("is-pressed");
    }
  };

  const releaseHeroCta = () => {
    heroWorksCta.classList.remove("is-pressed");
  };

  heroWorksCta.addEventListener("pointerdown", pressHeroCta);
  heroWorksCta.addEventListener("pointerup", releaseHeroCta);
  heroWorksCta.addEventListener("pointercancel", releaseHeroCta);
  heroWorksCta.addEventListener("pointerleave", releaseHeroCta);
  heroWorksCta.addEventListener("blur", releaseHeroCta);
}

const mobileLayoutQuery = window.matchMedia("(max-width: 900px)");

const measureSafeTop = () => {
  const root = document.documentElement;

  if (!mobileLayoutQuery.matches) {
    root.style.setProperty("--safe-top", "0px");
    return;
  }

  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;top:0;left:0;height:0;padding-top:constant(safe-area-inset-top);padding-top:env(safe-area-inset-top,0px);visibility:hidden;pointer-events:none;";
  root.appendChild(probe);
  const probeInset = probe.getBoundingClientRect().height;
  probe.remove();

  const anchor = document.querySelector(".section-hero, .portfolio-header, .thanks-main");
  const anchorTop = anchor ? anchor.getBoundingClientRect().top : 0;
  const visualOffset = Math.max(0, window.visualViewport?.offsetTop || 0);
  const measuredInset = Math.max(
    probeInset,
    anchorTop > 0 && anchorTop < 120 ? anchorTop : 0,
    visualOffset
  );

  root.style.setProperty("--safe-top", `${Math.round(measuredInset)}px`);
};

const scheduleSafeTopMeasure = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(measureSafeTop);
  });
};

scheduleSafeTopMeasure();
window.addEventListener("resize", scheduleSafeTopMeasure);
window.addEventListener("orientationchange", scheduleSafeTopMeasure);
window.addEventListener("pageshow", scheduleSafeTopMeasure);

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", scheduleSafeTopMeasure);
  window.visualViewport.addEventListener("scroll", scheduleSafeTopMeasure);
}

if (document.fonts?.ready) {
  document.fonts.ready.then(scheduleSafeTopMeasure);
}
