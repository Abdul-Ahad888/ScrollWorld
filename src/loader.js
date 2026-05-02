/* ------------------------- Loader Logic ------------------------- */
// Show loader until everything (including images, etc) is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  const fill = document.querySelector(".loader-progress-bar-fill");
  let progress = 0;

  const advanceProgress = () => {
    // Simulate smooth progress but stop at 95% until full load
    if (progress < 95) {
      progress += Math.random() * 8;
      if (progress > 95) progress = 95;
      fill.style.width = progress + "%";
      setTimeout(advanceProgress, 250);
    }
  };

  advanceProgress();

  // Complete progress bar and hide loader only when whole page is loaded
  window.addEventListener("load", () => {
    progress = 100;
    fill.style.width = "100%";

    setTimeout(() => {
      loader.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      loader.style.opacity = "0";
      loader.style.transform = "translateY(-30px)";

      setTimeout(() => {
        loader.remove();
      }, 2000);
    }, 700);
  });
});