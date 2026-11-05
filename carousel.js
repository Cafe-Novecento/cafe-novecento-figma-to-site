(() => {
  const track = document.querySelector("#feature-track");
  if (!track) return;
  const slides = [...track.children],
    prev = document.querySelector("#slide-prev"),
    next = document.querySelector("#slide-next"),
    count = document.querySelector("#slide-count");
  let index = 0, requestedIndex = null;
  function update() {
    index = slides.reduce(
      (best, slide, i) =>
        Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft) <
        Math.abs(slides[best].offsetLeft - track.offsetLeft - track.scrollLeft)
          ? i
          : best,
      0,
    );
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    count.textContent =
      String(index + 1).padStart(2, "0") +
      " / " +
      String(slides.length).padStart(2, "0");
  }
  function move(delta) {
    requestedIndex = Math.max(0, Math.min(slides.length - 1, (requestedIndex ?? index) + delta));
    const target = slides[requestedIndex];
    const left = target.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    window.cafeScrollTo(track, "left", left, 700, () => { requestedIndex = null; update(); });
  }
  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", update, { passive: true });
  ["pointerdown", "touchstart", "wheel"].forEach(type => track.addEventListener(type, () => { requestedIndex = null; }, { passive: true }));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      move(e.key === "ArrowLeft" ? -1 : 1);
    }
  });
  addEventListener("resize", update);
  update();
})();
