window.NestShell = (function () {
  "use strict";
  const { Session, Store, Paths, toast } = window.NestSession;
  const { works } = window.NEST;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const body = document.body, root = document.documentElement;
  (() => {
    const main = document.getElementById("main"); if (!main) return;
    root.classList.add("ld"); main.setAttribute("aria-busy", "true");
    const done = () => setTimeout(() => { root.classList.remove("ld"); main.removeAttribute("aria-busy"); }, Math.max(0, 600 - performance.now()));
    if (document.readyState === "loading") addEventListener("DOMContentLoaded", done, { once: true }); else done();
  })();
  const page = body.dataset.page || "";
  const detail = ["project", "profile", "post", "settings"].includes(page);
  const GEAR = (() => { const p = []; for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; [[-0.2, 8.6], [0.2, 8.6], [0.32, 6.4], [0.47, 6.4]].forEach(([o, r]) => { const t = a + o; p.push((p.length ? "L" : "M") + (12 + r * Math.cos(t)).toFixed(2) + " " + (12 + r * Math.sin(t)).toFixed(2)); }); } return '<path d="' + p.join("") + 'z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.6"/>'; })();
  const I = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    browse: '<rect x="4" y="4" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="4" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="4" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="13" width="7" height="7" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    logs: '<path d="M6 4h9l3 3v13H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 11h6M9 15h6M9 8h3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    about: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    follow: '<path d="M6 19V6a1 1 0 011-1h10a1 1 0 011 1v13l-6-3.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    home: '<path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-5h-6v5H5a1 1 0 01-1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    search: '<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
    back: '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    next: '<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    pause: '<path d="M8 6h3v12H8zM13 6h3v12h-3z" fill="currentColor"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M16 8V6a1 1 0 00-1-1H6a1 1 0 00-1 1v9a1 1 0 001 1h2" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    mail: '<path d="M4 6.5h16v11H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M4.5 7l7.5 6 7.5-6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    alert: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7.5v5.5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    lamp: '<path d="M9 18h6M10 21h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 3a6 6 0 00-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0012 3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    x: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    user: '<circle cx="12" cy="9" r="3.8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5 19.5c1.2-3.4 3.9-5 7-5s5.8 1.6 7 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    gear: GEAR,
    out: '<path d="M14 5H6v14h8M10 12h10M17 9l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  const ic = (k, cls = "ico") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;
  const IMG = new URL("img/", document.currentScript.src).href;
  const MARK = `<img class="logo" src="${IMG}logo-mark.png" width="52" height="40" alt="" decoding="async">`;
  const rankIcon = (id, size = 16) => `<img class="rki" src="${IMG}rank-${id}.png" srcset="${IMG}rank-${id}@2x.png 2x" width="${size}" height="${size}" alt="" decoding="async">`;
  const SIL = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="7" fill="var(--sil)"/><path d="M6 38c1.6-8.4 7.2-13 14-13s12.4 4.6 14 13z" fill="var(--sil)"/></svg>';
  const AVATAR_WORK = "cheek-pouch";
  const Me = {
    KEY: "nest-me",
    get() { try { return JSON.parse(Store.get(this.KEY)) || {}; } catch (e) { return {}; } },
    set(v) { Store.set(this.KEY, JSON.stringify(v)); dispatchEvent(new CustomEvent("nest:me")); },
  };
  const myPic = () => {
    const m = Me.get();
    if (m.pic === "none") return [SIL, true];
    if (m.pic) return [`<img src="${esc(m.pic)}" alt="">`, false];
    const w = window.NEST.byId && window.NEST.byId(AVATAR_WORK);
    return w && window.Art ? [window.Art.draw(w, 0), false] : [SIL, true];
  };
  const avatar = (size, label = "") => {
    const [pic, none] = myPic();
    return `<span class="av av--${size}${none ? " av--none" : ""}"${label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"'}>${pic}</span>`;
  };
  const face = (name) => {
    if (name === Session.user.name) { const [pic, none] = myPic(); return `<span class="face${none ? " av--none" : ""}" aria-hidden="true">${pic}</span>`; }
    return `<span class="face face--i" style="--h:${window.NestSession.hue(name)}" aria-hidden="true">${esc(String(name)[0] || "")}</span>`;
  };
  const wb = (s) => esc(s).replace(s.includes("@") ? /@/ : /([\/.])/g, s.includes("@") ? "@<wbr>" : "$1<wbr>");
  const thai = (root2 = document) => $$(".pc__name,.pc__by,.lc__title,.lc__ex,.sl b,.si span,.wt h1,.pc__more p,.pitch,.tmn", root2).forEach((e) => { if (/[฀-๿]/.test(e.textContent)) e.lang = "th"; });

  const Follows = {
    KEY: "nest-follows",
    list() {
      try { const v = JSON.parse(Store.get(this.KEY)); if (Array.isArray(v)) return v; } catch (e) {}
      let seed = ["burrow-knights", "bus-ping", "nestboard", "lantern-run", "rain-jar"];
      try { const f = JSON.parse(Store.get("nest-favs")); if (Array.isArray(f) && f.length) seed = f.map((x) => (Array.isArray(x) ? x[0] : x.id)).filter(Boolean); } catch (e) {}
      return seed.filter((id) => works.some((w) => w.id === id));
    },
    has(id) { return this.list().includes(id); },
    toggle(id) {
      const l = this.list(), on = !l.includes(id);
      Store.set(this.KEY, JSON.stringify(on ? [id, ...l] : l.filter((x) => x !== id)));
      dispatchEvent(new CustomEvent("nest:follows", { detail: { id, on } }));
      return on;
    },
    isNew(w) { return ["today", "yesterday"].includes(w.update.when); },
  };

  const darkMQ = matchMedia("(prefers-color-scheme: dark)");
  let themeMem = null;
  const theme = {
    get dark() { return root.dataset.theme === "dark"; },
    get pick() {
      try { const v = localStorage.getItem("nest-theme"); return v === "dark" || v === "light" ? v : "device"; } catch (e) { return themeMem || "device"; }
    },
    get device() { return darkMQ.matches ? "dark" : "light"; },
    paint(dark) {
      root.dataset.theme = dark ? "dark" : "light";
      $$(".thm").forEach((b) => b.setAttribute("aria-pressed", String(dark)));
      $$(".sw[data-sw=theme]").forEach((b) => b.setAttribute("aria-checked", String(dark)));
      dispatchEvent(new CustomEvent("nest:theme", { detail: { pick: this.pick, dark } }));
    },
    set(dark) {
      themeMem = dark ? "dark" : "light";
      try { localStorage.setItem("nest-theme", themeMem); } catch (e) {}
      this.paint(dark);
    },
    choose(v) {
      if (v !== "device") return this.set(v === "dark");
      themeMem = null;
      try { localStorage.removeItem("nest-theme"); } catch (e) {}
      this.paint(darkMQ.matches);
    },
  };
  darkMQ.addEventListener("change", () => { if (theme.pick === "device") theme.paint(darkMQ.matches); });
  const motion = {
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    get on() { const v = Store.get("nest-motion"); return v === null ? !this.reduced : v === "on"; },
    apply() {
      const on = this.on;
      root.classList.toggle("calm", !on);
      $$(".sw[data-sw=anim]").forEach((b) => b.setAttribute("aria-checked", String(on)));
      dispatchEvent(new CustomEvent("nest:motion", { detail: { on } }));
    },
    toggle() { Store.set("nest-motion", this.on ? "off" : "on"); this.apply(); },
  };
  const lang = {
    get cur() { return root.lang === "th" ? "th" : "en"; },
    set(l) {
      try { localStorage.setItem("nest-lang", l); } catch (e) {}
      root.lang = l;
      if (window.NestI18n) window.NestI18n.apply();
      paintLang();
      dispatchEvent(new CustomEvent("nest:lang", { detail: { lang: l } }));
    },
  };
  const paintLang = () => $$(".lang").forEach((g) => $$("button", g).forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.lang || "en") === lang.cur))));
  const langGroup = () => `<div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="th" aria-pressed="false" lang="th">ไทย</button></div>`;

  function topBar() {
    const tb = $("#tb"); if (!tb) return;
    const signed = Session.signedIn, u = Session.user;
    tb.innerHTML = `
      <div class="tb__l"><button type="button" class="ibtn" data-act="menu" aria-label="Menu" aria-expanded="false" aria-controls="side">${ic("menu")}</button><a class="mark" href="${Paths.home()}" aria-label="Hamster Nest home">${MARK}<span class="mark__w">Hamster Nest</span></a></div>
      <form class="srch" role="search" action="${Paths.page("browse.html")}"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;color:var(--t3)">${I.search}</svg><input type="search" name="q" placeholder="Search" aria-label="Search Hamster Nest" autocomplete="off"><kbd aria-hidden="true">/</kbd></form>
      <div class="tb__r"><button type="button" class="ibtn ph-only" data-act="search" aria-label="Search">${ic("search")}</button>${signed ? `<button type="button" class="ibtn ph-only acct-ph" data-act="acct" aria-haspopup="menu" aria-expanded="false" aria-controls="acct-menu" aria-label="Account menu, ${esc(u.name)}">${avatar(32)}</button>` : ""}${langGroup()}<button type="button" class="ibtn thm" aria-pressed="${theme.dark}" aria-label="Dark theme" title="Dark theme">${ic("lamp")}</button>${signed ? `<a class="btn btn--line" href="${Paths.page("post.html")}">${ic("plus")}Build</a><span class="acct-wrap"><button type="button" class="acct" data-act="acct" aria-haspopup="menu" aria-expanded="false" aria-controls="acct-menu" aria-label="Account menu, ${esc(u.name)}">${avatar(32)}</button></span>` : `<a class="btn btn--ghost" href="#" data-in>Log in</a><a class="btn btn--ink" href="#" data-in>Sign up</a>`}</div>
      <div class="srch-row"><button type="button" class="ibtn" data-act="search-close" aria-label="Close search">${ic("back")}</button><form class="srch" role="search" action="${Paths.page("browse.html")}"><input type="search" name="q" placeholder="Search" aria-label="Search Hamster Nest" autocomplete="off"><button type="button" class="ibtn" data-act="search-clear" style="width:30px;height:30px" aria-label="Clear">${ic("x")}</button></form></div>`;
  }

  function sideMenu() {
    const side = $("#side"); if (!side) return;
    const cur = { home: "home", browse: "browse", devlogs: "logs" }[page] || "";
    const signed = Session.signedIn, u = Session.user;
    const fol = Follows.list().map((id) => works.find((w) => w.id === id)).filter(Boolean);
    const si = (k, label, href) => `<a class="si" href="${href}"${cur === k ? ' aria-current="page"' : ""}>${ic(k)}<span>${label}</span></a>`;
    const rooms = ["Game", "IoT", "Web", "Idea"];
    side.innerHTML = `
      <div class="drawer-head"><button type="button" class="ibtn" data-act="menu-close" aria-label="Close menu">${ic("menu")}</button><span class="mark">${MARK}</span></div>
      ${signed ? `<div class="dacct"><div class="who"><a href="${Paths.page(`profile.html#${u.handle}`)}">${avatar(40)}<span><b>${esc(Me.get().name || u.name)}</b><small>View your profile</small></span></a><button type="button" class="btn btn--line" data-act="logout">Log out</button></div><a class="btn btn--line post" href="${Paths.page("post.html")}">${ic("plus")}Build</a><hr></div>` : ""}
      ${si("home", "Home", Paths.home())}${si("browse", "Browse", Paths.page("browse.html"))}${si("logs", "Dev logs", Paths.page("devlogs.html"))}
      <div class="mini-only"><hr>${si("follow", "Following", Paths.page(`profile.html#${u.handle}/following`))}</div>
      <div class="full-only"><hr><h4>Following</h4>
        ${fol.length ? fol.slice(0, 5).map((w) => `<a class="si" href="${Paths.page(`project.html#${w.id}`)}"><span class="thumb" aria-hidden="true">${window.Art ? window.Art.draw(w) : ""}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(w.name)}</span>${Follows.isNew(w) ? '<small class="nw"><span class="vh">, </span>new<span class="vh"> update</span></small>' : ""}</a>`).join("") : `<p class="side__foot" style="margin-top:0">Follow a project to see it here</p>`}
        <a class="si" href="${Paths.page(`profile.html#${u.handle}/following`)}">${ic("follow")}<span>All followed (${fol.length})</span></a>
        <hr><h4>Rooms</h4>
        ${rooms.map((r) => `<a class="si" href="${Paths.page(`browse.html?room=${r}`)}"><span>${r}</span><small>${works.filter((w) => w.room === r).length}</small></a>`).join("")}
        <div class="drawer-extra"><hr><div style="display:flex;gap:10px;align-items:center;padding:4px 12px">${langGroup()}</div><div class="drow"><span id="thm-l">Dark theme</span><button type="button" class="sw" data-sw="theme" role="switch" aria-checked="${theme.dark}" aria-labelledby="thm-l"><i></i></button></div>${signed ? "" : `<div style="display:flex;gap:8px;padding:12px"><a class="btn btn--line" href="#" data-in style="flex:1">Log in</a><a class="btn btn--acc" href="#" data-in style="flex:1">Sign up</a></div>`}</div>
        <hr><section class="sfoot" tabindex="-1" aria-label="About Hamster Nest"><p><b>Hamster Nest</b><br><span>by Hamster Hub, a technology community</span></p><p class="sfoot__c">${CONTACTS.map(([k, v, href, ext]) => `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""} aria-label="${k}: ${v}${ext ? " (opens in a new tab)" : ""}">${k === "Phone" ? v : k}</a>`).join('<span aria-hidden="true"> · </span>')}</p><p><a href="${Paths.page("settings.html")}">Settings</a></p><p>Projects, names and numbers on this page are sample data.</p></section></div>`;
  }
  const CONTACTS = [["Facebook", "Hamster Hub", "https://www.facebook.com/", 1], ["LINE", "@smart-school", "https://line.me/R/ti/p/@smart-school", 1], ["Phone", "090-060-2555", "tel:0900602555", 0], ["Instagram", "hamsterhub_ig", "https://www.instagram.com/hamsterhub_ig", 1]];
  function showAbout() {
    const sf = $("#side .sfoot"), smooth = motion.on ? "smooth" : "auto";
    if (!sf) return;
    if (mode === "mini") { expanded = true; layout(); dispatchEvent(new Event("resize")); }
    else if (mode !== "full" && !body.classList.contains("m-drawer")) openDrawer();
    sf.scrollIntoView({ behavior: smooth, block: "end" }); sf.focus({ preventScroll: true });
  }

  function tabs() {
    const t = $(".tabs2"); if (!t) return;
    t.innerHTML = `<a href="${Paths.page("browse.html")}"${page === "browse" ? ' aria-current="page"' : ""}>Browse</a><a href="${Paths.page("devlogs.html")}"${page === "devlogs" ? ' aria-current="page"' : ""}>Dev logs</a>`;
  }


  let mode = "";
  let expanded = null;
  function layout() {
    const w = innerWidth, ph = w < 900;
    body.classList.toggle("ph", ph); body.classList.toggle("dk", !ph);
    body.classList.toggle("detail", detail);
    body.classList.toggle("signed", Session.signedIn);
    const stored = Store.get("nest-menu");
    let m;
    if (ph || page === "project") m = "none";
    else if (w >= 1280) m = (expanded ?? stored !== "mini") ? "full" : "mini";
    else m = expanded ? "full" : "mini";
    if (body.classList.contains("m-drawer")) return;
    mode = m;
    body.classList.toggle("m-mini", m === "mini");
    body.classList.toggle("m-none", m === "none");
  }

  let lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    body.classList.add("m-drawer"); body.classList.remove("m-none", "m-mini");
    const sc = document.createElement("div"); sc.className = "d-scrim"; sc.addEventListener("click", closeDrawer); body.append(sc);
    $$('[data-act="menu"]').forEach((b) => b.setAttribute("aria-expanded", "true"));
    const first = $('#side [data-act="menu-close"]'); if (first) first.focus();
  }
  function closeDrawer() {
    if (!body.classList.contains("m-drawer")) return;
    body.classList.remove("m-drawer"); $$(".d-scrim").forEach((e) => e.remove());
    $$('[data-act="menu"]').forEach((b) => b.setAttribute("aria-expanded", "false"));
    layout();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function toggleMenu() {
    const w = innerWidth;
    if (w < 900 || page === "project") return body.classList.contains("m-drawer") ? closeDrawer() : openDrawer();
    if (w >= 1280) { const full = mode === "full"; expanded = !full; Store.set("nest-menu", full ? "mini" : "full"); }
    else expanded = mode !== "full";
    layout();
    dispatchEvent(new Event("resize"));
  }

  const Acct = {
    btn: null, inerted: [],
    get el() { return document.getElementById("acct-menu"); },
    items() { return this.el ? $$(".am__it", this.el) : []; },
    html(sheet) {
      const u = Session.user, m = Me.get();
      const n = Follows.list().filter((id) => works.some((w) => w.id === id)).length;
      const row = (icon, label, href) => `<a class="am__it" role="menuitem" tabindex="-1" href="${href}">${ic(icon)}<span>${label}</span>${icon === "follow" && n ? `<small aria-hidden="true">${n}</small>` : ""}</a>`;
      const who = `<div class="am__who" id="am-who">${avatar(40)}<span><b>${esc(m.name || u.name)}</b><small>@${esc(u.handle)}</small></span></div>`;
      const items = `${row("user", "Your profile", Paths.page(`profile.html#${u.handle}`))}${row("plus", "Build", Paths.page("post.html"))}${row("follow", "Following", Paths.page(`profile.html#${u.handle}/following`))}${row("gear", "Settings", Paths.page("settings.html"))}<div class="am__sep" role="separator"></div><button class="am__it" role="menuitem" tabindex="-1" type="button" data-am="out">${ic("out")}<span>Log out</span></button>`;
      return sheet
        ? `<div class="sheet-scrim" data-am="scrim"></div><div class="sheet acct-sheet am" id="acct-menu" role="dialog" aria-modal="true" aria-label="Account menu"><div class="grab" aria-hidden="true"></div>${who}<button type="button" class="x" data-am="close" aria-label="Close">${ic("x")}</button><div class="am__sep" aria-hidden="true"></div><div role="menu" aria-labelledby="am-who">${items}</div></div>`
        : `<div class="acct-menu am" id="acct-menu">${who}<div class="am__sep" aria-hidden="true"></div><div role="menu" aria-labelledby="am-who">${items}</div></div>`;
    },
    open(btn, last) {
      this.close();
      this.btn = btn;
      const sheet = innerWidth < 600;
      body.insertAdjacentHTML("beforeend", this.html(sheet));
      const m = this.el;
      if (sheet) {
        this.inerted = [...body.children].filter((x) => x !== m && !x.matches("[data-am=scrim],script") && !x.inert);
        this.inerted.forEach((x) => (x.inert = true));
      } else {
        const r = btn.getBoundingClientRect();
        m.style.right = `${root.clientWidth - r.right}px`; m.style.top = `${r.bottom + 4}px`;
      }
      btn.setAttribute("aria-expanded", "true");
      const it = this.items(); if (it.length) it[last ? it.length - 1 : 0].focus();
    },
    close(refocus) {
      $$("#acct-menu,[data-am=scrim]").forEach((e) => e.remove());
      this.inerted.forEach((x) => (x.inert = false)); this.inerted = [];
      $$('[data-act="acct"]').forEach((b) => b.setAttribute("aria-expanded", "false"));
      if (refocus && this.btn) this.btn.focus();
    },
    toggle(btn) { if (this.el) this.close(true); else this.open(btn); },
    key(e) {
      const it = this.items(), i = it.indexOf(document.activeElement);
      const go = (k) => { e.preventDefault(); it[(k + it.length) % it.length].focus(); };
      if (e.key === "ArrowDown") go(i + 1);
      else if (e.key === "ArrowUp") go(i < 0 ? -1 : i - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(-1);
      else if (e.key === "Escape") { e.preventDefault(); this.close(true); }
      else if (e.key === "Tab") this.close(true);
      else if (e.key === " " && i >= 0) { e.preventDefault(); it[i].click(); }
      else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const ch = e.key.toLocaleLowerCase();
        for (let k = 1; k <= it.length; k++) { const x = it[(i + k) % it.length]; if (x.textContent.trim().toLocaleLowerCase().startsWith(ch)) { e.preventDefault(); x.focus(); break; } }
      }
    },
  };
  function logout() {
    Acct.close();
    Session.signOut(); toast("Logged out");
    const b = [...$$(".tb [data-in]"), ...$$(".tb [data-act=menu]")].find((x) => x.offsetParent !== null); if (b) b.focus();
  }

  const search = { input: null, alt: null, onSubmit: null, paint() { if (this.alt && this.alt.value !== this.input.value) this.alt.value = this.input.value; } };
  function wireSearch() {
    const forms = $$(".tb form.srch"); if (!forms.length) return;
    search.input = $("input", forms[0]); search.alt = forms[1] ? $("input", forms[1]) : null;
    if (search.alt) search.alt.addEventListener("input", () => { search.input.value = search.alt.value; search.input.dispatchEvent(new Event("input", { bubbles: true })); });
    search.input.addEventListener("input", () => search.paint());
    forms.forEach((f) => f.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = search.input.value.trim();
      if (search.onSubmit) return search.onSubmit(q);
      if (q) location.href = Paths.page(`browse.html?q=${encodeURIComponent(q)}`);
    }));
    [search.input, search.alt].filter(Boolean).forEach((inp) => inp.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (inp.value) { search.input.value = ""; search.paint(); search.input.dispatchEvent(new Event("input", { bubbles: true })); }
      else if (body.classList.contains("srch-open")) closeSearch(); else inp.blur();
    }));
    const q0 = new URLSearchParams(location.search).get("q");
    if (q0 && !search.input.value) { search.input.value = q0; search.paint(); }
  }
  function openSearch() { body.classList.add("srch-open"); if (search.alt) search.alt.focus(); }
  function closeSearch() { body.classList.remove("srch-open"); const b = $('[data-act="search"]'); if (b) b.focus(); }

  let lastY = scrollY;
  function onScroll() {
    if (body.classList.contains("ph")) {
      const y = scrollY, down = y > lastY && y > 60;
      if (Math.abs(y - lastY) > 4) body.classList.toggle("scr-down", down);
      lastY = y;
    } else body.classList.remove("scr-down");
  }

  function wire() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-act],[data-in],.thm,.sw,.lang button");
      if (Acct.el && t && !t.matches('[data-act="acct"]')) Acct.close();
      if (!t) {
        const am = e.target.closest("[data-am]");
        if (am && am.dataset.am === "out") return logout();
        if (am) return Acct.close(true);
        if (Acct.el && (!e.target.closest("#acct-menu") || e.target.closest(".am__it"))) Acct.close();
        return;
      }
      if (t.matches("[data-in]")) { e.preventDefault(); Session.signIn(); toast(`Signed in as ${Session.user.name}`); return; }
      if (t.matches(".thm")) return theme.set(!theme.dark);
      if (t.matches(".sw[data-sw=theme]")) return theme.set(!theme.dark);
      if (t.matches(".sw[data-sw=anim]")) return motion.toggle();
      if (t.matches(".lang button")) return lang.set(t.dataset.lang || "en");
      const a = t.dataset.act;
      if (a === "menu") toggleMenu();
      else if (a === "menu-close") closeDrawer();
      else if (a === "search") openSearch();
      else if (a === "search-close") closeSearch();
      else if (a === "search-clear") { search.input.value = ""; search.paint(); search.input.dispatchEvent(new Event("input", { bubbles: true })); if (search.alt) search.alt.focus(); }
      else if (a === "acct") Acct.toggle(t);
      else if (a === "logout") { Session.signOut(); toast("Logged out"); }
    });
    addEventListener("keydown", (e) => {
      if (Acct.el) return Acct.key(e);
      const ab = e.target.closest && e.target.closest('[data-act="acct"]');
      if (ab && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); return Acct.open(ab, e.key === "ArrowUp"); }
      if (e.key === "Escape") {
        if (body.classList.contains("m-drawer")) { closeDrawer(); return; }
      }
      if (e.key === "Tab" && body.classList.contains("m-drawer")) {
        const f = $$("#side a[href], #side button").filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
      const a = document.activeElement, typing = a && (a.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName));
      if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey && search.input) {
        e.preventDefault();
        if (body.classList.contains("ph")) openSearch(); else { search.input.focus(); search.input.select(); }
      }
    });
    const press = (el) => { if (!el) return; el.classList.remove("press"); void el.offsetWidth; el.classList.add("press"); clearTimeout(el._pt); el._pt = setTimeout(() => el.classList.remove("press"), 520); };
    const sideBtn = (t) => t && t.closest && t.closest("#side .si, #side .btn, #side .ibtn, #side .lang button, #side .sw");
    document.addEventListener("click", (e) => {
      if (e.target.closest('#side a[href$="#about"]') && !e.ctrlKey && !e.metaKey && !e.shiftKey) { e.preventDefault(); showAbout(); }
    });
    document.addEventListener("click", (e) => {
      const f = e.target.closest('[data-act="follow"],[data-follow]'); if (!f) return;
      setTimeout(() => {
        const on = f.getAttribute("aria-pressed") === "true";
        f.classList.remove("f-on", "f-off"); void f.offsetWidth; f.classList.add(on ? "f-on" : "f-off");
        clearTimeout(f._ft); f._ft = setTimeout(() => f.classList.remove("f-on", "f-off"), 600);
      });
    });
    document.addEventListener("pointerdown", (e) => press(sideBtn(e.target)));
    document.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") press(sideBtn(e.target)); });
    addEventListener("resize", layout);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("nest:session", () => { render(); });
    addEventListener("nest:follows", () => sideMenu());
    addEventListener("nest:me", () => { Acct.close(); render(); });
    addEventListener("resize", () => { if (Acct.el) Acct.close(); });
    addEventListener("storage", (e) => {
      if (e.key === "nest-theme" || e.key === null) theme.paint(e.newValue === "dark" || (e.newValue !== "light" && darkMQ.matches));
      if (e.key === "nest-motion") motion.apply();
      if (e.key === "nest-lang" && e.newValue && e.newValue !== lang.cur) lang.set(e.newValue);
    });
  }

  function render() {
    const keep = search.input ? search.input.value : "";
    topBar(); sideMenu(); tabs(); layout(); wireSearch();
    if (keep) { search.input.value = keep; search.paint(); }
    paintLang(); thai();
  }

  try { const l = localStorage.getItem("nest-lang"); if (l === "th") root.lang = "th"; } catch (e) {}
  render(); motion.apply(); wire();
  if (location.hash === "#about") addEventListener("load", () => setTimeout(showAbout, 0), { once: true });
  if (window.NestSession) window.NestSession.search = search;
  return { I, ic, MARK, rankIcon, SIL, avatar, face, Me, esc, wb, thai, Follows, theme, motion, lang, search, Paths, closeDrawer, layout };
})();
