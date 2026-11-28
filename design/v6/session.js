// Hamster Nest prototype: who is signed in, the paths between pages, and the parts every page shares
// (account menu, footer, "not built yet" note). Loaded by hero/index.html and every page in design/v6/.
//   Session      sign-in state in localStorage ("nest-session"); fires "nest:session" on window when it changes
//   Paths        absolute links to pages, worked out from where this file lives, so they hold from any folder
//   AccountMenu  the avatar menu (or Log in / Sign up), one per page; pages add items with opts.extra / opts.onPick
//   Footer       the dark Hamster Hub footer, filled into <footer class="foot nest-foot">
//   NavPill      the sliding highlight in the Browse · Dev logs · About pill
//   gate()       swaps a page's content for a short note when it needs you signed in
window.NestSession = (function () {
  "use strict";
  const BASE = new URL(".", document.currentScript.src);          // .../design/v6/
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const hue = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0) % 360;   // same as Person.hue in details.js

  const Paths = {
    page: (name) => new URL(name, BASE).href,
    home: (hash = "") => new URL("../../hero/index.html" + hash, BASE).href,
    browse: (room) => Paths.home(room ? `#browse-${room.toLowerCase()}` : "#browse-page"),
  };

  // who you are once signed in, in this prototype
  const ME = { name: "Pim", full: "Pim Srisuk", handle: "pim", line: "@pim" };

  // where the prototype keeps things: localStorage, or, where a sandboxed frame blocks it, window.name
  // (which survives moving between pages in the same tab)
  const Store = {
    get(k) {
      try { const v = localStorage.getItem(k); if (v !== null) return v; } catch (e) {}
      try { return JSON.parse(window.name || "{}")[k] ?? null; } catch (e) { return null; }
    },
    set(k, v) {
      try { localStorage.setItem(k, v); } catch (e) {}
      try { const o = JSON.parse(window.name || "{}"); if (v === null) delete o[k]; else o[k] = v; window.name = JSON.stringify(o); } catch (e) { window.name = JSON.stringify(v === null ? {} : { [k]: v }); }
    },
    drop(k) { try { localStorage.removeItem(k); } catch (e) {} this.set(k, null); try { localStorage.removeItem(k); } catch (e) {} },
  };
  const KEY = "nest-session";
  const Session = {
    read() { try { return JSON.parse(Store.get(KEY)) || {}; } catch (e) { return {}; } },
    get signedIn() { return !!this.read().in; },
    get user() { return ME; },
    signIn() { this.write({ in: true }); },
    signOut() { this.write({}); },
    write(s) { Store.set(KEY, JSON.stringify(s)); dispatchEvent(new CustomEvent("nest:session")); },
  };
  addEventListener("storage", (e) => { if (e.key === KEY) dispatchEvent(new CustomEvent("nest:session")); });

  const avatar = (u, cls) => `<span class="${cls}" style="--h:${hue(u.name)}" aria-hidden="true">${esc(u.name[0])}</span>`;
  const sameDoc = (href) => { const a = new URL(href, location.href), b = new URL(location.href); return a.pathname === b.pathname && a.hash === b.hash; };

  // ---------- account menu ----------
  // new AccountMenu(slot) draws Log in / Sign up, or the avatar button and its menu, into slot (every page's .acct).
  // opts.extra = [[label, go]] adds page-only items; opts.onPick(go, event) handles them (and may handle works/favs);
  // opts.requires = true sends you home when you log out (pages that need you signed in).
  class AccountMenu {
    constructor(slot, opts = {}) {
      this.slot = slot; this.o = opts; this.wrap = this.btn = this.menu = null;
      document.addEventListener("click", (e) => { if (this.menu && !this.menu.hidden && !e.composedPath().includes(this.wrap)) this.open(false); });
      addEventListener("keydown", (e) => { if (e.key === "Escape" && this.menu && !this.menu.hidden) { this.open(false); this.btn.focus(); } });
      addEventListener("nest:session", () => this.render());
      this.render();
    }
    items() {
      const u = Session.user;
      return [
        ["Your profile", Paths.page(`profile.html#${u.handle}`), "works"], ["Create", Paths.page("post.html")],
        ["Favourites", Paths.page(`profile.html#${u.handle}`), "favs"], "hr",
        ...(this.o.extra || []).map(([label, go]) => [label, null, go]),
        ...(this.o.extra && this.o.extra.length ? ["hr"] : []), ["Log out", null, "out"]];
    }
    render() {
      this.menu = null;
      if (!Session.signedIn) {
        this.slot.innerHTML = `<a class="gbtn glass acct__wide" href="#" data-in>Log in</a><a class="gbtn gbtn--solid acct__wide" href="#" data-in>Sign up</a>`
          + `<div class="me acct__mini"><button type="button" class="gbtn glass acct__ico" aria-haspopup="menu" aria-expanded="false" aria-label="Log in or sign up"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="7" r="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 17c1-3.3 3.5-5 6.5-5s5.5 1.7 6.5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>`
          + `<div class="me__menu" role="menu" hidden><button type="button" role="menuitem" data-in>Log in</button><button type="button" role="menuitem" data-in>Sign up</button></div></div>`;
        this.wrap = this.slot.querySelector(".acct__mini"); this.btn = this.wrap.firstElementChild; this.menu = this.wrap.lastElementChild;
        this.btn.addEventListener("click", () => this.open(this.menu.hidden));
        this.slot.querySelectorAll("[data-in]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); Session.signIn(); toast(`Signed in as ${Session.user.name}`); }));
        return;
      }
      this.slot.innerHTML = `<div class="me"><button type="button" class="me__btn" aria-haspopup="menu" aria-expanded="false" aria-label="Your account">${avatar(Session.user, "me__av")}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="me__menu" role="menu" hidden></div></div>`;
      this.wrap = this.slot.firstElementChild; this.btn = this.wrap.firstElementChild; this.menu = this.wrap.lastElementChild;
      this.btn.addEventListener("click", () => this.open(this.menu.hidden));
      this.fill();
    }
    fill() {
      const u = Session.user;
      let marked = false;
      this.menu.innerHTML = `<div class="me__head">${avatar(u, "me__big")}<b>${esc(u.full)}</b><i>${esc(u.line)}</i></div>` + this.items().map((it) => {
        if (it === "hr") return "<hr>";
        const [label, href, go] = it, here = href && !marked && sameDoc(href);
        if (here) marked = true;
        return href ? `<a role="menuitem" href="${href}"${go ? ` data-go="${go}"` : ""}${here ? ' aria-current="page"' : ""}>${esc(label)}</a>`
          : `<button type="button" role="menuitem" data-go="${go}">${esc(label)}</button>`;
      }).join("");
      this.menu.querySelectorAll("[data-go]").forEach((a) => a.addEventListener("click", (e) => this.pick(a.dataset.go, e)));
    }
    pick(go, e) {
      this.open(false);
      if (go === "out") { Session.signOut(); toast("Logged out"); if (this.o.requires) location.href = Paths.home(); return; }
      if (this.o.onPick) this.o.onPick(go, e);
    }
    open(on) {
      if (!this.menu) return;
      this.menu.hidden = !on; this.btn.setAttribute("aria-expanded", on);
      if (on) {
        if (!calm) this.menu.animate([{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }], { duration: 200, easing: "cubic-bezier(.2,.8,.2,1)" });
        this.menu.querySelector("[role=menuitem]").focus();
      }
    }
  }

  // ---------- footer: Hamster Hub and its contacts only (owner, 26 Nov 2026), plus the Animations switch ----------
  const ICON = {
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 12 2z"/></svg>',
    line: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="6" fill="currentColor"/><ellipse cx="12" cy="11.2" rx="8.4" ry="7.2" fill="#111116"/><path d="M9.2 17.4l-.7 3.1 4.2-2.9z" fill="#111116"/><text x="12" y="13.15" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="5.4" fill="currentColor">LINE</text></svg>',
    tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
  };
  // Hamster Hub's real channels (owner, 26 Nov 2026); the phone number opens the device's phone app (tel:)
  const CONTACTS = [
    ["fb", "Hamster Hub", "https://www.facebook.com/HamsterHubThailand", true],
    ["line", "@smart-school", "https://page.line.me/jkm4247u?openQrModal=true", true],
    ["tel", "090-060-2555", "tel:+66900602555", false],
    ["ig", "hamsterhub.official", "https://www.instagram.com/hamsterhub.official/", true],
  ];
  class Footer {
    constructor(el) {
      el.id = el.id || "contact-page";
      el.innerHTML = `<div class="wrap foot__top" id="about-page">
        <div class="foot__brand"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#FFD24A"/><circle cx="11" cy="12" r="5" fill="#F2A65A"/><circle cx="29" cy="12" r="5" fill="#F2A65A"/><ellipse cx="20" cy="23" rx="13" ry="11" fill="#F2A65A"/><ellipse cx="20" cy="27" rx="9" ry="7" fill="#FBEBDD"/><circle cx="15" cy="21" r="1.8" fill="#1A1A20"/><circle cx="25" cy="21" r="1.8" fill="#1A1A20"/></svg>
          <div><strong>Hamster Hub</strong><span>a technology community</span></div></div>
        <div class="foot__contact"><small>Get in touch</small><h3>Contacts</h3><ul>
          ${CONTACTS.map(([ic, label, href, ext]) => `<li><a href="${href}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${ICON[ic]}${label}</a></li>`).join("")}</ul></div></div>`;
      // Animations on / off (motion.js); switching reloads the page
      if (window.NestMotion) {
        const on = NestMotion.on, b = document.createElement("button");
        b.type = "button"; b.className = "foot__motion"; b.setAttribute("role", "switch"); b.setAttribute("aria-checked", on);
        b.innerHTML = `<span>Animations</span><i aria-hidden="true"></i><b>${on ? "On" : "Off"}</b>`;
        b.addEventListener("click", () => NestMotion.set(!on));
        el.appendChild(b);
      }
    }
  }

  // ---------- the Browse · Dev logs · About pill: the highlight slides to the link you choose (owner, 26 Nov 2026) ----------
  // select(a) moves it; pages can call it too (the home page does, as you scroll to About and back)
  class NavPill {
    constructor(nav) {
      this.nav = nav; this.links = [...nav.querySelectorAll("a")]; this.lock = 0;
      this.pill = document.createElement("span"); this.pill.className = "gnav__pill"; this.pill.setAttribute("aria-hidden", "true");
      nav.prepend(this.pill); nav.classList.add("has-pill");
      this.links.forEach((a) => a.addEventListener("click", () => this.select(a, true)));
      addEventListener("resize", () => this.place(false));
      this.place(false);
    }
    get current() { return this.links.find((a) => a.hasAttribute("aria-current")); }
    select(a, byClick = false) {
      if (!byClick && performance.now() < this.lock) return;          // a click wins over scrolling for a moment
      if (byClick) this.lock = performance.now() + 1100;
      if (a === this.current) return;
      this.links.forEach((x) => (x === a ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current")));
      this.place(true);
    }
    place(animate) {
      const a = this.current;
      this.pill.style.opacity = a ? 1 : 0; if (!a) return;
      if (!animate) this.pill.style.transition = "none";
      this.pill.style.width = a.offsetWidth + "px"; this.pill.style.transform = `translateX(${a.offsetLeft}px)`;
      if (!animate) { this.pill.offsetWidth; this.pill.style.transition = ""; }
    }
  }

  // ---------- small note at the bottom of the screen ----------
  function toast(msg) {
    const t = document.createElement("p"); t.className = "nest-toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t);
    const a = (k, o) => t.animate(k, o).finished;
    a([{ opacity: 0, transform: "translate(-50%,10px)" }, { opacity: 1, transform: "translate(-50%,0)" }], { duration: calm ? 1 : 250, fill: "forwards" })
      .then(() => a([{ opacity: 1 }, { opacity: 1 }], { duration: 2200 }))
      .then(() => a([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" })).then(() => t.remove());
  }
  // links to pages that don't exist yet say so instead of jumping to the top
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href="#"]');
    if (a && !a.hasAttribute("data-in")) { e.preventDefault(); toast(`"${a.textContent.trim()}" isn't built yet`); }
  });

  // ---------- pages that need you signed in (posting) ----------
  function gate(main) {
    if (Session.signedIn) return true;
    main.innerHTML = `<section class="gate"><span class="gate__ic" aria-hidden="true">✎</span>
      <h1>Sign in to post your project</h1>
      <p>Posting is free for every Hamster Hub student. Sign in and your draft is saved as you go.</p>
      <div class="gate__acts"><button type="button" class="post">Sign in</button><a class="ghost3" href="${Paths.home("#browse-page")}">Back to Browse</a></div></section>`;
    main.querySelector(".gate .post").addEventListener("click", () => { Session.signIn(); location.reload(); });
    return false;
  }

  class HeaderSearch {
    constructor(form) {
      this.form = form; this.input = form.querySelector("input"); this.clear = form.querySelector(".gclear"); this.bar = form.closest(".gbar__in"); this.onSubmit = null;
      this.phone = matchMedia("(max-width: 599px)");
      this.input.addEventListener("input", () => this.paint());
      this.clear.addEventListener("click", () => { this.set(""); this.input.focus(); });
      this.input.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        e.stopPropagation();
        if (this.input.value) this.set(""); else this.input.blur();
      });
      addEventListener("keydown", (e) => {
        const a = document.activeElement, typing = a && (a.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName));
        if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey && !document.documentElement.classList.contains("pl-on")) { e.preventDefault(); this.input.focus(); this.input.select(); }
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = this.input.value.trim();
        if (this.onSubmit) return this.onSubmit(q);
        if (q) location.href = Paths.page(`browse.html?q=${encodeURIComponent(q)}`);
      });
      this.phone.addEventListener("change", () => this.label());
      new MutationObserver(() => { this.label(); this.measure(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
      const ro = new ResizeObserver(() => this.measure());
      this.bar.querySelectorAll(".gleft, .gbar__end").forEach((el) => ro.observe(el));
      this.label(); this.paint(); this.measure();
    }
    set(v) { this.input.value = v; this.paint(); this.input.dispatchEvent(new Event("input", { bubbles: true })); }
    paint() { const has = !!this.input.value; this.form.classList.toggle("has-q", has); this.clear.hidden = !has; }
    label() {
      const th = document.documentElement.lang === "th";
      this.input.placeholder = this.phone.matches ? (th ? "ค้นหา" : "Search") : (th ? "ค้นหาโปรเจกต์ บันทึก และผู้สร้าง" : "Search projects, dev logs and makers");
    }
    measure() {
      const l = this.bar.querySelector(".gleft"), e = this.bar.querySelector(".gbar__end");
      this.bar.style.setProperty("--side", `${Math.max(l ? l.offsetWidth : 0, e ? e.offsetWidth : 0)}px`);
    }
  }
  const searchForm = document.querySelector(".gbar .gsearch");

  // every page: fill the footer and the account area once the page's own scripts have run
  // (a page that needs its own menu items sets NestSession.menuOptions before then)
  const api = { Session, Store, Paths, AccountMenu, Footer, gate, toast, hue, menuOptions: {}, search: searchForm ? new HeaderSearch(searchForm) : null };
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("footer.nest-foot").forEach((f) => new Footer(f));
    const nav = document.querySelector(".gnav"); if (nav) api.nav = new NavPill(nav);
    const slot = document.querySelector("div.acct");
    if (slot) api.menu = new AccountMenu(slot, api.menuOptions);
  });
  return api;
})();
