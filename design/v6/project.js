(function () {
  "use strict";
  const { works, tiers } = window.NEST;
  const { SampleDetails } = window.Details;
  const { ic, esc, wb, thai, History, Back, Paths, face, rankIcon } = window.NestShell;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DAYS = { today: 0, yesterday: 1, "2 days ago": 2, "3 days ago": 3, "4 days ago": 4, "5 days ago": 5, "6 days ago": 6, "last week": 7, "1 week ago": 8, "2 weeks ago": 14, "3 weeks ago": 21, "last month": 30, "2 months ago": 60 };
  const isPhone = () => innerWidth < 900;
  const dday = (when) => { if (!(when in DAYS)) return ""; const d = new Date(); d.setDate(d.getDate() - DAYS[when]); return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
  const back = () => {
    let f = ""; try { f = sessionStorage.getItem("nest-from") || ""; } catch (e) {}
    const via = Back.label();
    if (f === "Home") return [via || "Back to Home", Paths.home()];
    if (f === "Dev logs") return [via || "Back to Dev logs", Paths.page("devlogs.html")];
    return [via || (f === "Browse" ? "Back to Browse" : "Back"), Paths.page("browse.html")];
  };
  const FIG = [0, 2, 3, 6];
  const slides = () => [{ clip: true, frame: 0 }, ...[1, 2, 3, 4].map((f) => ({ clip: false, frame: f }))];

  class ProjectPage {
    constructor(root) { this.root = root; this.preview = null; this.at = 0; }
    render(w) {
      this.w = w;
      const d = new SampleDetails(w), ups = d.updates(), t = tiers.find((x) => x.id === w.tier);
      const place = tiers.indexOf(t) * 10 + w.place, team = d.team(), links = d.links(), ch = d.contact().filter(([k]) => k !== "phone");
      const more = this.similar(w).slice(0, isPhone() ? 4 : 10), [bl, bh] = back(), ph = isPhone();
      this.ch = ch;
      document.title = `${w.name} · Hamster Nest`;
      this.root.innerHTML = `<div class="phead"><div><a class="backl" href="${bh}">${ic("back")}${esc(bl)}</a><span class="pmeta">${esc(w.genre)} / ${w.platforms.map(esc).join(" / ")}</span><div class="wt"><h1>${esc(w.name)}</h1><span class="tag">${esc(w.room)}</span></div><p class="pitch">${esc(w.blurb)}</p></div>
        <div class="owner sumbox"><dl><div><dt>Rank</dt><dd>${rankIcon(w.tier, 18)}${t.name} · #${place} of ${works.length}</dd></div><div><dt>Updated</dt><dd>${esc(w.update.when[0].toUpperCase() + w.update.when.slice(1))}</dd></div><div><dt>Made by</dt><dd>${team.map(([n]) => esc(n)).join(", ")}</dd></div><div><dt>Runs on</dt><dd>${w.platforms.map(esc).join(", ")}</dd></div></dl></div></div>
        <div class="watch"><div>
          <div class="galw"><div class="gal" role="region" aria-label="Clip and pictures of ${esc(w.name)}" tabindex="0"><span class="gal__art"></span><button type="button" class="gal__play" aria-pressed="false" aria-label="Play the clip of ${esc(w.name)}" style="border:0;cursor:pointer">${ic("play")}</button><button type="button" class="gal__nav" data-go="-1" style="left:12px;border:0;cursor:pointer" aria-label="Previous picture">${ic("back")}</button><button type="button" class="gal__nav" data-go="1" style="right:12px;border:0;cursor:pointer" aria-label="Next picture">${ic("next")}</button><span class="gal__count"></span></div>
            <div class="thumbs" role="group" aria-label="Pictures">${slides().map((s, i) => `<button type="button" data-i="${i}" aria-label="${i ? `Picture ${i + 1} of 5` : "Clip, 1 of 5"}"><span>${window.Art.draw({ ...w, scribble: "" }, s.frame)}</span></button>`).join("")}</div></div>
          <div class="desc">${d.description().map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          <section class="ups" id="updates" aria-labelledby="ups-h"><h2 id="ups-h">Updates <span class="cnt">${ups.length}</span></h2><div class="upsbox"${ph ? "" : ' tabindex="0" role="region" aria-label="Updates, newest first"'}><ol>${ups.map(([when, what, note], i) => `<li${ph && i > 2 ? " hidden" : ""}><span>${i ? "" : '<span class="new">new</span>'}<time><span class="dd">${dday(when)}</span>${esc(when)}</time></span><div><b>${esc(what)}</b><p>${esc(note)}</p>${FIG.includes(i) ? `<figure><img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(window.Art.draw({ ...w, scribble: "" }, i + 1))}" alt="${esc(what)}, image" width="168" height="95"${i ? ' loading="lazy"' : ""} decoding="async" style="display:block;width:100%;height:100%;object-fit:cover"></figure>` : ""}</div></li>`).join("")}</ol></div>${ph && ups.length > 3 ? `<button type="button" class="btn btn--line showall" data-act="allups">Show all ${ups.length} updates</button>` : ""}</section>
        </div><aside>
          ${links.length ? `<section class="box"><h3>Links</h3>${links.map(([k, u]) => `<a class="lk" href="${esc(u)}" target="_blank" rel="noopener"><span class="li">${ic("link")}</span><span><b>${esc(k)}</b><span>${wb(u.replace(/^https?:\/\//, ""))}</span></span></a>`).join("")}</section>` : ""}
          <section class="box"><h3>Team</h3>${team.map(([n, r]) => `<div class="tm tm--av">${face(n)}<span class="tmw"><a class="tmn" href="${Paths.page(`profile.html#${n.toLowerCase()}`)}">${esc(n)}</a><span>${esc(r)}</span></span></div>`).join("")}</section>
          ${ch.length ? `<section class="box cbox" id="contact" aria-labelledby="contact-h"><h3 id="contact-h">Contact</h3>${this.contactRows()}</section>` : ""}
          <section class="box"><h3>Awards</h3>${d.awards().map(([a, s]) => `<div class="tm" style="display:block"><b>${esc(a)}</b><br><span>${esc(s)}</span></div>`).join("")}</section>
          <div class="side-list"><h3>More projects</h3>${more.map((x, i) => `<a class="sl" href="${Paths.page(`project.html#${x.id}`)}"><span class="p" aria-hidden="true">${window.Art.draw(x, i % 7)}</span><span><span class="slr"><b>${esc(x.name)}</b><span class="tag">${esc(x.room)}</span></span><span>${esc(x.maker)}</span><span>Updated ${esc(x.update.when)}</span></span></a>`).join("")}</div>
        </aside></div>`;
      this.gallery(w);
      thai(this.root);
    }
    gallery(w) {
      const gal = $(".gal", this.root), art = $(".gal__art", gal), play = $(".gal__play", gal), thumbs = $$(".thumbs button", this.root), list = slides(), bare = { ...w, scribble: "" };
      const still = document.documentElement.classList.contains("calm") || matchMedia("(prefers-reduced-motion: reduce)").matches;
      let userPaused = false;
      const setPlay = (on) => {
        play.setAttribute("aria-pressed", String(on)); play.setAttribute("aria-label", `${on ? "Pause" : "Play"} the clip of ${w.name}`); play.innerHTML = ic(on ? "pause" : "play");
        if (!this.preview) return;
        if (!on) return this.preview.stop();
        const p = this.preview, r = p.start();
        if (r && r.then) r.then((ok) => { if (!ok && this.preview === p) setPlay(false); });
      };
      const go = (i) => {
        if (this.preview) { this.preview.stop(); this.preview = null; }
        $$(".gal > :not(.gal__art):not(.gal__play):not(.gal__nav):not(.gal__count)", this.root).forEach((e) => e.remove());
        this.at = Math.max(0, Math.min(list.length - 1, i));
        const s = list[this.at];
        art.innerHTML = window.Art.draw(bare, s.frame);
        play.hidden = !s.clip;
        if (s.clip && window.Previews) { this.preview = window.Previews.for(gal, bare); gal.lastElementChild.className = "gal__clip"; gal.append(play, ...$$(".gal__nav, .gal__count", gal)); setPlay(!still && !userPaused); }
        $(".gal__count", gal).textContent = `${this.at + 1} / ${list.length}`;
        thumbs.forEach((t, k) => (k === this.at ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current")));
      };
      gal.addEventListener("click", (e) => { const n = e.target.closest("[data-go]"); if (n) go(this.at + +n.dataset.go); if (e.target.closest(".gal__play")) { const on = play.getAttribute("aria-pressed") !== "true"; userPaused = !on; setPlay(on); } });
      gal.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(this.at + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(this.at - 1); } });
      thumbs.forEach((t, i) => { t.addEventListener("click", () => go(i)); t.addEventListener("focus", () => t.scrollIntoView({ block: "nearest", inline: "nearest" })); });
      go(0);
    }
    similar(w) {
      const score = (x) => (x.room === w.room ? 4 : 0) + (x.genre === w.genre ? 3 : 0) + x.platforms.filter((p) => w.platforms.includes(p)).length;
      return works.filter((x) => x.id !== w.id).map((x) => [x, score(x)]).sort((a, b) => b[1] - a[1] || tiers.findIndex((t) => t.id === a[0].tier) - tiers.findIndex((t) => t.id === b[0].tier)).map(([x]) => x);
    }
    contactRows() { return this.ch.map(([, k, v]) => `<div class="crow"><b>${esc(k)}</b><span>${wb(v)}</span><button type="button" class="cp" data-v="${esc(v)}">${ic("copy")}<span>Copy</span></button></div>`).join(""); }
    wire() {
      document.addEventListener("click", (e) => {
        const b = e.target.closest("[data-act], .cp");
        if (!b) return;
        if (b.matches(".cp")) {
          const done = () => { $("span", b).textContent = "Copied"; setTimeout(() => { if (b.isConnected) $("span", b).textContent = "Copy"; }, 1600); };
          (navigator.clipboard ? navigator.clipboard.writeText(b.dataset.v) : Promise.reject()).then(done, done);
          return;
        }
        const a = b.dataset.act;
        if (a === "allups") { $$(".ups li", this.root).forEach((li) => (li.hidden = false)); b.remove(); }
      });
    }
    stop() { if (this.preview) this.preview.stop(); }
  }

  const page = new ProjectPage($("#proj"));
  page.wire();
  const show = () => {
    const [id, part] = decodeURIComponent(location.hash.slice(1)).split("&"), w = works.find((x) => x.id === id) || works[0];
    page.stop(); page.render(w); History.add(w.id);
    const ups = part === "updates" && $("#updates");
    scrollTo({ top: ups ? ups.getBoundingClientRect().top + scrollY - 72 : 0, behavior: "auto" });
  };
  addEventListener("hashchange", show); show();
})();
