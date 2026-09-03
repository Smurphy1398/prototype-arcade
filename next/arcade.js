(function () {
  const KEY = "protoarcade.reduceMotion";
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const sysReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function prefReduce() {
    try { if (localStorage.getItem(KEY) === "1") return true; } catch (e) {}
    return sysReduce.matches;
  }
  function applyPref() {
    document.documentElement.classList.toggle("reduce-motion", prefReduce());
    const box = document.querySelector("[data-reduce-motion]");
    if (box) box.checked = prefReduce();
  }
  applyPref();
  document.querySelectorAll("[data-reduce-motion]").forEach((box) => {
    box.addEventListener("change", () => {
      try { localStorage.setItem(KEY, box.checked ? "1" : "0"); } catch (e) {}
      applyPref();
      document.dispatchEvent(new CustomEvent("arcade-motion"));
    });
  });
  sysReduce.addEventListener("change", () => {
    applyPref();
    document.dispatchEvent(new CustomEvent("arcade-motion"));
  });

  document.querySelectorAll("[data-slideshow]").forEach((stage) => {
    const slides = [...stage.querySelectorAll("img[data-slide]")];
    if (!slides.length) return;
    const mode = stage.getAttribute("data-slideshow") || "lobby";
    const autoIdx = slides
      .map((el, idx) => (el.hasAttribute("data-manual-only") ? -1 : idx))
      .filter((idx) => idx >= 0);
    let i = 0;
    let timer = null;
    const dots = stage.querySelector(".dots");
    const nav = stage.querySelector(".nav-slides");
    if (slides.length < 2 && nav) nav.hidden = true;
    slides.forEach((_, idx) => {
      if (!dots) return;
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Image " + (idx + 1));
      b.addEventListener("click", (e) => { e.stopPropagation(); go(idx); });
      dots.appendChild(b);
    });
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((el, idx) => el.classList.toggle("is-on", idx === i));
      if (dots) [...dots.children].forEach((b, idx) => b.classList.toggle("is-on", idx === i));
    }
    function nextAuto() {
      if (!autoIdx.length) return;
      const pos = autoIdx.indexOf(i);
      const nxt = autoIdx[(pos < 0 ? 0 : pos + 1) % autoIdx.length];
      go(nxt);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function canAuto() {
      return !prefReduce() && !document.hidden && autoIdx.length > 1;
    }
    function startLobby() {
      stop();
      if (canAuto()) timer = setInterval(nextAuto, 10000);
    }
    function startFloor() {
      stop();
      if (canAuto()) timer = setInterval(nextAuto, 9000);
    }
    go(0);
    const prev = stage.querySelector("[data-prev]");
    const next = stage.querySelector("[data-next]");
    if (prev) prev.addEventListener("click", (e) => { e.stopPropagation(); go(i - 1); });
    if (next) next.addEventListener("click", (e) => { e.stopPropagation(); go(i + 1); });

    if (mode === "floor") {
      stop();
      if (!coarse) {
        stage.addEventListener("mouseenter", startFloor);
        stage.addEventListener("mouseleave", () => { stop(); go(0); });
        stage.addEventListener("focusin", startFloor);
        stage.addEventListener("focusout", () => { stop(); go(0); });
      }
      document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
      document.addEventListener("arcade-motion", stop);
    } else {
      startLobby();
      stage.addEventListener("mouseenter", stop);
      stage.addEventListener("mouseleave", startLobby);
      stage.addEventListener("focusin", stop);
      stage.addEventListener("focusout", startLobby);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop(); else startLobby();
      });
      document.addEventListener("arcade-motion", () => { stop(); startLobby(); });
    }
  });
})();
