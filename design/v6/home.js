(function () {
  "use strict";
  const { works } = window.NEST;
  const { ic, esc, Paths, thai } = window.NestShell;
  const $ = (s, r = document) => r.querySelector(s);
  const pick = (id) => works.find((w) => w.id === id);
  const SLIDES = [
    { room: "Game", title: "RE//SLASH", text: "Fast first-person hack-and-slash: parry everything, go Slash Mode with the katana, keep your momentum.", href: Paths.page("project.html#re-slash"), img: new URL("../../hero/assets/reslash/reslash-1920.jpg", document.currentScript.src).href, alt: "RE//SLASH: a sword fighter mid-slash in a neon arena" },
    ...["burrow-knights", "wheelsense", "nestboard"].map(pick).filter(Boolean).map((w) => ({ room: w.room, title: w.name, text: w.blurb, href: Paths.page(`project.html#${w.id}`), art: w })),
  ];
  const hero = $("#hero"); if (!hero) return;
  const video = $("video", hero);
  let cur = 0;
  function paint() {
    const s = SLIDES[cur];
    const img = $(".hero__img", hero);
    img.innerHTML = s.img ? `<img src="${s.img}" alt="${esc(s.alt)}" style="width:100%;height:100%;object-fit:cover;display:block">` : `<span role="img" aria-label="${esc(s.title)}" style="display:block;width:100%;height:100%">${window.Art.draw({ ...s.art, scribble: "" }, 0)}</span>`;
    const svg = $("svg", img); if (svg) { svg.setAttribute("preserveAspectRatio", "xMidYMid slice"); svg.style.cssText = "width:100%;height:100%;display:block"; }
    $(".hero__in", hero).innerHTML = `<span class="tag">${esc(s.room)}</span><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p><div class="hero__acts"><a class="btn" style="background:#fff;color:#1F1B16" href="${s.href}" aria-label="See more: ${esc(s.title)}">See more</a></div>`;
    hero.querySelectorAll(".hero__dots button").forEach((b, i) => (i === cur ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
    thai(hero);
  }
  const motionOn = () => !document.documentElement.classList.contains("calm");
  const rm = matchMedia("(prefers-reduced-motion: reduce)");
  function swap() {
    hero.querySelectorAll(".hero__ghost").forEach((g) => g.remove());
    if (motionOn() && !rm.matches) {
      const g = document.createElement("div");
      g.className = "hero__ghost"; g.setAttribute("aria-hidden", "true"); g.inert = true;
      g.append($(".hero__img", hero).cloneNode(true), $(".hero__in", hero).cloneNode(true));
      $(".hero__in", hero).after(g);
      g.addEventListener("animationend", () => g.remove());
      setTimeout(() => g.remove(), 600);
    }
    paint();
    hero.dispatchEvent(new Event("hero:slide"));
  }
  $(".hero__dots", hero).innerHTML = SLIDES.map((s, i) => `<button type="button" aria-label="Show ${esc(s.title)}"><i></i></button>`).join("");
  $(".hero__dots", hero).addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; cur = [...b.parentElement.children].indexOf(b); swap(); });
  const go = (d) => { cur = (cur + d + SLIDES.length) % SLIDES.length; swap(); };
  hero.querySelectorAll(".hero__side").forEach((b) => { b.innerHTML = ic(+b.dataset.go < 0 ? "back" : "next"); b.addEventListener("click", () => go(+b.dataset.go)); });
  let sx = null, sy = 0;
  hero.addEventListener("touchstart", (e) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }, { passive: true });
  const AUTO = 6000;
  const autoOk = () => motionOn() && !rm.matches;
  let stopped = !autoOk(), hovered = false, focused = false, timer = 0;
  const tick = () => {
    clearTimeout(timer);
    if (stopped || hovered || focused || document.hidden || !autoOk()) return;
    timer = setTimeout(() => go(1), AUTO);
  };
  hero.addEventListener("hero:slide", tick);
  hero.addEventListener("mouseenter", () => { hovered = true; tick(); });
  hero.addEventListener("mouseleave", () => { hovered = false; tick(); });
  hero.addEventListener("focusin", (e) => { if (e.target.matches(":focus-visible")) { focused = true; tick(); } });
  hero.addEventListener("focusout", (e) => { if (!hero.contains(e.relatedTarget)) { focused = false; tick(); } });
  document.addEventListener("visibilitychange", tick);
  const pauseBtn = $(".hero__pause", hero);
  const setPause = () => {
    const playing = autoOk() ? !stopped : video && !video.paused;
    pauseBtn.innerHTML = ic(playing ? "pause" : "play");
    pauseBtn.setAttribute("aria-label", autoOk() ? (playing ? "Pause the slides and video" : "Play the slides and video") : (playing ? "Pause background video" : "Play background video"));
  };
  pauseBtn.addEventListener("click", () => {
    if (autoOk()) { stopped = !stopped; if (video) stopped ? video.pause() : video.play().catch(() => {}); tick(); }
    else if (video) video.paused ? video.play().catch(() => {}) : video.pause();
    setPause();
  });
  if (video) {
    video.addEventListener("play", setPause); video.addEventListener("pause", setPause);
    if (motionOn()) video.play().catch(() => {});
    addEventListener("nest:motion", (e) => { if (!e.detail.on) { video.pause(); stopped = true; tick(); setPause(); } });
  }
  paint(); setPause(); tick();
  NestFeed.mount(document.getElementById("feed"), { title: "Projects", h: "h2", from: "Home", per: () => (innerWidth < 900 ? 3 : 12), onSubmit: (q) => { if (q) location.href = Paths.page(`browse.html?q=${encodeURIComponent(q)}`); } });
})();
