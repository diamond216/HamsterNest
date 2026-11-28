window.NestFeed = (function () {
  "use strict";
  const { works, tiers } = window.NEST;
  const { ic, esc, thai, Paths, search, rankIcon, Back } = window.NestShell;
  const { BrowseState, sortWorks } = window.BrowseKit;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROOMS = ["Game", "IoT", "Web", "Idea"];
  const tierName = (id) => tiers.find((t) => t.id === id).name;
  const isPhone = () => innerWidth < 900;
  const fine = matchMedia("(hover: hover) and (pointer: fine)");

  const card = (w, i, opts = {}) => {
    const name = opts.name || w.name, rank = opts.noRank ? "new, not ranked yet" : tierName(w.tier);
    const rk = opts.noRank ? "" : `<span class="pc__rk" title="${tierName(w.tier)}">${rankIcon(w.tier, 18)}</span>`;
    const href = opts.href || Paths.page(`project.html#${w.id}`);
    const did = `pcd-${w.id}-${++seq}`;
    const vtag = w.video ? `<span class="pc__vtag">${ic("play")}Video</span>` : "";
    return `<div class="pc" data-id="${w.id}"><span class="pc__hl" aria-hidden="true"></span><a class="pc__link" href="${href}" aria-describedby="${did}"><span class="pc__pic" aria-hidden="true">${window.Art.draw(w, (opts.frame ?? i) % 7)}${vtag}<span class="pc__ov"></span></span>
      <span class="pc__row"><h3 class="pc__name">${esc(name)}<span class="vh">, ${rank}</span></h3>${rk}<span class="tag">${esc(opts.room || w.room)}</span></span>
      <span class="pc__by">${esc(opts.maker || w.maker)}</span><span class="pc__upd">${esc(opts.upd || `Updated ${w.update.when}`)}</span></a><span class="vh" id="${did}">${esc(w.blurb)}</span></div>`;
  };
  let seq = 0;

  function wireCards(grid, from) {
    grid.addEventListener("click", (e) => {
      if (e.target.closest(".pc__link") && from) { try { sessionStorage.setItem("nest-from", from); } catch (x) {} }
    });
    const still = () => document.documentElement.classList.contains("calm") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rich = () => fine.matches && innerWidth >= 600;
    let cur = null, how = "", t1 = 0, t2 = 0, vid = null;
    const stopVid = () => {
      clearTimeout(t1);
      if (vid) { vid.pause(); vid.removeAttribute("src"); vid.load(); vid.remove(); vid = null; }
      if (cur) { cur.classList.remove("v-play"); const pr = $(".pc__prog", cur); if (pr) pr.remove(); }
    };
    const shut = () => {
      clearTimeout(t2); stopVid();
      if (!cur) return;
      cur.classList.remove("s-open");
      $(".pc__ov", cur).innerHTML = "";
    };
    const hide = () => { shut(); if (cur) cur.classList.remove("s-hl"); cur = null; how = ""; };
    const startVid = (c, w) => {
      const pic = $(".pc__pic", c); if (!pic || !w.video || still()) return;
      vid = document.createElement("video");
      vid.className = "pc__vid"; vid.muted = true; vid.playsInline = true; vid.preload = "auto";
      vid.setAttribute("disablepictureinpicture", ""); vid.setAttribute("aria-hidden", "true"); vid.src = w.video;
      pic.firstElementChild.after(vid);
      const v = vid;
      v.addEventListener("playing", () => {
        if (v !== vid) return;
        v.classList.add("on"); c.classList.add("v-play");
        if (!$(".pc__prog", pic)) pic.insertAdjacentHTML("beforeend", '<span class="pc__prog"><i></i></span>');
      }, { once: true });
      v.addEventListener("timeupdate", () => { const i = $(".pc__prog i", pic); if (i && v.duration) i.style.width = `${(v.currentTime / v.duration) * 100}%`; });
      v.play().catch(() => {});
    };
    const open = (c, w) => {
      const ov = $(".pc__ov", c);
      ov.innerHTML = `<span class="bl">${esc(w.blurb)}</span><span class="fx">${esc(w.genre)} · Runs on ${esc(w.platforms.join(", "))}</span><span class="lu"><i></i>Latest update</span><span class="ut">${esc(w.update.what)}</span>`;
      thai(ov);
      c.classList.add("s-open");
    };
    const start = (c, mode) => {
      if (c === cur) return;
      hide();
      const w = works.find((x) => x.id === c.dataset.id); if (!w) return;
      cur = c; how = mode;
      if (mode === "mouse") c.classList.add("s-hl");
      t1 = setTimeout(() => { if (cur === c) startVid(c, w); }, 300);
      t2 = setTimeout(() => { if (cur === c) open(c, w); }, 500);
    };
    grid.addEventListener("pointerover", (e) => {
      if (e.pointerType !== "mouse" || !rich()) return;
      const c = e.target.closest(".pc"); if (c && grid.contains(c) && !c.classList.contains("pc--sk")) start(c, "mouse");
    });
    grid.addEventListener("pointerout", (e) => { const c = e.target.closest(".pc"); if (c && c === cur && how === "mouse" && !c.contains(e.relatedTarget)) hide(); });
    grid.addEventListener("focusin", (e) => {
      const l = e.target.closest(".pc__link");
      if (!l || !rich() || !l.matches(":focus-visible")) { if (cur && !cur.contains(e.target)) hide(); return; }
      start(l.closest(".pc"), "key");
    });
    grid.addEventListener("focusout", (e) => { if (cur && how === "key" && !cur.contains(e.relatedTarget)) hide(); });
    let px = -1, py = -1, sf = 0;
    addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { px = e.clientX; py = e.clientY; } }, { passive: true });
    document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) px = py = -1; });
    const under = () => {
      sf = 0;
      const el = px < 0 || !rich() ? null : document.elementFromPoint(px, py), c = el && el.closest(".pc");
      if (c && grid.contains(c) && !c.classList.contains("pc--sk")) start(c, "mouse");
      else if (how === "mouse") hide();
    };
    addEventListener("scroll", () => { if (how !== "key" && !sf) sf = requestAnimationFrame(under); }, { passive: true });
    addEventListener("resize", hide);
    addEventListener("keydown", (e) => { if (e.key === "Escape" && cur) { shut(); } });
    addEventListener("nest:motion", (e) => { if (!e.detail.on) stopVid(); });
    return { hide };
  }

  function mount(host, cfg) {
    const items = cfg.items || works, of = cfg.of || ((w) => w), noun = cfg.noun || ["project", "projects"];
    const state = new BrowseState(cfg.items ? { items, of, text: cfg.text } : {});
    const from = cfg.from || "Browse";
    const per = () => (cfg.per ? cfg.per() : isPhone() ? 8 : 16);
    let shown = per();
    host.innerHTML = `<div class="chips" role="toolbar" aria-label="Categories and ranks"></div>
      <div class="sh"><${cfg.h} class="sh__t"></${cfg.h}>${cfg.h === "h1" ? '<h2 class="vh">Projects</h2>' : ""}<span class="sort-host"></span></div>
      <div class="${cfg.listClass || "grid"}"></div><div class="more" hidden aria-hidden="true"></div>`;
    const chipsEl = $(".chips", host), grid = $("." + (cfg.listClass || "grid"), host), more = $(".more", host);
    const hv = wireCards(grid, from);
    const pad = () => { const t = parseFloat(getComputedStyle(chipsEl).top); document.documentElement.style.scrollPaddingTop = `${(isNaN(t) ? 0 : t) + chipsEl.offsetHeight + 12}px`; };
    pad(); new ResizeObserver(pad).observe(chipsEl); addEventListener("resize", pad);

    function chips() {
      chipsEl.innerHTML = `<div class="chips__g" role="group" aria-label="Categories">${["All", ...ROOMS].map((r) => `<button type="button" class="chip" data-room="${r}" aria-pressed="${state.tab === r}">${r === "All" ? "All categories" : r}</button>`).join("")}</div>${cfg.noRank ? "" : `<div class="chips__g chips__g--rk" role="group" aria-label="Ranks"><button type="button" class="chip" data-rank="all" aria-pressed="${!state.ranks.size}">All ranks</button>${tiers.map((t) => `<button type="button" class="chip" data-rank="${t.id}" aria-pressed="${state.ranks.has(t.id)}">${rankIcon(t.id)}${t.name}</button>`).join("")}</div>`}`;
    }

    const SORTS = [["new", "Newest"], ["old", "Oldest"], ["pop", "Popular"]], sid = `sortd-${++seq}`;
    let sortOpen = false;
    function sortSync() {
      const sh = $(".sort-host", host);
      if (!SORTS.some(([v]) => v === state.sort)) state.sort = "new";
      if (!$(".sortd", sh)) sh.innerHTML = `<div class="sortd"><span class="vh" id="${sid}-l">Sort projects</span><button type="button" class="sortd__btn" aria-haspopup="listbox" aria-expanded="false" aria-controls="${sid}-m" aria-labelledby="${sid}-l ${sid}-v"><span class="sortd__k">Sort</span><span class="sortd__v" id="${sid}-v"></span><svg class="ico sortd__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <ul class="sortd__menu" id="${sid}-m" role="listbox" aria-label="Sort projects" hidden>${SORTS.map(([v, l]) => `<li role="option" class="sortd__o" data-sort="${v}" tabindex="-1"><span>${l}</span><svg class="ico sortd__ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></li>`).join("")}</ul></div>`;
      const v = $(".sortd__v", sh), cur = SORTS.find(([k]) => k === state.sort);
      if (v.dataset.v !== cur[0]) { v.dataset.v = cur[0]; v.textContent = cur[1]; }
      $$(".sortd__o", sh).forEach((o) => o.setAttribute("aria-selected", String(o.dataset.sort === cur[0])));
    }
    function setSort(on, focus) {
      const d = $(".sortd", host); if (!d) return;
      sortOpen = on;
      const b = $(".sortd__btn", d), m = $(".sortd__menu", d);
      b.setAttribute("aria-expanded", String(on)); m.hidden = !on;
      if (on) ($('.sortd__o[aria-selected="true"]', m) || $(".sortd__o", m)).focus();
      else if (focus) b.focus();
    }
    function pickSort(v) { setSort(false, true); if (v !== state.sort) state.set((x) => (x.sort = v)); }
    function paint() {
      hv.hide();
      const q = state.q.trim(), hit = items.filter((x) => state.matches(x)), list = cfg.items ? hit : sortWorks(hit, state.sort);
      const sh = $(".sh", host); sh.classList.toggle("res", !!q);
      $(".sh__t", host).textContent = q ? `Results for “${q}”` : (typeof cfg.title === "function" ? cfg.title() : cfg.title);
      if (!cfg.items) sortSync();
      grid.style.setProperty("--cols", cfg.cols ? cfg.cols() : "");
      const empty = `<p class="empty" style="grid-column:1/-1">No ${noun[1]} match`;
      if (list.length && cfg.render) cfg.render(grid, list.slice(0, shown));
      else grid.innerHTML = list.length ? list.slice(0, shown).map((w, i) => card(w, i)).join("") : `${empty} “${esc(q || "these filters")}”<button type="button" class="btn btn--line" data-c="reset">Clear</button></p>`;
      more.hidden = list.length <= shown;
      total = list.length; grid.removeAttribute("aria-busy");
      thai(grid);
    }

    chipsEl.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.room) state.setTab(b.dataset.room);
      if (b.dataset.rank === "all") { if (state.ranks.size) state.set((x) => x.ranks.clear()); }
      else if (b.dataset.rank && !(state.ranks.size === 1 && state.ranks.has(b.dataset.rank))) state.onlyRank(b.dataset.rank);
    });
    host.addEventListener("click", (e) => {
      if (e.target.closest(".sortd__btn")) return setSort(!sortOpen);
      const s = e.target.closest(".sortd__o"); if (s) return pickSort(s.dataset.sort);
      if (e.target.closest('[data-c="reset"]')) { state.set((x) => { x.q = ""; x.ranks.clear(); x.rooms.clear(); x.genres.clear(); x.plats.clear(); }); if (search.input) { search.input.value = ""; search.paint(); } }
    });
    host.addEventListener("keydown", (e) => {
      if (e.target.matches(".sortd__btn")) { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setSort(true); } return; }
      const o = e.target.closest(".sortd__o"); if (!o) return;
      const all = $$(".sortd__o", host), i = all.indexOf(o), go = (j) => all[(j + all.length) % all.length].focus();
      if (e.key === "ArrowDown") { e.preventDefault(); go(i + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); go(i - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(all.length - 1); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickSort(o.dataset.sort); }
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setSort(false, true); }
      else if (e.key === "Tab") setSort(false);
    });
    document.addEventListener("pointerdown", (e) => { const d = $(".sortd", host); if (sortOpen && d && !d.contains(e.target)) setSort(false); });
    let total = 0, gen = 0, loading = false;
    const SK = '<div class="pc pc--sk" aria-hidden="true"><span class="pc__pic sk"></span><span class="sk sk--t"></span><span class="sk sk--s"></span></div>';
    const skel = (n) => {
      const cols = $$(".mas__col", grid);
      if (!cols.length) { grid.insertAdjacentHTML("beforeend", Array.from({ length: n }, () => SK).join("")); return; }
      for (let i = 0; i < n; i++) {
        const c = cols.reduce((a, b) => (b.offsetHeight < a.offsetHeight ? b : a));
        c.insertAdjacentHTML("beforeend", `<div class="lc lc--sk" aria-hidden="true"><span class="lc__pic sk" style="aspect-ratio:1 / ${[1.25, 0.75, 1, 1.5][i % 4]}"></span><span class="sk sk--t"></span><span class="sk sk--s"></span></div>`);
      }
    };
    const io = new IntersectionObserver((es) => {
      if (loading || more.hidden || !es.some((e) => e.isIntersecting)) return;
      loading = true; const g = gen;
      grid.setAttribute("aria-busy", "true"); skel(Math.min(per(), total - shown));
      setTimeout(() => { loading = false; if (g !== gen) return; shown += per(); paint(); io.unobserve(more); io.observe(more); }, 450);
    }, { rootMargin: "0px 0px 400px 0px" });
    io.observe(more);
    state.addEventListener("change", () => { gen++; loading = false; shown = per(); chips(); paint(); });

    if (search.input) {
      search.input.addEventListener("input", () => state.set((s) => (s.q = search.input.value)));
      search.onSubmit = cfg.onSubmit || null;
    }
    const P = new URLSearchParams(location.search);
    if (P.get("q")) state.q = P.get("q");
    const room = P.get("room") || ((location.hash.match(/^#browse-(\w+)$/) || [])[1] || "");
    const R = ROOMS.find((r) => r.toLowerCase() === room.toLowerCase()); if (R) state.tab = R;
    let wasPhone = isPhone();
    addEventListener("resize", () => { if (isPhone() !== wasPhone) { wasPhone = isPhone(); paint(); } });
    addEventListener("nest:lang", () => paint());
    const KEY = `nest-feed:${location.pathname}`;
    let back = null;
    try { if (Back.came) back = JSON.parse(sessionStorage.getItem(KEY)); else sessionStorage.removeItem(KEY); } catch (e) { back = null; }
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (back) {
      if (back.tab === "All" || ROOMS.includes(back.tab)) state.tab = back.tab;
      if (!cfg.noRank && Array.isArray(back.ranks)) { state.ranks.clear(); back.ranks.filter((r) => tiers.some((t) => t.id === r)).forEach((r) => state.ranks.add(r)); }
      if (!cfg.items && SORTS.some(([v]) => v === back.sort)) state.sort = back.sort;
      if (back.shown > shown) shown = back.shown;
    }
    addEventListener("pagehide", () => {
      try { sessionStorage.setItem(KEY, JSON.stringify({ shown, y: scrollY, tab: state.tab, ranks: [...state.ranks], sort: state.sort })); } catch (e) {}
    });
    addEventListener("pageshow", (e) => { if (e.persisted) hv.hide(); });
    chips(); paint();
    if (back && back.y > 0) {
      const y = back.y; let moved = false;
      const mark = () => { moved = true; };
      ["wheel", "touchstart", "keydown"].forEach((t) => addEventListener(t, mark, { once: true, passive: true }));
      scrollTo(0, y);
      const again = () => { if (!moved && Math.abs(scrollY - y) > 2) scrollTo(0, y); };
      requestAnimationFrame(again);
      if (document.readyState !== "complete") addEventListener("load", again, { once: true });
    }
    return { state, paint };
  }

  return { mount, card, wireCards, tierName };
})();
