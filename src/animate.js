import SplitType from "split-type";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Text Reveal Animation
const revealTexts = document.querySelectorAll(".reveal-text");
const heroScroll = document.querySelectorAll(".hero")

revealTexts.forEach((el) => {
  const split = new SplitType(el);

  gsap.set(split.chars, { opacity: 0.2 });

  gsap.to(split.chars, {
    opacity: 1,
    stagger: 0.05,
    ease: "none",
    scrollTrigger: {
      trigger: ".outro",
      start: "50%",
      end: () => heroScroll.end + window.innerHeight * 0.1, // optional end
      scrub: true
    }
  });
});


// Sec-2 Text Box Animation
const cards = document.querySelectorAll(".text-tab");
const section = document.querySelector(".sec-2");

if (section && cards.length > 0) {
  window.addEventListener("scroll", () => {
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = sectionRect.top + window.scrollY;
    const sectionHeight = section.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate scroll position at which section's 50% is in the center of viewport
    const centerViewportY = scrollY + windowHeight / 2;
    const sectionMiddle = sectionTop + sectionHeight / 2;

    // Find which card is currently closest to 50% of the section as viewed from viewport center
    cards.forEach((card, i) => {
      const cardRect = card.getBoundingClientRect();
      const cardTopAbs = cardRect.top + window.scrollY;
      const cardHeight = card.offsetHeight;
      const cardMiddle = cardTopAbs + cardHeight / 2;

      const distance = Math.abs(cardMiddle - centerViewportY);

      if (
        Math.abs(centerViewportY - cardMiddle) <
        cardHeight / 2
      ) {
        card.style.opacity = 1;
      } else {
        card.style.opacity = 0.1;
      }
    });
  });
}


// Sec-2 Rotate Circular Img
gsap.to('.sticky-tab-img', {
  rotate: "360deg",
  scrollTrigger: {
    trigger: ".sec-2",
    start: "40%",
    end: "100%",
    scrub: true
  }
})

// Sec-2 Center Circular Img Horizontally 
const img = document.querySelector(".sticky-tab-img");

const moveToCenterX = () => {
  const rect = img.getBoundingClientRect();
  const elementCenterX = rect.left + rect.width / 2;
  const viewportCenterX = window.innerWidth / 2;

  return viewportCenterX - elementCenterX;
};

gsap.to('.sticky-tab-img', {
  rotate: "180deg",
  x: moveToCenterX,
  scrollTrigger: {
    trigger: ".sec-2",
    start: "100%",
    end: "120%",
    scrub: true,
    invalidateOnRefresh: true
  }
})