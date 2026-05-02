/* ------------------------- Loader Logic ------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".loader");
    const fill = document.querySelector(".loader-progress-bar-fill");
  
    let progress = 0;
  
    const interval = setInterval(() => {
      progress += Math.random() * 18;
  
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
  
        setTimeout(() => {
          loader.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          loader.style.opacity = "0";
          loader.style.transform = "translateY(-30px)";
  
          setTimeout(() => {
            loader.remove();
          }, 2000);
        }, 1500);
      }
  
      fill.style.width = progress + "%";
    }, 250);
  });