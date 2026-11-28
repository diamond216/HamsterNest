(function () {
  "use strict";
  const { works, tiers, rooms } = window.NEST;
  const { Person } = window.Details;
  const { ic, esc, Paths, thai } = window.NestShell;
  const { card } = window.NestFeed;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ME = new Person("Pim");
  const isPhone = () => innerWidth < 900;
  const PLATFORMS = { Game: ["Windows", "macOS", "Linux", "Web", "Android", "iOS"], IoT: ["ESP32", "Arduino", "Raspberry Pi", "Android", "iOS"], Web: ["Web", "Android", "iOS"], Idea: ["Pitch deck", "Poster", "Web"] };
  const LIMITS = { name: 40, line: 80, about: 900, files: 8, clip: 60 };

  class Draft {
    static KEY = "nest-post-draft";
    static blank() {
      const c = ME.contact();
      return { mode: "new", name: "", line: "", room: "", genres: [], platforms: [], about: "",
        team: [{ name: ME.name, role: "", you: true }],
        contact: { email: c[0][2], phone: c[1][2], line: c[2][2], showPhone: false },
        dl: { label: "", link: "" }, update: { work: "", title: "", text: "" }, savedAt: null };
    }
    static load() { try { return { ...Draft.blank(), ...JSON.parse(localStorage.getItem(Draft.KEY)) }; } catch (e) { return Draft.blank(); } }
    static save(d) { d.savedAt = Date.now(); try { localStorage.setItem(Draft.KEY, JSON.stringify(d)); } catch (e) {} }
    static clear() { try { localStorage.removeItem(Draft.KEY); } catch (e) {} }
  }

  class MediaField {
    constructor(root, onChange) {
      this.root = root; this.items = []; this.onChange = onChange;
      root.innerHTML = `<div class="drop" tabindex="0" role="button" aria-describedby="${root.id}-h"><span>Drop a clip or pictures here, or <b>choose files</b><br><span id="${root.id}-h">The first one becomes the cover (16:9). Up to ${LIMITS.files}, clips up to ${LIMITS.clip} seconds.</span></span><input type="file" accept="image/*,video/*" multiple hidden></div>
        <ol class="mlist" aria-label="Your clip and pictures, in order"></ol><p class="mnote" role="status" aria-live="polite"></p>`;
      const drop = $(".drop", root), input = $("input", root);
      drop.addEventListener("click", () => input.click());
      drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
      input.addEventListener("change", () => { this.add([...input.files]); input.value = ""; });
      ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
      ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-over")));
      drop.addEventListener("drop", (e) => { e.preventDefault(); this.add([...e.dataTransfer.files]); });
      this.paint();
    }
    note(t) { $(".mnote", this.root).textContent = t; }
    add(files) {
      const ok = files.filter((f) => /^(image|video)\//.test(f.type));
      if (ok.length < files.length) this.note("Some files were skipped: only pictures and clips can go here.");
      const room = LIMITS.files - this.items.length;
      if (ok.length > room) this.note(`Only ${LIMITS.files} fit. The first ${room} were added.`);
      ok.slice(0, Math.max(0, room)).forEach((f) => {
        const it = { url: URL.createObjectURL(f), video: f.type.startsWith("video/"), name: f.name, dur: null };
        this.items.push(it);
        if (it.video) {
          const v = document.createElement("video"); v.preload = "metadata"; v.src = it.url;
          v.addEventListener("loadedmetadata", () => { it.dur = v.duration; if (v.duration > LIMITS.clip) this.note(`${f.name} is ${Math.round(v.duration)} seconds. Keep clips under ${LIMITS.clip}; the page will only play the start.`); this.paint(); this.onChange(); });
        }
      });
      this.paint(); this.onChange();
    }
    move(i, to) { if (to < 0 || to >= this.items.length) return; const [it] = this.items.splice(i, 1); this.items.splice(to, 0, it); this.paint(); this.onChange(); }
    remove(i) { URL.revokeObjectURL(this.items[i].url); this.items.splice(i, 1); this.paint(); this.onChange(); }
    paint() {
      const list = $(".mlist", this.root), time = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
      list.innerHTML = this.items.map((it, i) => `<li class="mi" draggable="true" data-i="${i}">
          ${it.video ? `<video src="${it.url}" muted preload="metadata"></video>` : `<img src="${it.url}" alt="">`}
          <span class="mi__tag">${i === 0 ? (it.video ? "Cover · Clip" : "Cover") : it.video ? `Clip${it.dur ? ` · ${time(it.dur)}` : ""}` : `#${i + 1}`}</span>
          <span class="mi__acts"><button type="button" class="btn btn--line" data-a="left" aria-label="Move ${esc(it.name)} earlier"${i === 0 ? " disabled" : ""}>‹</button>${i ? `<button type="button" class="btn btn--line" data-a="cover" aria-label="Make ${esc(it.name)} the cover">Cover</button>` : ""}<button type="button" class="btn btn--line" data-a="right" aria-label="Move ${esc(it.name)} later"${i === this.items.length - 1 ? " disabled" : ""}>›</button><button type="button" class="btn btn--line" data-a="x" aria-label="Remove ${esc(it.name)}">×</button></span></li>`).join("");
      $$("[data-a]", list).forEach((b) => b.addEventListener("click", () => {
        const i = +b.closest(".mi").dataset.i, a = b.dataset.a;
        if (a === "left") this.move(i, i - 1); if (a === "right") this.move(i, i + 1); if (a === "cover") this.move(i, 0); if (a === "x") this.remove(i);
      }));
      $$(".mi[draggable]", list).forEach((li) => {
        li.addEventListener("dragstart", (e) => { this.dragFrom = +li.dataset.i; e.dataTransfer.effectAllowed = "move"; });
        li.addEventListener("dragover", (e) => { if (this.dragFrom != null) e.preventDefault(); });
        li.addEventListener("drop", (e) => { e.preventDefault(); e.stopPropagation(); if (this.dragFrom != null) this.move(this.dragFrom, +li.dataset.i); this.dragFrom = null; });
      });
    }
    get cover() { return this.items[0] || null; }
    get hasClip() { return this.items.some((it) => it.video); }
  }

  class TeamField {
    constructor(root, draft, onChange) {
      this.root = root; this.d = draft; this.onChange = onChange;
      this.people = Person.all().filter((n) => n !== ME.name).sort();
      this.paint();
    }
    paint() {
      const t = this.d.team;
      this.root.innerHTML = `<ul class="tmf">${t.map((m, i) => `<li><b>${esc(m.name)}</b><input class="in" type="text" value="${esc(m.role)}" placeholder="${i ? "What do they do?" : "What do you do? e.g. Lead, game design"}" aria-label="${esc(m.name)}'s role" data-i="${i}">${m.you ? '<span class="you">You</span>' : `<button type="button" class="ibtn x" data-i="${i}" aria-label="Remove ${esc(m.name)}">${ic("x")}</button>`}</li>`).join("")}</ul>
        <div class="tmf__add"><label class="vh" for="tm-name">Teammate's name</label><input class="in" id="tm-name" list="tm-people" placeholder="Teammate's name" autocomplete="off"><datalist id="tm-people">${this.people.map((n) => `<option value="${n}">`).join("")}</datalist><button type="button" class="btn btn--line add">Add a teammate</button></div>`;
      $$(".tmf input[data-i]", this.root).forEach((i) => i.addEventListener("input", () => { t[+i.dataset.i].role = i.value; this.onChange(); }));
      $$(".x", this.root).forEach((b) => b.addEventListener("click", () => { t.splice(+b.dataset.i, 1); this.paint(); this.onChange(); }));
      const n = $("#tm-name", this.root), add = () => {
        const name = n.value.trim().replace(/^\w/, (c) => c.toUpperCase()); if (!name) { n.focus(); return; }
        if (t.some((m) => m.name.toLowerCase() === name.toLowerCase())) { n.setCustomValidity("Already on the team"); n.reportValidity(); return; }
        t.push({ name, role: "" }); this.paint(); this.onChange(); $(".tmf li:last-child input", this.root).focus();
      };
      $(".add", this.root).addEventListener("click", add);
      n.addEventListener("keydown", (e) => { n.setCustomValidity(""); if (e.key === "Enter") { e.preventDefault(); add(); } });
    }
  }

  const fl = (label, req, input, extra = "") => `<label class="fl"><span>${label}${req ? ` <i>${req}</i>` : ""}</span>${input}${extra}</label>`;

  class PostPage {
    constructor(root) { this.root = root; this.d = Draft.load(); this.render(); }
    choice(name, options, picked, many) {
      return `<div class="seg" role="${many ? "group" : "radiogroup"}" aria-labelledby="${name}-l" data-name="${name}">${options.map((o) =>
        `<button type="button" class="chip" role="${many ? "checkbox" : "radio"}" aria-checked="${many ? picked.includes(o) : picked === o}" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>`;
    }
    render() {
      const d = this.d, mine = ME.works().filter((x) => x.lead);
      this.root.innerHTML = `<div class="pf"><div>
        <h1>Build</h1><p class="lead">Name, one line and room are enough to post. The rest can wait. <a href="#rules" class="rules-link">Posting guide and rules</a></p>
        <div class="seg mode" role="radiogroup" aria-label="What are you posting?" style="margin-bottom:16px"><button type="button" class="chip" role="radio" data-mode="new" aria-checked="${d.mode === "new"}">New project</button><button type="button" class="chip" role="radio" data-mode="update" aria-checked="${d.mode === "update"}">Update a project</button></div>
        <form novalidate>
          <div class="m-new">
            <section class="fs" id="s-basics"><h2>The basics</h2>
              ${fl("Name", "Required", `<input class="in" name="name" maxlength="${LIMITS.name}" value="${esc(d.name)}" placeholder="What is it called?" required>`, '<span class="cnt" data-for="name"></span>')}
              ${fl("One line about it", "Required", `<input class="in" name="line" maxlength="${LIMITS.line}" value="${esc(d.line)}" placeholder="What does it do, in one sentence?" required>`, '<span class="cnt" data-for="line"></span>')}
              <div class="fl"><span id="room-l">Room <i>Required</i></span>${this.choice("room", Object.keys(rooms), d.room, false)}</div>
              <div class="fl" id="genre-f"></div><div class="fl" id="plat-f"></div>
            </section>
            <section class="fs" id="s-media"><h2>Clip and pictures</h2><div id="media"></div></section>
            <section class="fs" id="s-about"><h2>About it</h2>
              ${fl("A few words about it", "Optional", `<textarea class="in ta" name="about" rows="4" maxlength="${LIMITS.about}" placeholder="How did it start? What does it do? What's next?">${esc(d.about)}</textarea>`, '<span class="cnt" data-for="about"></span>')}
              ${fl("Link", "Optional", `<input class="in" type="url" name="dlLink" value="${esc(d.dl.link)}" placeholder="https://">`)}</section>
            <section class="fs" id="s-team"><h2>Team and contact</h2><div id="team"></div>
              <div class="row3">${fl("Email", "", `<input class="in" type="email" name="email" value="${esc(d.contact.email)}">`)}${fl("LINE", "", `<input class="in" name="lineid" value="${esc(d.contact.line)}">`)}${fl("Phone", "Hidden unless you turn it on", `<input class="in" type="tel" name="phone" value="${esc(d.contact.phone)}">`)}</div>
              <div class="drow" style="padding:0"><span id="ph-l">Show my phone number on this project</span><button type="button" class="sw" role="switch" data-sw="phone" aria-checked="${d.contact.showPhone}" aria-labelledby="ph-l"><i></i></button></div></section>
          </div>
          <div class="m-update">
            <section class="fs"><h2>Which project?</h2><div class="pick" role="radiogroup" aria-label="Which project?">${mine.map(({ w }) => `<label class="pick__i"><input type="radio" name="uwork" value="${w.id}"${d.update.work === w.id ? " checked" : ""}><span class="pick__pic" data-id="${w.id}"></span><span><b>${esc(w.name)}</b><i>${tiers.find((t) => t.id === w.tier).name} · last update ${esc(w.update.when)}</i></span></label>`).join("")}</div></section>
            <section class="fs"><h2>What changed?</h2>
              ${fl("Title", "Required", `<input class="in" name="utitle" maxlength="60" value="${esc(d.update.title)}" placeholder="e.g. Added a second level">`, '<span class="cnt" data-for="utitle"></span>')}
              ${fl("A few words about it", "Optional", `<textarea class="in ta" name="utext" rows="4" maxlength="400" placeholder="What's new, and what should people try first?">${esc(d.update.text)}</textarea>`, '<span class="cnt" data-for="utext"></span>')}</section>
            <section class="fs"><h2>Show it <i style="font:400 13px var(--f);color:var(--t3)">Optional</i></h2><div id="umedia"></div></section>
          </div>
          <div class="pvw"></div>
          <div class="fbar"><span class="saved" aria-live="polite"></span><button type="button" class="btn btn--ghost" data-act="reset">Start over</button><button type="button" class="btn btn--line" data-act="save">Save for later</button><button type="submit" class="btn btn--acc">Post it</button></div>
        </form></div>
        <aside class="po__side"><section class="box pv2" aria-label="Preview"><h3>How it will look</h3><div class="pv2__body"></div></section><section class="box chk"><h3>Before it goes up</h3><ul></ul><p>Hamster Nest reads every new project within two days and checks it against the <a href="#rules" class="rules-link">posting rules</a>.</p></section></aside></div>`;
      this.media = new MediaField($("#media", this.root), () => this.update());
      this.umedia = new MediaField($("#umedia", this.root), () => this.update());
      this.team = new TeamField($("#team", this.root), d, () => this.update());
      $$(".pick__pic", this.root).forEach((el) => (el.innerHTML = window.Art.draw(works.find((w) => w.id === el.dataset.id))));
      this.place(); this.paintRoomParts(); this.wire(); this.update(false);
      if (d.savedAt && (d.name || d.update.title)) (d.mode === "update" ? this.umedia : this.media).note("Your draft is back. Pictures and clips aren't kept in a draft, so add them again.");
    }
    place() {
      const side = $(".po__side", this.root), pv = $(".pvw", this.root);
      if (isPhone()) { if (side.children.length) pv.append(...side.children); }
      else if (pv.children.length) side.append(...pv.children);
    }
    paintRoomParts() {
      const d = this.d, g = $("#genre-f", this.root), p = $("#plat-f", this.root);
      if (!d.room) { g.innerHTML = `<span>Genre <i>Pick a room first</i></span>`; p.innerHTML = ""; return; }
      d.genres = d.genres.filter((x) => rooms[d.room].includes(x)); d.platforms = d.platforms.filter((x) => PLATFORMS[d.room].includes(x));
      g.innerHTML = `<span id="genres-l">Genre <i>Pick one or two</i></span>${this.choice("genres", rooms[d.room], d.genres, true)}`;
      p.innerHTML = `<span id="platforms-l">${d.room === "Idea" ? "Shared as" : "Runs on"} <i>Optional</i></span>${this.choice("platforms", PLATFORMS[d.room], d.platforms, true)}`;
      this.wireChoices(g); this.wireChoices(p);
    }
    wireChoices(scope) {
      $$("[data-name]", scope).forEach((grp) => $$("button", grp).forEach((b) => b.addEventListener("click", () => {
        const name = grp.dataset.name, v = b.dataset.v, d = this.d;
        if (name === "room") { d.room = d.room === v ? "" : v; $$("button", grp).forEach((x) => x.setAttribute("aria-checked", String(x.dataset.v === d.room))); this.clearErr(grp); this.paintRoomParts(); }
        else if (name === "genres" && !d.genres.includes(v) && d.genres.length >= 2) { this.err(grp, "Two genres at most. Untick one first."); return; }
        else { const set = d[name]; set.includes(v) ? set.splice(set.indexOf(v), 1) : set.push(v); b.setAttribute("aria-checked", String(set.includes(v))); this.clearErr(grp); }
        this.update();
      })));
    }
    err(el, msg) {
      const f = el.closest(".fl, .fs"); if (!f) return;
      this.clearErr(el);
      f.classList.add("err");
      const id = `err-${Math.random().toString(36).slice(2, 7)}`;
      f.insertAdjacentHTML("beforeend", `<span class="ferr" id="${id}">${ic("alert")}${esc(msg)}</span>`);
      if (el.matches("input,textarea")) { el.setAttribute("aria-invalid", "true"); el.setAttribute("aria-describedby", id); }
    }
    clearErr(el) {
      const f = el.closest(".fl, .fs"); if (!f) return;
      f.classList.remove("err"); $$(".ferr", f).forEach((x) => x.remove());
      $$("[aria-invalid]", f).forEach((x) => { x.removeAttribute("aria-invalid"); x.removeAttribute("aria-describedby"); });
    }
    wire() {
      const f = $("form", this.root), d = this.d;
      $$(".rules-link", this.root).forEach((a) => a.addEventListener("click", (e) => { if (!window.NestGuide) return; e.preventDefault(); window.NestGuide.open("rules"); }));
      $$(".mode [data-mode]", this.root).forEach((b) => b.addEventListener("click", () => { d.mode = b.dataset.mode; $$(".mode [data-mode]", this.root).forEach((x) => x.setAttribute("aria-checked", String(x === b))); this.update(); }));
      this.wireChoices($("#s-basics", this.root));
      f.addEventListener("input", (e) => {
        const n = e.target.name; if (!n) return;
        const v = e.target.value;
        if (n in d && typeof d[n] === "string") d[n] = v;
        if (n === "email") d.contact.email = v; if (n === "phone") d.contact.phone = v; if (n === "lineid") d.contact.line = v;
        if (n === "dlLink") d.dl.link = v;
        if (n === "uwork") d.update.work = v; if (n === "utitle") d.update.title = v; if (n === "utext") d.update.text = v;
        this.clearErr(e.target);
        this.update();
      });
      f.addEventListener("change", (e) => { if (e.target.name === "uwork") { d.update.work = e.target.value; this.update(); } });
      $('[data-sw="phone"]', this.root).addEventListener("click", (e) => { d.contact.showPhone = !d.contact.showPhone; e.currentTarget.setAttribute("aria-checked", String(d.contact.showPhone)); this.update(); });
      $('[data-act="save"]', this.root).addEventListener("click", () => { Draft.save(d); this.stamp(true); });
      $('[data-act="reset"]', this.root).addEventListener("click", () => { const b = $('[data-act="reset"]', this.root); if (this.armed) { Draft.clear(); this.d = Draft.blank(); this.render(); scrollTo({ top: 0 }); return; } this.armed = true; b.textContent = "Click again to clear everything"; setTimeout(() => { this.armed = false; if (b.isConnected) b.textContent = "Start over"; }, 2500); });
      f.addEventListener("submit", (e) => { e.preventDefault(); this.submit(); });
      let was = isPhone(); addEventListener("resize", () => { if (isPhone() !== was) { was = isPhone(); this.place(); } });
    }
    stamp(now) {
      const s = $(".saved", this.root); if (!s) return; if (!this.d.savedAt) { s.textContent = ""; return; }
      const sec = Math.round((Date.now() - this.d.savedAt) / 1000);
      s.textContent = now || sec < 10 ? "Saved just now" : sec < 60 ? `Saved ${sec} seconds ago` : `Saved ${Math.round(sec / 60)} min ago`;
    }
    checks() {
      const d = this.d;
      if (d.mode === "update") return [
        ["Pick the project", !!d.update.work, true, ".pick", "Pick the project to update"], ["A title for the update", d.update.title.trim().length > 2, true, '[name="utitle"]', "Add a title to post"],
        ["A few words about it", d.update.text.trim().length > 10, false], ["A picture or a clip", this.umedia.items.length > 0, false]];
      return [
        ["A name", !!d.name.trim(), true, '[name="name"]', "Add a name to post"], ["One line about it", !!d.line.trim(), true, '[name="line"]', "Add one line to post"], ["A room", !!d.room, true, '[data-name="room"]', "Pick a room to post"],
        ["A cover picture", !!this.media.cover, false], ["A few words about it", d.about.trim().length > 40, false],
        ["Everyone on the team has a role", d.team.every((m) => m.role.trim()), false], ["A way to reach you", !!(d.contact.email || d.contact.line), false]];
    }
    update(save = true) {
      const d = this.d;
      this.root.classList.toggle("is-update", d.mode === "update");
      $$(".cnt[data-for]", this.root).forEach((c) => { const i = $(`[name="${c.dataset.for}"]`, this.root); c.textContent = `${i.value.length} / ${i.maxLength}`; });
      const ch = this.checks(), done = ch.filter((c) => c[1]).length;
      $(".chk ul", this.root).innerHTML = ch.map(([t, ok, req]) => `<li class="${ok ? "ok" : ""}"><span aria-hidden="true">${ok ? "✓" : "○"}</span><span>${t}${req ? " <i>Required</i>" : ""}</span><span class="vh">${ok ? ", done" : ", not yet"}</span></li>`).join("");
      $(".chk h3", this.root).innerHTML = `Before it goes up <span class="cnt">${done} / ${ch.length}</span>`;
      this.preview();
      if (save) { Draft.save(d); this.stamp(true); } else this.stamp();
    }
    preview() {
      const d = this.d, body = $(".pv2__body", this.root);
      if (d.mode === "update") {
        const w = works.find((x) => x.id === d.update.work);
        body.innerHTML = w ? `<p style="margin:0 0 8px;font-size:13px;color:var(--t3)">In the Updates of ${esc(w.name)}</p><div class="ups" style="margin:0"><ol><li><span><span class="new">new</span><time>today</time></span><div><b>${esc(d.update.title || "Your title")}</b><p>${esc(d.update.text || "A few words about it.")}</p></div></li></ol></div>` : `<p style="margin:0;font-size:14px;color:var(--t3)">Pick a project to see the update here.</p>`;
        return;
      }
      const base = works.find((x) => x.room === (d.room || "Game")) || works[0];
      const w = { ...base, id: "draft", name: d.name || "Your project's name", maker: ME.name, scribble: "" };
      body.innerHTML = card(w, 1, { noRank: true, upd: "Posted just now", href: "#", room: d.room || "Room" });
      const cover = this.media.cover, pic = $(".pc__pic", body);
      if (cover && pic) { const svg = $("svg", pic); if (svg) svg.outerHTML = cover.video ? `<video src="${cover.url}" muted autoplay loop playsinline style="width:100%;height:100%;object-fit:cover"></video>` : `<img src="${cover.url}" alt="" style="width:100%;height:100%;object-fit:cover">`; }
      const link = $(".pc__link", body); if (link) { link.removeAttribute("href"); link.setAttribute("aria-disabled", "true"); }
      thai(body);
    }
    submit() {
      const ch = this.checks(), miss = ch.filter((c) => c[2] && !c[1]), d = this.d;
      $$(".fl.err, .fs.err", this.root).forEach((x) => { x.classList.remove("err"); $$(".ferr", x).forEach((e) => e.remove()); $$("[aria-invalid]", x).forEach((e) => { e.removeAttribute("aria-invalid"); e.removeAttribute("aria-describedby"); }); });
      if (miss.length) {
        miss.forEach(([, , , sel, msg]) => { const el = $(sel, this.root); if (el) this.err(el, msg); });
        const first = $(miss[0][3], this.root);
        if (first) { first.scrollIntoView({ block: "center" }); (first.matches("input,textarea") ? first : $("button, input", first))?.focus({ preventScroll: true }); }
        return;
      }
      const w = works.find((x) => x.id === d.update.work);
      $(".pf", this.root).innerHTML = `<section class="empty" role="status" style="grid-column:1/-1;text-align:left"><h2 style="margin:0 0 8px;font:600 24px/1.25 var(--disp);color:var(--t1)">${d.mode === "update" ? `Update posted to ${esc(w.name)}` : `${esc(d.name)} is in the queue`}</h2>
        <p style="margin:0 0 8px">${d.mode === "update" ? "It shows at the top of the project's Updates." : "Hamster Nest reads every new project within two days. Once it's up, it starts in Bronze and climbs as you post updates."}</p>
        <p style="margin:0 0 16px;font-size:13px">This is a prototype, so nothing was sent.</p>
        <div style="display:flex;gap:8px"><a class="btn btn--line" href="${Paths.page("profile.html#pim")}">Go to your profile</a><button type="button" class="btn btn--acc" data-act="again">Post something else</button></div></section>`;
      Draft.clear();
      $('[data-act="again"]', this.root).addEventListener("click", () => { this.d = Draft.blank(); this.render(); scrollTo({ top: 0 }); });
      scrollTo({ top: 0 });
    }
  }

  window.NestSession.menuOptions = { requires: true };
  const host = $("#po");
  let stampTimer = 0;
  const start = () => {
    clearInterval(stampTimer);
    if (!window.NestSession.gate(host)) return;
    const page = new PostPage(host);
    if (page.d.mode === "new" && window.NestGuide && !/^#(rules?|after)/.test(location.hash)) window.NestGuide.auto();
    stampTimer = setInterval(() => page.stamp(), 15000);
  };
  start();
  addEventListener("nest:session", () => { host.innerHTML = ""; start(); });
})();
