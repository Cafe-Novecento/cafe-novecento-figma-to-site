
/* Start the entrance only once the logo can actually be painted. */
(() => {
 const logo = document.querySelector(".splash h1 img");
 if (!logo) return;
 let started = false;
 function reveal() {
   if (started) return;
   started = true;
   requestAnimationFrame(() => requestAnimationFrame(() => logo.classList.add("logo-ready")));
 }
 if (logo.complete && logo.naturalWidth > 0) reveal();
 else {
   logo.addEventListener("load", reveal, { once: true });
   logo.addEventListener("error", reveal, { once: true });
 }
})();
/* Shared ease-in-out scrolling; native wheel and touch remain under user control. */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const active = new Map();
  function cancel(element) {
    const job = active.get(element);
    if (!job) return;
    cancelAnimationFrame(job.frame);
    element.style.scrollBehavior = job.behavior;
    element.style.scrollSnapType = job.snap;
    active.delete(element);
  }
  window.cafeScrollTo = (element, axis, destination, duration = 800, done) => {
    cancel(element);
    const start = axis === "left" ? element.scrollLeft : element.scrollTop;
    const max = axis === "left" ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight;
    const end = Math.max(0, Math.min(max, destination));
    const job = { frame: 0, behavior: element.style.scrollBehavior, snap: element.style.scrollSnapType };
    element.style.scrollBehavior = "auto";
    element.style.scrollSnapType = "none";
    active.set(element, job);
    const write = value => { if (axis === "left") element.scrollLeft = value; else element.scrollTop = value; };
    const finish = () => { write(end); cancel(element); if (done) done(); };
    if (reduced.matches || Math.abs(end - start) < 1) { finish(); return; }
    let started;
    function step(time) {
      if (started === undefined) started = time;
      const t = Math.min(1, (time - started) / duration);
      const ease = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      write(start + (end - start) * ease);
      if (t < 1) job.frame = requestAnimationFrame(step);
      else finish();
    }
    job.frame = requestAnimationFrame(step);
  };
  function interrupt() { for (const element of [...active.keys()]) cancel(element); }
  addEventListener("wheel", interrupt, { passive: true });
  addEventListener("touchstart", interrupt, { passive: true });
  addEventListener("pointerdown", interrupt, { passive: true });
  addEventListener("keydown", event => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) interrupt();
  });
  reduced.addEventListener("change", interrupt);
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    const url = new URL(link.href, location.href);
    if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const root = document.scrollingElement;
    const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = target.getBoundingClientRect().top + root.scrollTop - offset;
    window.cafeScrollTo(root, "top", top, 850, () => {
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      const temporary = !target.hasAttribute("tabindex");
      if (temporary) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (temporary) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    });
  });
})();
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
