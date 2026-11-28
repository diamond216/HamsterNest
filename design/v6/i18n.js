window.NestI18n = (function () {
  "use strict";
  const root = document.documentElement;
  const D = {
    "Skip to content": "ข้ามไปยังเนื้อหา", "Build": "สร้าง", "Create": "สร้าง", "Browse": "สำรวจ", "Dev logs": "บันทึกการพัฒนา", "View your profile": "ดูโปรไฟล์ของคุณ",
    "Log out": "ออกจากระบบ", "Log in": "เข้าสู่ระบบ", "Sign up": "สมัครสมาชิก", "Home": "หน้าแรก", "About": "เกี่ยวกับ", "Following": "กำลังติดตาม",
    "Follow": "ติดตาม", "new": "ใหม่", "update": "อัปเดต", "Rooms": "ห้อง", "Dark theme": "ธีมมืด", "Your profile": "โปรไฟล์ของคุณ",
    "Follow a project to see it here": "ติดตามโปรเจกต์เพื่อดูที่นี่", "Game": "เกม", "Web": "เว็บ", "Idea": "ไอเดีย", "All projects": "ทุกโปรเจกต์", "All categories": "ทุกหมวดหมู่","All": "ทั้งหมด",
    "See the project": "ดูโปรเจกต์", "Browse projects": "สำรวจโปรเจกต์", "Filters": "ตัวกรอง", "Projects": "โปรเจกต์", "Most updates": "อัปเดตมากที่สุด",
    "Name A to Z": "ชื่อ A ถึง Z", "Maker A to Z": "ผู้สร้าง A ถึง Z", "by Hamster Hub, a technology community": "โดย Hamster Hub ชุมชนเทคโนโลยี",
    "Contacts": "ช่องทางติดต่อ", "Phone": "โทรศัพท์", "Animations": "ภาพเคลื่อนไหว",
    "Projects, names and numbers on this page are sample data.": "โปรเจกต์ ชื่อ และตัวเลขในหน้านี้เป็นข้อมูลตัวอย่าง",
    "Menu": "เมนู", "Hamster Nest home": "หน้าแรก Hamster Nest", "Search Hamster Nest": "ค้นหาใน Hamster Nest", "Search": "ค้นหา", "Language": "ภาษา",
    "Close search": "ปิดการค้นหา", "Clear": "ล้าง", "Sections": "ส่วนต่าง ๆ", "Main": "เมนูหลัก", "Close menu": "ปิดเมนู", "Featured projects": "โปรเจกต์แนะนำ",
    "Previous slide": "สไลด์ก่อนหน้า", "Next slide": "สไลด์ถัดไป", "Pause background video": "หยุดวิดีโอพื้นหลัง", "Play background video": "เล่นวิดีโอพื้นหลัง", "Pause the slides and video": "หยุดสไลด์และวิดีโอ", "Play the slides and video": "เล่นสไลด์และวิดีโอ",
    "Rooms and filters": "ห้องและตัวกรอง", "Sort projects": "เรียงโปรเจกต์", "Rank": "อันดับ", "Room": "ห้อง", "Genre": "ประเภท", "Runs on": "ใช้งานบน",
    "Settings": "ตั้งค่า", "Account menu": "เมนูบัญชี", "Video": "วิดีโอ", "Latest update": "อัปเดตล่าสุด", "These settings are saved in this browser on this device.": "การตั้งค่านี้บันทึกไว้ในเบราว์เซอร์บนอุปกรณ์นี้", "Display": "การแสดงผล", "Theme": "ธีม", "Device": "ตามอุปกรณ์", "Light": "สว่าง", "Dark": "มืด", "Follows your device.": "ตามการตั้งค่าของอุปกรณ์", "Now light.": "ตอนนี้: สว่าง", "Now dark.": "ตอนนี้: มืด", "Saved for this browser.": "บันทึกไว้สำหรับเบราว์เซอร์นี้", "Menus, buttons and labels. Project names and texts stay as their makers wrote them.": "เมนู ปุ่ม และป้ายต่าง ๆ ชื่อและข้อความของโปรเจกต์จะแสดงตามที่ผู้สร้างเขียนไว้", "Home video, video on project cards, and fades.": "วิดีโอหน้าแรก วิดีโอบนการ์ดโปรเจกต์ และการเฟด", "Starts off when your device asks for less motion.": "ปิดไว้ก่อนหากอุปกรณ์ขอให้ลดการเคลื่อนไหว", "Your device asks for less motion, so this started off.": "อุปกรณ์ของคุณขอให้ลดการเคลื่อนไหว จึงปิดไว้ตั้งแต่แรก", "Account": "บัญชี", "You are not logged in": "ยังไม่ได้เข้าสู่ระบบ", "Log in to share what you build and edit your profile.": "เข้าสู่ระบบเพื่อแชร์สิ่งที่คุณสร้างและแก้ไขโปรไฟล์",
    "Clear all": "ล้างทั้งหมด", "Close": "ปิด", "Logged out": "ออกจากระบบแล้ว",
    "Back": "กลับ", "Back to Home": "กลับหน้าแรก", "Back to Browse": "กลับไปหน้าสำรวจ", "Back to Dev logs": "กลับไปบันทึกการพัฒนา", "Contact": "ติดต่อ",
    "Last update": "อัปเดตล่าสุด", "Made by": "สร้างโดย", "Updates": "อัปเดต", "Links": "ลิงก์", "Team": "ทีม", "Email": "อีเมล", "Copy": "คัดลอก",
    "Copied": "คัดลอกแล้ว", "Awards": "รางวัล", "More projects": "โปรเจกต์อื่น ๆ", "Previous picture": "ภาพก่อนหน้า", "Next picture": "ภาพถัดไป",
    "Pictures": "ภาพ", "Updates, newest first": "อัปเดต ล่าสุดก่อน",
    "Edit profile": "แก้ไขโปรไฟล์", "Sort": "เรียง", "Newest": "ใหม่สุด", "Oldest": "เก่าสุด", "Popular": "ยอดนิยม", "Best rank": "อันดับดีที่สุด", "Newest update": "อัปเดตล่าสุด", "Into": "สนใจ", "Tools": "เครื่องมือ",
    "Open to": "เปิดรับ", "Joined": "เข้าร่วมเมื่อ", "followers": "ผู้ติดตาม", "Choose picture": "เลือกรูป", "Remove picture": "ลบรูป", "Display name": "ชื่อที่แสดง",
    "Bio": "แนะนำตัว", "Cancel": "ยกเลิก", "Save": "บันทึก", "Pick a picture file.": "เลือกไฟล์รูปภาพ", "New picture ready. Save to keep it.": "รูปใหม่พร้อมแล้ว กดบันทึกเพื่อเก็บไว้",
    "Picture removed. Save to keep it.": "ลบรูปแล้ว กดบันทึกเพื่อยืนยัน", "That picture could not be opened.": "เปิดรูปนี้ไม่ได้", "Add a display name": "ใส่ชื่อที่แสดง",
    "Check the email address": "ตรวจสอบที่อยู่อีเมล",
    "Name, one line and room are enough to post. The rest can wait.": "แค่ชื่อ คำอธิบายหนึ่งบรรทัด และห้อง ก็โพสต์ได้แล้ว ที่เหลือค่อยเติมทีหลัง",
    "Posting guide and rules": "คู่มือและกฎการโพสต์", "New project": "โปรเจกต์ใหม่", "Update a project": "อัปเดตโปรเจกต์", "The basics": "ข้อมูลพื้นฐาน", "Name": "ชื่อ",
    "Required": "จำเป็น", "One line about it": "คำอธิบายหนึ่งบรรทัด", "Pick a room first": "เลือกห้องก่อน", "Clip and pictures": "คลิปและภาพ",
    "Drop a clip or pictures here, or": "วางคลิปหรือภาพที่นี่ หรือ", "choose files": "เลือกไฟล์",
    "The first one becomes the cover (16:9). Up to 8, clips up to 60 seconds.": "ไฟล์แรกจะเป็นภาพปก (16:9) ได้สูงสุด 8 ไฟล์ คลิปยาวไม่เกิน 60 วินาที",
    "About it": "เกี่ยวกับโปรเจกต์", "A few words about it": "เล่าสั้น ๆ", "Optional": "ไม่บังคับ", "Link": "ลิงก์", "Team and contact": "ทีมและการติดต่อ", "You": "คุณ",
    "Teammate's name": "ชื่อเพื่อนร่วมทีม", "Add a teammate": "เพิ่มเพื่อนร่วมทีม", "Hidden unless you turn it on": "ซ่อนไว้จนกว่าคุณจะเปิด",
    "Show my phone number on this project": "แสดงเบอร์โทรของฉันในโปรเจกต์นี้", "Which project?": "โปรเจกต์ไหน", "What changed?": "มีอะไรเปลี่ยนไป", "Title": "หัวข้อ",
    "Show it": "แสดง", "Start over": "เริ่มใหม่", "Save for later": "บันทึกไว้ก่อน", "Post it": "โพสต์เลย", "How it will look": "หน้าตาเมื่อโพสต์",
    "New · not ranked yet": "ใหม่ · ยังไม่จัดอันดับ", "Your project's name": "ชื่อโปรเจกต์ของคุณ", "Posted just now": "โพสต์เมื่อสักครู่", "Before it goes up": "ก่อนโพสต์",
    "A name": "ชื่อ", "A room": "ห้อง", "A cover picture": "ภาพปก", "Everyone on the team has a role": "ทุกคนในทีมมีบทบาท", "A way to reach you": "ช่องทางติดต่อคุณ",
    ", not yet": ", ยังไม่ครบ", ", done": ", ครบแล้ว", "Hamster Nest reads every new project within two days and checks it against the": "Hamster Nest อ่านทุกโปรเจกต์ใหม่ภายในสองวัน และตรวจตาม",
    "posting rules": "กฎการโพสต์", "Posting guide": "คู่มือการโพสต์", "How to post on Hamster Nest": "วิธีโพสต์บน Hamster Nest", "A good post": "โพสต์ที่ดี",
    "The rules": "กฎ", "After you post": "หลังโพสต์", "Don't open this when I start a new project": "ไม่ต้องเปิดคู่มือนี้เมื่อเริ่มโปรเจกต์ใหม่", "Start posting": "เริ่มโพสต์",
    "What are you posting?": "คุณจะโพสต์อะไร", "What is it called?": "ชื่ออะไร", "What does it do, in one sentence?": "ทำอะไรได้ ในหนึ่งประโยค",
    "Your clip and pictures, in order": "คลิปและภาพของคุณ ตามลำดับ", "How did it start? What does it do? What's next?": "เริ่มต้นอย่างไร ทำอะไรได้ ต่อไปจะทำอะไร",
    "What do you do? e.g. Lead, game design": "คุณทำอะไร เช่น หัวหน้าทีม ออกแบบเกม", "e.g. Added a second level": "เช่น เพิ่มด่านที่สอง",
    "What's new, and what should people try first?": "มีอะไรใหม่ และควรลองอะไรก่อน", "Preview": "ตัวอย่าง", "Close the guide": "ปิดคู่มือ",
    "Add a name to post": "ใส่ชื่อก่อนโพสต์", "Add a title to post": "ใส่หัวข้อก่อนโพสต์", "Pick the project to update": "เลือกโปรเจกต์ที่จะอัปเดต", "Pick the project": "เลือกโปรเจกต์",
    "A title for the update": "หัวข้อของอัปเดต", "Sign in to post your project": "เข้าสู่ระบบเพื่อโพสต์โปรเจกต์", "Sign in": "เข้าสู่ระบบ",
    "All ranks": "ทุกอันดับ", "Categories and ranks": "หมวดหมู่และอันดับ",
    "Browsing history": "ประวัติการเข้าชม", "No projects viewed yet": "ยังไม่ได้เปิดดูโปรเจกต์ใด",
  };
  const MON = { Jan: "ม.ค.", Feb: "ก.พ.", Mar: "มี.ค.", Apr: "เม.ย.", May: "พ.ค.", Jun: "มิ.ย.", Jul: "ก.ค.", Aug: "ส.ค.", Sep: "ก.ย.", Sept: "ก.ย.", Oct: "ต.ค.", Nov: "พ.ย.", Dec: "ธ.ค." };
  const WHEN = /^(today|yesterday|last week|last month|(\d+) (day|week|month)s? ago)$/i;
  const when = (s) => {
    const m = s.match(WHEN); if (!m) return null;
    const k = m[1].toLowerCase();
    if (k === "today") return "วันนี้"; if (k === "yesterday") return "เมื่อวาน"; if (k === "last week") return "สัปดาห์ที่แล้ว"; if (k === "last month") return "เดือนที่แล้ว";
    return `${m[2]} ${{ day: "วัน", week: "สัปดาห์", month: "เดือน" }[m[3].toLowerCase()]}ที่แล้ว`;
  };
  const TAB = "(เปิดในแท็บใหม่)";
  const P = [
    [/^(.+) \(opens in a new tab\)$/, (m) => `${tr(m[1]) || m[1]} ${TAB}`],
    [/^(.+) · Hamster Nest$/, (m) => `${tr(m[1]) || m[1]} · Hamster Nest`],
    [/^(.+) · Runs on (.+)$/, (m) => `${tr(m[1]) || m[1]} · ใช้งานบน ${m[2]}`],
    [/^All followed \((\d+)\)$/, (m) => `ที่ติดตามทั้งหมด (${m[1]})`],
    [/^(\d+) (projects?|logs?)$/, (m) => `${m[1]} ${/^p/.test(m[2]) ? "โปรเจกต์" : "บันทึก"}`],
    [/^Show (\d+) (projects?|logs?)$/, (m) => `แสดง ${m[1]} ${/^p/.test(m[2]) ? "โปรเจกต์" : "บันทึก"}`],
    [/^Show all (\d+) updates$/, (m) => `ดูอัปเดตทั้งหมด ${m[1]} รายการ`],
    [/^Updated (.+)$/, (m) => `อัปเดต${when(m[1]) || m[1]}`],
    [/^No (projects|logs) match (.+)$/, (m) => `ไม่พบ${m[1] === "logs" ? "บันทึก" : "โปรเจกต์"}ที่ตรงกับ ${m[2]}`],
    [/^Signed in as (.+)$/, (m) => `เข้าสู่ระบบเป็น ${m[1]}`],
    [/^Account menu, (.+)$/, (m) => `เมนูบัญชี, ${m[1]}`],
    [/^Follow (.+)$/, (m) => `ติดตาม ${m[1]}`],
    [/^Show (.+)$/, (m) => `แสดง ${m[1]}`],
    [/^Contact (.+)$/, (m) => `ติดต่อ ${m[1]}`],
    [/^About (.+)$/, (m) => `เกี่ยวกับ ${m[1]}`],
    [/^See the project: (.+)$/, (m) => `ดูโปรเจกต์: ${m[1]}`],
    [/^(Facebook|LINE|Phone|Instagram): (.+)$/, (m) => `${D[m[1]] || m[1]}: ${m[2]}`],
    [/^Clip and pictures of (.+)$/, (m) => `คลิปและภาพของ ${m[1]}`],
    [/^(Play|Pause) the clip of (.+)$/, (m) => `${m[1] === "Play" ? "เล่น" : "หยุด"}คลิปของ ${m[2]}`],
    [/^Clip, (\d+) of (\d+)$/, (m) => `คลิป, ${m[1]} จาก ${m[2]}`],
    [/^Picture (\d+) of (\d+)$/, (m) => `ภาพ ${m[1]} จาก ${m[2]}`],
    [/^(.+) · #(\d+) of (\d+)$/, (m) => `${m[1]} · อันดับ ${m[2]} จาก ${m[3]}`],
    [/^Profile picture of (.+)$/, (m) => `รูปโปรไฟล์ของ ${m[1]}`],
    [/^(.+)'s profile$/, (m) => `โปรไฟล์ของ ${m[1]}`],
    [/^(.+)'s role$/, (m) => `บทบาทของ ${m[1]}`],
    [/^(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept?|Oct|Nov|Dec)$/, (m) => `${m[1]} ${MON[m[2]]}`],
    [/^(.+), (.+), (.+)\. Open the project's updates$/, (m) => `${m[1]}, ${m[2]}, ${when(m[3]) || m[3]} เปิดอัปเดตของโปรเจกต์`],
    [/^(.+ · .+) · (.+)$/, (m) => (when(m[2]) ? `${m[1]} · ${when(m[2])}` : null)],
    [/^(@\S+) · (\d+) projects · (\d+) dev logs$/, (m) => `${m[1]} · ${m[2]} โปรเจกต์ · ${m[3]} บันทึก`],
    [/^(\d+) projects · (\d+) as lead$/, (m) => `${m[1]} โปรเจกต์ · เป็นหัวหน้า ${m[2]}`],
    [/^(.+) · last update (.+)$/, (m) => `${m[1]} · อัปเดตล่าสุด${when(m[2]) || m[2]}`],
    [/^, new, not ranked yet$/, () => ", ใหม่, ยังไม่จัดอันดับ"],
    [/^, (.+), (.+)$/, (m) => (when(m[2]) ? `, ${m[1]}, ${when(m[2])}` : null)],
    [/^by (.+)$/, (m) => `โดย ${m[1]}`],
  ];
  function tr(s) {
    if (D[s]) return D[s];
    const w = when(s); if (w) return w;
    for (const [re, fn] of P) { const m = s.match(re); if (m) { const r = fn(m); if (r) return r; } }
    return null;
  }
  const wrap = (v) => { const k = v.trim(); if (!k) return null; const t = tr(k); return t ? v.replace(k, () => t) : null; };

  const TXT = new WeakMap(), ATT = new WeakMap(), ATTRS = ["aria-label", "placeholder", "title"];
  const th = () => root.lang === "th";
  const skip = (el) => !el || !!el.closest("svg,script,style,[translate=no]");
  function text(n) {
    if (skip(n.parentElement) || n.parentElement.closest("textarea")) return;
    const v = n.nodeValue, r = TXT.get(n);
    const en = r && (v === r.th || v === r.en) ? r.en : v;
    const out = th() ? wrap(en) || en : en;
    TXT.set(n, { en, th: out });
    if (v !== out) n.nodeValue = out;
  }
  function attr(el, a) {
    if (skip(el)) return;
    const v = el.getAttribute(a); if (v === null) return;
    let m = ATT.get(el); if (!m) ATT.set(el, (m = {}));
    const r = m[a], en = r && (v === r.th || v === r.en) ? r.en : v;
    const out = th() ? wrap(en) || en : en;
    m[a] = { en, th: out };
    if (v !== out) el.setAttribute(a, out);
  }
  function walk(node) {
    if (node.nodeType === 3) return text(node);
    if (node.nodeType !== 1) return;
    ATTRS.forEach((a) => node.hasAttribute(a) && attr(node, a));
    const tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n; while ((n = tw.nextNode())) { if (n.nodeType === 3) text(n); else ATTRS.forEach((a) => n.hasAttribute(a) && attr(n, a)); }
  }
  let docTitle = null;
  function title() {
    const v = document.title, en = docTitle && (v === docTitle.th || v === docTitle.en) ? docTitle.en : v;
    const out = th() ? wrap(en) || en : en;
    docTitle = { en, th: out };
    if (v !== out) document.title = out;
  }
  function apply() { walk(document.body); title(); }
  const mo = new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "childList") m.addedNodes.forEach(walk);
      else if (m.type === "characterData") text(m.target);
      else if (m.type === "attributes") attr(m.target, m.attributeName);
    }
    title();
  });
  mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  new MutationObserver(title).observe(document.head, { childList: true, subtree: true, characterData: true });
  if (th()) apply();
  return { apply, tr };
})();
