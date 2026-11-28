// Sample details for works and people: team, roles, contact, updates, awards, descriptions, profiles.
// The one place to swap for real data. Used by project.html and profile.html.
window.Details = (function () {
  "use strict";
  const { works, tiers } = window.NEST;
  const hue = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0) % 360;
  const seed = (s, n) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % n;
  // ---------- sample details, one place to swap for real data later ----------
  class SampleDetails {
    static ROLES = {
      Game: ["Lead, game design", "Programming", "Pixel art, animation", "Sound and music"],
      IoT: ["Lead, hardware", "Firmware", "Case design, 3D print", "Field testing"],
      Web: ["Lead, product", "Front end", "Back end, database", "Design"],
      Idea: ["Lead, the plan", "Money and numbers", "Talking to people", "Poster and pitch"],
    };
    static MORE = {
      Game: [["Fixed the jump that felt floaty", "Lowered gravity at the top of the jump and added coyote time."], ["Posted the two-player demo", "Both players on one keyboard, WASD and arrows."], ["New tileset for the caves", "Kaew redrew every rock so the two worlds look different."], ["Playtest at lunch", "Fourteen people played; most got stuck on the same ladder, so we moved it."], ["Music for the first level", "A short loop that speeds up when the lava rises."], ["First build that runs", "One room, one enemy, and a jump that felt wrong."]],
      IoT: [["Swapped to a cheaper sensor", "Same readings within 2 percent, half the price."], ["First prototype on the bench", "Breadboard, a power bank and a lot of tape."], ["Messages in Thai", "Alerts now come in Thai or English."], ["Survived a week of rain", "No water inside the case after seven days outdoors."], ["Battery test", "Two AA cells lasted 16 days with a reading every ten minutes."], ["Parts list posted", "Everything costs under 600 baht."]],
      Web: [["Moved to a new host", "Pages load in under a second from school Wi-Fi."], ["First version online", "Twelve classmates tried it on day one."], ["Search that understands Thai", "Typing part of a word now finds it."], ["Bigger buttons on phones", "Tested with the oldest phone in the class."], ["Teachers can post too", "A teacher account with its own page."], ["Wrote the help page", "Five questions people asked most."]],
      Idea: [["Wrote the one-page plan", "Who it's for, what it costs, and what we need first."], ["Asked thirty classmates", "Twenty-one said they would join."], ["Talked to the school office", "They said yes to a trial if a teacher signs."], ["Made the poster", "Put up in the canteen and on the class chat."], ["Ran the numbers again", "It still works if only eight people join."], ["The idea, on a napkin", "Where it all started, at lunch."]],
    };
    static AWARDS = [["Best of the school fair", "Science fair, Aug 2026"], ["People's pick", "Open house, Sep 2026"], ["Best newcomer", "Hamster Hub demo day, Oct 2026"]];
    constructor(w) { this.w = w; }
    links() {
      if (this.w.links) return this.w.links;
      const id = this.w.id, more = [["GitHub", `https://github.com/hamster-nest-sample/${id}`], ["Website", `https://${id}.hamster-nest-sample.example`], null][seed(id, 3)];
      return [["itch.io", `https://hamster-nest-sample.itch.io/${id}`], ...(more ? [more] : [])];
    }
    // a few paragraphs about the work, written the way a student would put it
    description() {
      const W = this.w, D = {
        Game: [`We started ${W.name} in a two-week game jam and kept going because people kept asking for the next level.`, "It runs on a school laptop without a graphics card, and two people can play on one keyboard.", "Next we want to add a level editor so the class can make their own maps."],
        IoT: [`${W.name} began as a science project and is now running every day.`, "The board is an ESP32 in a 3D-printed case. It sends a reading every ten minutes and a message when something is off.", "We are looking for a second place to test it before we make ten more."],
        Web: [`${W.name} is a small site we built because we needed it ourselves.`, "It works on old phones and slow school Wi-Fi, and it needs no sign-up to read.", "Teachers asked for a version for their own classes, so that is what we are building next."],
        Idea: [`${W.name} is still an idea, but a tested one.`, "We ran a one-week trial with friends and wrote down what worked and what didn't.", "We need one teacher or adult to back it before we try it with a whole class."],
      }[W.room];
      return D;                                               // the one-line blurb is already under the title
    }
    // how to reach the lead maker; sample values on reserved domains and a made-up number
    contact() { return SampleDetails.contactFor(this.w.maker, this.w); }
    static contactFor(name, w) {
      const h = name.toLowerCase(), n = String(1000 + seed(w.id, 9000)).padStart(4, "0");
      return [
        ["email", "Email", `${h}.${w.id.split("-")[0]}@student.example.ac.th`, `mailto:${h}.${w.id.split("-")[0]}@student.example.ac.th`],
        ["phone", "Phone", `08${seed(w.name, 10)}-${String(100 + seed(h, 900))}-${n}`, null],
        ["line", "LINE", `@${h}_${w.id.split("-")[0]}`, null],
      ];
    }
    team() {
      if (this.w.team) return this.w.team;
      const others = [...new Set(works.filter((x) => x.room === this.w.room && x.maker !== this.w.maker).map((x) => x.maker))];
      const size = 2 + seed(this.w.id, 3), start = seed(this.w.name, others.length);
      const names = [this.w.maker, ...Array.from({ length: size - 1 }, (_, i) => others[(start + i * 3) % others.length])];
      return names.map((n, i) => [n, SampleDetails.ROLES[this.w.room][i]]);
    }
    updates() {
      const ago = ["5 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "last month", "2 months ago"];
      const NOTE = { Game: "New caves, a new boss, and a checkpoint just before it.", IoT: "Lighter, sealed against rain, and the antenna now sits outside the box.",
        Web: "Every page got lighter: the home page went from 2 MB to 300 KB.", Idea: "We counted who came back in week two: eight out of ten." };
      return [[this.w.update.when, this.w.update.what, NOTE[this.w.room]], ...this.olderUpdates().map(([a, b], i) => [ago[i], a, b])];
    }
    // each work gets the room's older updates in its own order, so two works never read the same
    olderUpdates() {
      const all = SampleDetails.MORE[this.w.room], k = seed(this.w.id, all.length);
      return [...all.slice(k), ...all.slice(0, k)];
    }
    awards() {
      const t = tiers.find((x) => x.id === this.w.tier);
      const extra = SampleDetails.AWARDS.filter((_, i) => (seed(this.w.id, 5) >> i) & 1).slice(0, 2);
      return [[`${t.name} rank`, `Hamster Nest, place ${tiers.indexOf(t) * 10 + this.w.place} of 50`, true], ...extra.map(([a, b]) => [a, b, false])];
    }
  }


  // ---------- people ----------
  const SURNAME = ["Chaiyaporn", "Srisuk", "Wongsa", "Thongdee", "Kaewmanee", "Boonmee", "Rattanakul", "Sukprasert", "Phromma", "Intarasuk"];
  const GRADE = ["Grade 10", "Grade 11", "Grade 12"];
  const ROOM_ROLE = { Game: "Game maker", IoT: "Hardware tinkerer", Web: "Web builder", Idea: "Idea person" };
  const MOTTO = {
    Game: ["Make it fun for two people first. Then make it work.", "If the jump feels wrong, nothing else matters.", "Ship the small version on Friday."],
    IoT: ["If it can't survive the rain, it isn't done.", "Measure first, then argue.", "Cheap parts, careful code."],
    Web: ["It has to work on the oldest phone in class.", "Fewer pages, faster pages.", "Ask the user, not the group chat."],
    Idea: ["Try it with ten people before telling a hundred.", "A plan on one page beats a deck of thirty.", "Start with the people, not the app."],
  };
  const INTO = { Game: "Co-op games, pixel art, level design", IoT: "Sensors, 3D printing, field tests", Web: "Fast sites, Thai search, small tools", Idea: "Clubs, saving schemes, school projects" };
  const TOOLS = { Game: "Godot, Aseprite, a lot of paper", IoT: "ESP32, Fusion 360, a multimeter", Web: "HTML, a bit of Python, Figma", Idea: "Google Forms, spreadsheets, posters" };
  const OPEN = ["Team-ups, playtests, a summer internship", "Mentors, testers, small grants", "Feedback, a co-founder, school partners"];
  class Person {
    constructor(name) { this.name = name; }
    static all() { return [...new Set(works.flatMap((w) => new SampleDetails(w).team().map(([n]) => n)))]; }
    static find(handle) { return Person.all().find((n) => n.toLowerCase() === String(handle).toLowerCase()); }
    get handle() { return this.name.toLowerCase(); }
    get hue() { return hue(this.name); }
    // works they lead or belong to, best rank first; with their role on each
    works() {
      const rankOf = (w) => tiers.findIndex((t) => t.id === w.tier) * 100 + w.place;
      return works.map((w) => { const r = new SampleDetails(w).team().find(([n]) => n === this.name); return r ? { w, role: r[1], lead: w.maker === this.name } : null; })
        .filter(Boolean).sort((a, b) => rankOf(a.w) - rankOf(b.w));
    }
    get room() { const m = this.works(); return (m.find((x) => x.lead) || m[0]).w.room; }
    profile() {
      const room = this.room, i = seed(this.name, 3);
      return { full: `${this.name} ${SURNAME[seed(this.name, SURNAME.length)]}`, role: `${ROOM_ROLE[room]} · ${GRADE[i]}, Hamster Hub`, motto: MOTTO[room][i],
        about: `I make ${{ Game: "small games you can play on a school laptop", IoT: "gadgets that measure things around school", Web: "small sites people at school actually use", Idea: "plans for things the school is missing" }[room]}. I started in ${GRADE[Math.max(0, i - 1)].toLowerCase()} and haven't stopped. Ask me anything about the projects below.`,
        into: INTO[room], tools: TOOLS[room], open: OPEN[i], followers: 40 + seed(this.name, 220), joined: ["Jun 2025", "Nov 2025", "Feb 2026"][i] };
    }
    contact() { const m = this.works(); return SampleDetails.contactFor(this.name, (m.find((x) => x.lead) || m[0]).w); }
    // every update across their works, newest first (sample dates are relative words, so keep the work order)
    updates() {
      const order = ["today", "yesterday", "2 days ago", "3 days ago", "5 days ago", "last week", "1 week ago", "2 weeks ago", "3 weeks ago", "last month", "2 months ago"];
      return this.works().flatMap(({ w }) => new SampleDetails(w).updates().map(([when, what, more]) => ({ when, what, more, w })))
        .sort((a, b) => order.indexOf(a.when) - order.indexOf(b.when));
    }
    awards() { return this.works().flatMap(({ w }) => new SampleDetails(w).awards().filter((a) => !a[2]).map((a) => [...a, w])); }
  }
  return { SampleDetails, Person, hue, seed };
})();
