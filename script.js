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
