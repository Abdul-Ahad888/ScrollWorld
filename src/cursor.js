window.addEventListener("mousemove", (e) => {
  document.querySelectorAll(".eye").forEach((eye) => {
    const pupil = eye.querySelector(".pupil");

    const rect = eye.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);

    const maxMove = 40;
    const x = Math.cos(angle) * maxMove;
    const y = Math.sin(angle) * maxMove;

    pupil.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;    
  });
});


