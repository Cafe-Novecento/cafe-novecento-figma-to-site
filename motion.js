(() => {
  const body = document.body,
    splash = document.querySelector(".splash"),
    header = document.querySelector(".masthead");
  if (!splash || !header) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let last = window.scrollY,
    queued = false,
    shown = false;
  body.classList.add("motion-enabled");
  function update() {
    const y = window.scrollY,
      down = y >= last;
    const viewport = document.documentElement.clientHeight;
    const fade = Math.max(
      0,
      Math.min(1, (y - 8) / Math.max(80, viewport * 0.14)),
    );
    body.style.setProperty("--reveal", String(reduced.matches ? 1 : fade));
    body.style.setProperty("--header-height", header.offsetHeight + "px");
    const threshold = splash.offsetTop + splash.offsetHeight;
    if (y >= threshold && (down || !shown)) shown = true;
    if (y < threshold) shown = false;
    header.classList.toggle("header-visible", shown);
    last = y;
    queued = false;
  }
  function request() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  addEventListener("pageshow", request);
  reduced.addEventListener("change", request);
  update();
})();
